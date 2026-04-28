# Project-MedSaathi





# 🏥 MedSaathi — AI Medical Report Explainer for India

> **Your medical report, explained simply — in your language, in under 30 seconds.**

MedSaathi is a free, AI-powered web app that helps Indian families understand complex medical lab reports. Paste or upload any report and get a clear, plain-language summary — in Hindi, Tamil, Telugu, Kannada, Bengali, or English.

---

## 🌟 Features

- **📋 Dual Mode Summaries** — Family Mode explains in simple words; Doctor Mode gives a clinical summary for physicians
- **🌐 6 Indian Languages** — Hindi, Tamil, Telugu, Kannada, Bengali, English
- **🔊 Voice Readout** — Listens and speaks summaries aloud using your browser's speech API
- **🎤 Voice Input** — Ask questions about your report by speaking
- **⚠️ Risk Assessment** — ML-powered risk classification (Green / Orange / Red) with confidence score
- **📲 WhatsApp Sharing** — Share Family or Doctor summaries directly on WhatsApp in one tap
- **📄 PDF/Image Upload** — Upload scanned reports (JPG, PNG) or typed PDFs — OCR extracts the text automatically
- **💬 Q&A Chatbot** — Ask follow-up questions about your report; anxiety-detection routes to a calm companion mode
- **🔒 Privacy First** — No login required, no data stored

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Axios |
| Backend | Python, Flask, Flask-CORS |
| AI Model | Groq API (LLaMA 3.3 70B) |
| OCR | Custom OCR Engine |
| NLP | Custom NER Engine for medical entities |
| Risk ML | Custom risk prediction engine |
| PDF Export | Custom PDF generator |

---

## 📁 Project Structure

```
Project-MedSaathi/
├── backend/
│   ├── app.py              # Main Flask server & API routes
│   ├── ner_engine.py       # Medical named entity recognition
│   ├── ocr_engine.py       # OCR for image/PDF extraction
│   ├── pdf_generator.py    # Report PDF generation
│   ├── risk_engine.py      # ML risk assessment
│   ├── requirements.txt    # Python dependencies
│   └── .env                # Environment variables (not committed)
└── frontend1/
    ├── src/
    │   └── App.js          # Main React app
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- A [Groq API key](https://console.groq.com)

### Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo GROQ_API_KEY=your_key_here > .env

# Start the backend
python app.py
```

Backend runs at: `http://127.0.0.1:5000`

### Frontend Setup

```bash
cd frontend1
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

---

## 🌐 Deployment

### Backend → Render

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `gunicorn app:app --bind 0.0.0.0:$PORT` |
| Environment Variable | `GROQ_API_KEY` = your key |

### Frontend → Vercel

1. Import the GitHub repo on [vercel.com](https://vercel.com)
2. Set Root Directory to `frontend1`
3. Add environment variable: `REACT_APP_API_URL` = your Render backend URL
4. Deploy

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/upload` | Upload PDF or image, returns extracted text |
| POST | `/analyze` | Analyze report text, returns family + doctor summaries |
| POST | `/ask` | Ask a question about the report |
| POST | `/download-pdf` | Download report summary as text file |

---

## 🧠 How It Works

1. User uploads or pastes a medical report
2. OCR engine extracts text from images/PDFs
3. NER engine identifies medical entities (values, units, test names)
4. Risk engine classifies overall health risk (Green/Orange/Red)
5. Groq LLaMA 3.3 70B generates two summaries — one for family, one for doctors
6. User can ask follow-up questions; anxiety keywords route to a special calm companion mode
7. Summaries can be read aloud, shared on WhatsApp, or downloaded

---

## ⚠️ Disclaimer

MedSaathi provides AI-generated summaries for **informational purposes only**. It does **not** replace professional medical advice. Please consult a qualified doctor for diagnosis or treatment.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

Built with ❤️ for India 🇮🇳
