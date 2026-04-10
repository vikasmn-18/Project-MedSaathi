import re
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

# ── Training data ──────────────────────────────────────────
# Each row: [haemoglobin, blood_sugar, systolic_bp, creatinine, abnormal_count]
# Label: 0=Normal, 1=Mild Concern, 2=Critical

X_train = np.array([
    # Normal cases
    [14.0, 90,  120, 0.9, 0],
    [13.5, 85,  118, 1.0, 0],
    [15.0, 95,  115, 0.8, 0],
    [13.0, 88,  122, 1.1, 0],
    [14.5, 92,  119, 0.9, 1],
    [12.5, 99,  125, 1.0, 1],

    # Mild concern
    [11.0, 140, 135, 1.2, 2],
    [10.5, 130, 138, 1.3, 2],
    [11.5, 150, 140, 1.4, 3],
    [10.0, 160, 142, 1.5, 3],
    [12.0, 145, 136, 1.2, 2],
    [11.0, 155, 139, 1.3, 2],

    # Critical
    [7.0,  250, 170, 2.5, 5],
    [6.5,  280, 175, 3.0, 6],
    [8.0,  230, 165, 2.0, 4],
    [6.0,  300, 180, 3.5, 7],
    [7.5,  260, 172, 2.8, 5],
    [5.5,  310, 185, 4.0, 8],
])

y_train = np.array([0,0,0,0,0,0, 1,1,1,1,1,1, 2,2,2,2,2,2])

# Train the model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

LABELS = {
    0: {"risk_level": "Normal",       "emoji": "✅", "color": "green",  "advice": "Your report looks healthy! Keep up your good habits."},
    1: {"risk_level": "Mild Concern", "emoji": "⚠️", "color": "orange", "advice": "Some values need attention. Please consult a doctor soon."},
    2: {"risk_level": "Critical",     "emoji": "🔴", "color": "red",    "advice": "Urgent: Please see a doctor immediately. Do not ignore these results."},
}

# ── Helpers to extract values from report text ─────────────

def extract_number(pattern, text, default):
    match = re.search(pattern, text, re.IGNORECASE)
    if match:
        try:
            return float(match.group(1))
        except:
            return default
    return default

def count_abnormal(text):
    text_lower = text.lower()
    count = 0
    abnormal_keywords = [
        'high', 'low', 'abnormal', 'reactive', 'positive',
        'seen', 'present', 'elevated', 'reduced', 'deficient',
        'critical', 'danger', 'alert'
    ]
    # Don't count "non reactive" or "not seen" as abnormal
    safe_keywords = ['non reactive', 'not seen', 'absent', 'normal', 'negative']
    
    for keyword in abnormal_keywords:
        if keyword in text_lower:
            # Check it's not preceded by "non" or "not"
            is_safe = any(safe in text_lower for safe in safe_keywords if keyword in safe)
            if not is_safe:
                count += text_lower.count(keyword)
    return min(count, 10)  # cap at 10


def predict_risk(report_text):
    try:
        # Extract key values from report
        haemoglobin   = extract_number(r'haemoglobin[:\s]+(\d+\.?\d*)', report_text, 13.5)
        blood_sugar   = extract_number(r'(?:blood sugar|glucose|fasting)[:\s]+(\d+\.?\d*)', report_text, 90)
        systolic_bp   = extract_number(r'(?:bp|blood pressure)[:\s]+(\d+)', report_text, 120)
        creatinine    = extract_number(r'creatinine[:\s]+(\d+\.?\d*)', report_text, 1.0)
        abnormal_count = count_abnormal(report_text)

        features = np.array([[haemoglobin, blood_sugar, systolic_bp, creatinine, abnormal_count]])

        prediction = model.predict(features)[0]
        probabilities = model.predict_proba(features)[0]
        confidence = round(float(max(probabilities)) * 100, 1)

        result = LABELS[prediction].copy()
        result["confidence"] = confidence
        result["extracted"] = {
            "haemoglobin": haemoglobin,
            "blood_sugar": blood_sugar,
            "systolic_bp": systolic_bp,
            "creatinine": creatinine,
            "abnormal_count": abnormal_count
        }
        return result

    except Exception as e:
        print("RISK ENGINE ERROR:", str(e))
        return {
            "risk_level": "Unknown",
            "emoji": "❓",
            "color": "gray",
            "advice": "Could not assess risk automatically. Please consult a doctor.",
            "confidence": 0
        }


if __name__ == "__main__":
    test_report = """
    Haemoglobin: 9.5 g/dL
    Blood Sugar Fasting: 198 mg/dL
    Blood Pressure: 145/90
    Creatinine: 1.8 mg
    Micro Filaria: SEEN
    HBsAg: REACTIVE
    """
    result = predict_risk(test_report)
    print("Risk Level:", result['risk_level'])
    print("Confidence:", result['confidence'], "%")
    print("Advice:", result['advice'])
    print("Extracted values:", result['extracted'])