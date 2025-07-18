from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
from patient_feedback.hf_config import HF_MODEL_REPO

# Chargement
tokenizer = AutoTokenizer.from_pretrained(HF_MODEL_REPO)
model = AutoModelForSequenceClassification.from_pretrained(HF_MODEL_REPO)
model.eval()

# Mapping 3 classes pour ce modèle CardiffNLP
label_mapping = {
    0: "negative",
    1: "neutral",
    2: "positive"
}

def predict_text(text: str):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        logits = model(**inputs).logits
        probs = torch.softmax(logits, dim=-1).squeeze().tolist()

    predicted_class = logits.argmax(-1).item()
    prediction = label_mapping[predicted_class]

    return prediction, {
        "negative": round(probs[0] * 100, 2),
        "neutral": round(probs[1] * 100, 2),
        "positive": round(probs[2] * 100, 2)
    }
