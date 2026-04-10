from ner_engine import extract_medical_entities, build_medical_context
from flask import send_file, Flask, request, jsonify
from pdf_generator import generate_pdf
import uuid
from ocr_engine import extract_text
import tempfile
from flask_cors import CORS
from groq import Groq
import os
from dotenv import load_dotenv
from risk_engine import predict_risk

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

DOCTOR_PROMPT = """You are MedSaathi Doctor Mode - a precise, professional medical report assistant for doctors.

Provide a clear, structured, and clinical summary of the medical report.

Structure your response exactly like this:

1. **Patient Details**: Age, Name (if available), Date

2. **Key Abnormal Findings**:
   - List only abnormal values with actual numbers and reference range
   - Highlight clinical significance briefly

3. **Normal Parameters**: List important normal values

4. **Clinical Impression**: One short paragraph summarizing the overall picture

5. **Recommendations**: Any suggested follow-up tests or actions (only if clearly indicated in report)

Rules:
- Use proper medical terminology.
- Be concise, accurate and objective.
- Do not add unnecessary explanations or reassurance.
- Do not give treatment advice.
- Focus on facts from the report only.
- Use bullet points and clear formatting.

Respond in English only for Doctor Mode."""

SYSTEM_PROMPT =  """You are MedSaathi, a very kind, patient and warm medical report explainer for Indian families.

You are speaking to a 66-year-old grandmother or family members who may not have studied much science.

Rules you MUST follow:
- Use extremely simple words. No medical jargon at all.
- Explain like you are talking to your own grandmother.
- Use short sentences.
- Give real-life examples when possible.
- Mark every test result clearly as: Normal [Normal], High [High], Low [Low]
- For any abnormal value, give one simple practical tip in easy language.
- Speak in a reassuring, caring tone.
- End with a clear overall summary in 2-3 lines.

Always start with: "Namaste! Aapki report ko main bahut simple bhasha mein samjhaati hoon..."

Respond fully in the selected language (Hindi, Kannada, Tamil, etc.).
Be warm, respectful and easy to understand."""


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"})


@app.route('/upload', methods=['POST'])
def upload_report():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    ext = os.path.splitext(file.filename)[1].lower()

    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
        file.save(tmp.name)
        temp_path = tmp.name

    try:
        extracted_text = extract_text(temp_path)
        if not extracted_text or extracted_text.strip() == "":
            extracted_text = "Could not extract text. Please try a clearer image or typed PDF."
        return jsonify({
            "success": True,
            "text": extracted_text,
            "filename": file.filename
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(temp_path):
            os.unlink(temp_path)


@app.route('/analyze', methods=['POST'])
def analyze_report():
    data = request.get_json()
    report_text = data.get('report_text', '').strip()
    language = data.get('language', 'English')

    if not report_text:
        return jsonify({"error": "Empty report"}), 400

    try:
        entities = extract_medical_entities(report_text)
        enriched_context = build_medical_context(report_text, entities)
        risk_result = predict_risk(report_text)

        family_response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            max_tokens=900,
            temperature=0.7,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Language: {language}\n\n{enriched_context}"}
            ]
        )
        family_summary = family_response.choices[0].message.content

        doctor_response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            max_tokens=700,
            temperature=0.5,
            messages=[
                {"role": "system", "content": DOCTOR_PROMPT},
                {"role": "user", "content": f"{enriched_context}"}
            ]
        )
        doctor_summary = doctor_response.choices[0].message.content

        return jsonify({
            "family_summary": family_summary,
            "doctor_summary": doctor_summary,
            "entities": entities,
            "risk": risk_result
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/download-pdf', methods=['POST'])
def download_pdf():
    try:
        data = request.get_json()
        summary = data.get('summary', '')
        language = data.get('language', 'English')

        if not summary:
            return jsonify({"error": "No summary provided"}), 400

        content = f"""MedSaathi - Medical Report Summary
Language: {language}

{summary}

Generated by MedSaathi | For informational purposes only"""

        filename = f"MedSaathi_Report_{language}.txt"
        filepath = os.path.join(tempfile.gettempdir(), filename)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

        return send_file(
            filepath,
            as_attachment=True,
            download_name=filename,
            mimetype='text/plain'
        )
    except Exception as e:
        print("DOWNLOAD ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


@app.route('/ask', methods=['POST'])
def ask_question():
    data = request.get_json()
    question = data.get('question', '').strip()
    report_context = data.get('report_context', '')
    language = data.get('language', 'English')

    if not question:
        return jsonify({"error": "No question provided"}), 400
    if not report_context:
        return jsonify({"error": "No report context provided"}), 400

    try:
        entities = extract_medical_entities(report_context)
        enriched_context = build_medical_context(report_context, entities)

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            max_tokens=600,
            temperature=0.4,
            messages=[{
                "role": "user",
                "content": f"""You are MedSaathi, a strict and honest medical assistant.

Here is the patient's actual medical report:
{enriched_context}

Very Important Rules:
- Answer ONLY using information present in the report above.
- If the question is about medicine, dosage, or treatment NOT in the report, say kindly that it is not in the report and to consult a doctor.
- Do not give any medical advice beyond what is in the report.
- Keep answer very short and direct — 3 to 4 sentences only.
- Always answer in {language} language.

Patient's question: "{question}"
"""
            }]
        )
        return jsonify({"answer": response.choices[0].message.content})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    print("MedSaathi backend running at http://127.0.0.1:5000")
    app.run(debug=True)