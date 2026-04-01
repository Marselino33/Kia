from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI(title='KIA Mental Health Check')

class HealthInput(BaseModel):
    q1: int
    q2: int
    q3: int
    q4: int
    q5: int
    q6: int
    q7: int
    q8: int
    q9: int
    q10: int


class HealthOutput(BaseModel):
    label: str
    score: float
    advice: str


MODEL_PATH = 'ml/mental_health_model.pkl'
model = None


def get_model():
    global model
    if model is None:
        model = joblib.load(MODEL_PATH)
    return model


def classify(score):
    if score >= 0.65:
        return 'stres', 'Coba istirahat cukup, kurangi beban, dan kontak tenaga kesehatan jika terus memburuk.'
    if score >= 0.4:
        return 'sedang', 'Jaga pola tidur, beri waktu relaksasi, dan ajak bicara keluarga.'
    return 'tidak', 'Kondisi baik, pertahankan rutinitas sehat.'


@app.post('/api/v1/mental-health/predict', response_model=HealthOutput)
def predict(payload: HealthInput):
    data = pd.DataFrame([payload.dict()])
    m = get_model()
    proba = m.predict_proba(data)[0][1]
    label, advice = classify(proba)
    return HealthOutput(label=label, score=float(proba), advice=advice)
