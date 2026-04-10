from transformers import pipeline
import re

# Lazy loading - model will load only when first needed
ner_pipeline = None

def get_ner_pipeline():
    global ner_pipeline
    if ner_pipeline is None:
        print("🔄 Loading medical NER model... (first time may take 1-2 minutes)")
        ner_pipeline = pipeline(
            "token-classification",
            model="d4data/biomedical-ner-all",
            aggregation_strategy="simple"
        )
        print("✅ Medical NER model loaded successfully!")
    return ner_pipeline


def extract_medical_entities(text):
    """Extract medical entities from report text"""
    if not text or len(text.strip()) < 10:
        return {"diseases": [], "medicines": [], "tests": [], "values": [], "other": []}

    try:
        pipe = get_ner_pipeline()
        results = pipe(text[:512])   # Limit to avoid memory issues

        entities = {
            "diseases": [],
            "medicines": [],
            "tests": [],
            "values": [],
            "other": []
        }

        for entity in results:
            word = entity['word'].replace('##', '').strip()
            label = entity['entity_group'].upper()
            score = entity['score']

            if score < 0.65 or len(word) < 2:
                continue

            if any(x in label for x in ['DISEASE', 'DISORDER', 'SYMPTOM']):
                if word not in entities["diseases"]:
                    entities["diseases"].append(word)
            elif any(x in label for x in ['DRUG', 'MEDICINE', 'CHEMICAL']):
                if word not in entities["medicines"]:
                    entities["medicines"].append(word)
            elif any(x in label for x in ['TEST', 'PROCEDURE', 'LAB']):
                if word not in entities["tests"]:
                    entities["tests"].append(word)
            else:
                if word not in entities["other"]:
                    entities["other"].append(word)

        return entities

    except Exception as e:
        print(f"NER Error: {e}")
        return {"diseases": [], "medicines": [], "tests": [], "values": [], "other": []}


def build_medical_context(report_text, entities):
    """Build enriched context for Groq"""
    context = f"MEDICAL REPORT:\n{report_text}\n\n"

    if entities.get("diseases"):
        context += f"CONDITIONS: {', '.join(entities['diseases'])}\n"
    if entities.get("tests"):
        context += f"TESTS: {', '.join(entities['tests'])}\n"
    if entities.get("medicines"):
        context += f"MEDICINES: {', '.join(entities['medicines'])}\n"

    return context
