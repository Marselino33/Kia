"""
Mental Health Check API - FastAPI Service
Adapter pattern: supports both legacy binary model and new 3-class Random Forest
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import joblib
import pandas as pd
import numpy as np
import os
from typing import Dict, Any

app = FastAPI(
    title="KIA Mental Health Check API",
    description="Prediksi tingkat kesehatan mental ibu berdasarkan kuesioner PSS-10",
    version="2.0.0",
)

# ── Configuration ─────────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.getenv("MODEL_PATH", os.path.join(BASE_DIR, "pss10_rf_model_v2.pkl"))
LEGACY_MODEL_PATH = os.path.join(BASE_DIR, "mental_health_model.pkl")

# ── Constants ──────────────────────────────────────────────────────────────────
LABEL_MAP = {"RENDAH": 0, "SEDANG": 1, "TINGGI": 2}
LABEL_INV = {0: "RENDAH", 1: "SEDANG", 2: "TINGGI"}
REVERSED_IDX = {5, 6, 7, 8, 9}  # 0-based: Q6-10 negative questions

# Advice messages (Bahasa Indonesia, empati)
ADVICE_MAP = {
    "RENDAH": "Ibu sudah melakukan yang terbaik. Beberapa tips ringan dapat membantu Ibu makin nyaman.",
    "SEDANG": "Ibu perlu sedikit lebih banyak dukungan — dan itu hal yang wajar dan manusiawi.",
    "TINGGI": "Ibu tidak harus menghadapi ini sendirian. Ada bantuan yang siap menemani Ibu.",
}

# Fallback rule-based thresholds (based on total skor 0-40)
RULE_THRESHOLDS = {"rendah_max": 13, "sedang_max": 26}

CONFIDENCE_THRESHOLD = 0.65

# ── Global Model State ─────────────────────────────────────────────────────────
model_artifact = None
model_version = None
use_legacy = False


# ── Pydantic Schemas ───────────────────────────────────────────────────────────
class HealthInput(BaseModel):
    q1: int = Field(..., ge=0, le=3, description="Pertanyaan 1 (0-3)")
    q2: int = Field(..., ge=0, le=3)
    q3: int = Field(..., ge=0, le=3)
    q4: int = Field(..., ge=0, le=3)
    q5: int = Field(..., ge=0, le=3)
    q6: int = Field(..., ge=0, le=3)
    q7: int = Field(..., ge=0, le=3)
    q8: int = Field(..., ge=0, le=3)
    q9: int = Field(..., ge=0, le=3)
    q10: int = Field(..., ge=0, le=3)


class HealthOutput(BaseModel):
    label: str = Field(..., description="Label prediksi: RENDAH / SEDANG / TINGGI")
    label_binary: str = Field(..., description="Label binary: tidak / stres")
    score: float = Field(..., ge=0.0, le=1.0, description="Confidence model (0-1)")
    skor_total: int = Field(..., description="Total skor mental health (0-40)")
    advice: str = Field(..., description="Rekomendasi berdasarkan level")
    is_fallback: bool = Field(
        ..., description="Apakah menggunakan rule-based fallback?"
    )
    probabilities: Dict[str, float] = Field(..., description="Probabilitas per kelas")
    model_version: str = Field(..., description="Versi model yang digunakan")


# ── Model Loading ──────────────────────────────────────────────────────────────
def load_model():
    """Load model artifact at startup."""
    global model_artifact, model_version, use_legacy

    # Try new 3-class model first
    if os.path.exists(MODEL_PATH):
        try:
            model_artifact = joblib.load(MODEL_PATH)
            model_version = model_artifact.get("versi", "v2-3class")
            use_legacy = False
            print(f"Model loaded: {MODEL_PATH} ({model_version})")
            return
        except Exception as e:
            print(f"Failed to load new model: {e}")

    # Fallback to legacy binary model
    if os.path.exists(LEGACY_MODEL_PATH):
        try:
            model_artifact = joblib.load(LEGACY_MODEL_PATH)
            model_version = "v1-binary-logistic"
            use_legacy = True
            print(f"Legacy model loaded: {LEGACY_MODEL_PATH}")
            return
        except Exception as e:
            print(f"Failed to load legacy model: {e}")

    # No model available
    model_artifact = None
    print("No model available. Please train a model first.")


def preprocess_answers(q1, q2, q3, q4, q5, q6, q7, q8, q9, q10):
    """
    Apply reversal transformation to Q6-10 (negative questions).

    Raw scale: 0-3
    Adj = raw for Q1-5, Adj = 4 - raw for Q6-10
    """
    raw = [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10]
    adj = []
    for i, val in enumerate(raw):
        if i in REVERSED_IDX:
            adj.append(4 - val)
        else:
            adj.append(val)
    return adj


def rule_based_label(skor_total: int) -> str:
    """Determine label based on total score (rule-based fallback)."""
    if skor_total <= RULE_THRESHOLDS["rendah_max"]:
        return "RENDAH"
    elif skor_total <= RULE_THRESHOLDS["sedang_max"]:
        return "SEDANG"
    else:
        return "TINGGI"


def predict_binary_legacy(adj):
    """Prediksi using legacy binary model (tidak/stres)."""
    if model_artifact is None:
        raise HTTPException(status_code=503, detail="Model tidak tersedia")

    # Legacy model expects DataFrame with columns q1..q10
    # It was trained on raw values, but we can apply reverse transformation
    # to make it compatible: legacy model was trained on raw data
    raw_for_legacy = []
    for i, val in enumerate(adj):
        if i in REVERSED_IDX:
            raw_for_legacy.append(4 - val)  # reverse back to raw
        else:
            raw_for_legacy.append(val)

    X = pd.DataFrame([raw_for_legacy], columns=[f"q{i + 1}" for i in range(10)])
    proba = model_artifact.predict_proba(X)[0]
    pred_idx = model_artifact.predict(X)[0]
    confidence = float(max(proba))

    # Legacy model binary: 0=tidak, 1=stres
    label_binary = "stres" if pred_idx == 1 else "tidak"

    # Map to 3-class using rule-based on skor for consistency
    skor = sum(adj)
    if confidence < CONFIDENCE_THRESHOLD:
        label_three = rule_based_label(skor)
    else:
        # Approximate mapping from binary to 3-class
        if pred_idx == 0:  # tidak
            label_three = "RENDAH"
        else:  # stres
            # Distinguish SEDANG vs TINGGI by skor
            if skor <= RULE_THRESHOLDS["sedang_max"]:
                label_three = "SEDANG"
            else:
                label_three = "TINGGI"

    return label_three, label_binary, confidence, skor, proba


def predict_3class(adj):
    """Prediksi using new 3-class Random Forest model."""
    if model_artifact is None:
        raise HTTPException(status_code=503, detail="Model tidak tersedia")

    model = model_artifact["model"]
    label_inv = model_artifact["label_inv"]

    X = np.array(adj).reshape(1, -1)
    proba = model.predict_proba(X)[0]
    pred_idx = model.predict(X)[0]
    confidence = float(max(proba))
    label_three = label_inv[pred_idx]

    # Rule-based fallback if confidence low
    skor = sum(adj)
    if confidence < CONFIDENCE_THRESHOLD:
        label_fallback = rule_based_label(skor)
        is_fallback = True
    else:
        label_fallback = None
        is_fallback = False

    # Final label (use fallback if triggered)
    final_label = label_fallback if is_fallback else label_three

    # Build probability dict
    prob_dict = {
        "RENDAH": round(float(proba[0]), 4),
        "SEDANG": round(float(proba[1]), 4),
        "TINGGI": round(float(proba[2]), 4),
    }

    return final_label, confidence, skor, is_fallback, prob_dict


def binary_mapping(label_three: str) -> str:
    """Map 3-class label to binary for backward compatibility."""
    return "tidak" if label_three == "RENDAH" else "stres"


# ── Startup ─────────────────────────────────────────────────────────────────────
@app.on_event("startup")
def startup_event():
    load_model()


@app.get("/health")
def health_check():
    """Health check endpoint."""
    if model_artifact is None:
        raise HTTPException(status_code=503, detail="Model tidak tersedia")
    return {
        "status": "healthy",
        "model_version": model_version,
        "model_type": "3-class-RF" if not use_legacy else "binary-logistic",
    }


# ── Prediction Endpoint ─────────────────────────────────────────────────────────
@app.post("/api/v1/mental-health/predict", response_model=HealthOutput)
def predict_mental_health(payload: HealthInput):
    """
    Prediksi tingkat kesehatan mental ibu berdasarkan 10 pertanyaan PSS-10.

    **Input:** 10 jawaban (0-3) untuk pertanyaan kuesioner
    **Output:**
    - label: RENDAH / SEDANG / TINGGI
    - label_binary: tidak / stres (mapping dari 3-class)
    - score: confidence model (0-1)
    - skor_total: total skor mental (0-40)
    - advice: pesan rekomendasi
    - is_fallback: true jika menggunakan rule-based fallback
    - probabilities: probabilitas per kelas
    """
    # Extract answers
    answers = [
        payload.q1,
        payload.q2,
        payload.q3,
        payload.q4,
        payload.q5,
        payload.q6,
        payload.q7,
        payload.q8,
        payload.q9,
        payload.q10,
    ]

    # Preprocess: apply reversal to Q6-10
    adj = preprocess_answers(*answers)
    skor_total = sum(adj)

    # Predict based on available model
    if use_legacy:
        label_three, label_binary, confidence, skor_total, proba = (
            predict_binary_legacy(adj)
        )
        is_fallback = False  # legacy doesn't have fallback
        prob_dict = {
            "RENDAH": round(float(proba[0] if pred_idx == 0 else 0.0), 4),
            "SEDANG": round(float(proba[1] if pred_idx == 1 else 0.0), 4),
            "TINGGI": round(float(proba[1] if pred_idx == 1 else 0.0), 4),
        }
        # Approximate for legacy
        if label_binary == "tidak":
            prob_dict["RENDAH"] = round(confidence, 4)
        else:
            if skor_total <= RULE_THRESHOLDS["sedang_max"]:
                prob_dict["SEDANG"] = round(confidence, 4)
            else:
                prob_dict["TINGGI"] = round(confidence, 4)
    else:
        label_three, confidence, skor_total, is_fallback, prob_dict = predict_3class(
            adj
        )
        label_binary = binary_mapping(label_three)

    return HealthOutput(
        label=label_three,
        label_binary=label_binary,
        score=round(confidence, 4),
        skor_total=skor_total,
        advice=ADVICE_MAP.get(label_three, ADVICE_MAP["SEDANG"]),
        is_fallback=is_fallback,
        probabilities=prob_dict,
        model_version=model_version,
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
