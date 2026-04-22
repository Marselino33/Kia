# Alur Kerja Model ML dan Integrasi ke Proyek KIA (v2.0 - 3-Class)

Dokumen ini menjelaskan struktur alur pengerjaan model mental health **3-class (RENDAH/SEDANG/TINGGI)** serta cara menggabungkannya ke backend dan frontend proyek ini.

## 1) Tujuan Arsitektur

Fitur mental health dibangun dengan pola **microservice ML**:

- `ml/` menjalankan model Python (FastAPI + scikit-learn Random Forest) untuk inferensi 3-class.
- `backend/` menjadi **API gateway** untuk frontend.
- `frontend/` hanya memanggil endpoint backend (`/api/v1/mental-health/predict`).

Dengan pola ini:
- frontend tidak perlu tahu URL service ML internal,
- konfigurasi produksi lebih aman dan sederhana,
- service ML tetap bisa dikembangkan terpisah.

---

## 2) Model Versioning

| Versi | Model | Kelas Output | Fitur | File |
|-------|-------|--------------|-------|------|
| v1 (legacy) | Logistic Regression | 2-class (`tidak`/`stres`) | raw q1-10 | `mental_health_model.pkl` |
| v2 (current) | Random Forest (300 trees) | 3-class (`RENDAH`/`SEDANG`/`TINGGI`) | adjusted q1-10 dengan reversal Q6-10 | `pss10_rf_model_v2.pkl` |

**Default:** API akan otomatis load v2 jika tersedia, fallback ke v1 jika tidak.

---

## 3) Struktur Alur End-to-End (v2)

### A. Data & Training (offline)

1. **Dataset:** `ml/dataset_klasifikasi.csv` (1000 samples, 3-class labels)
   - Kolom: `q1_raw`-`q10_raw`, `q1_adj`-`q10_adj`, `skor_total`, `label`
   - Q6-10 adalah pertanyaan negatif (di-reverse: `adj = 4 - raw`)

2. **Training script:** `ml/train_rf_model.py`
   ```bash
   cd ml
   python train_rf_model.py
   ```

3. **Output:**
   - `pss10_rf_model_v2.pkl` (artifact lengkap dengan metadata)
   - Metrics: Accuracy ~86%, F1-Macro ~0.86

4. **Alternative:** Gunakan Jupyter `ml/Model.ipynb` untuk eksplorasi EDA & GridSearch.

### B. Serving / Inference (online)

1. **Start ML service:**
   ```bash
   cd ml
   uvicorn mental_health_api:app --host 0.0.0.0 --port 8000
   ```

2. **Endpoint:**
   - `POST /api/v1/mental-health/predict`
   - `GET /health` (health check)

3. **Input:** 10 integers (0-3) for q1-q10 (raw answers from user)

4. **Preprocessing inside API:**
   ```python
   # Q6-10 reversed automatically
   adj = [4 - q[i] if i in {5,6,7,8,9} else q[i] for i in 10]
   ```

5. **Output (JSON):**
   ```json
   {
     "label": "TINGGI",
     "label_binary": "stres",
     "score": 0.9874,
     "skor_total": 38,
     "advice": "Ibu tidak harus menghadapi ini sendirian...",
     "is_fallback": false,
     "probabilities": {"RENDAH":0.0,"SEDANG":0.0126,"TINGGI":0.9874},
     "model_version": "v2 — no skor_total, with reversal..."
   }
   ```

### C. Integrasi Backend (Go)

Backend menyediakan endpoint publik:
- `POST /api/v1/mental-health/predict` (proxy ke Python service)

Alur:
1. Frontend → Go Backend (`/api/v1/mental-health/predict`)
2. Go Backend → Python ML Service (`http://localhost:8000/api/v1/mental-health/predict`)
3. Python returns 3-class result
4. Go forwards response ke frontend unchanged

Request/Response struct di Go:
- `MentalHealthPredictRequest` (q1..q10)
- `MentalHealthPredictResult` (extended v2 fields: label_binary, skor_total, is_fallback, probabilities, model_version)

Konfigurasi URL service ML melalui env:
- `MENTAL_HEALTH_SERVICE_URL` (default: `http://localhost:8000/api/v1`)

### D. Integrasi Frontend (React)

Frontend memanggil: `POST /api/v1/mental-health/predict` via `src/lib/api.js`

Display UI:
- **Level:** RENDAH (✅ hijau) / SEDANG (⚠️ kuning) / TINGGI (🚨 merah)
- **Skor Total:** 0-40 dengan progress bar
- **Confidence:** persentase keyakinan model
- **Probabilitas:** bar chart per kelas (optional detail)
- **Advice:** pesan empati sesuai level
- **Fallback warning:** muncul jika confidence < 65%

---

## 4) Struktur Folder

```text
ml/
├── dataset_klasifikasi.csv     # Training data (1000 samples)
├── train_rf_model.py           # Training script (headless)
├── Model.ipynb                 # Exploratory notebook (EDA + tuning)
├── mental_health_api.py        # FastAPI service (v2 with fallback)
├── pss10_rf_model_v2.pkl       # Trained model artifact (output)
├── mental_health_model.pkl     # Legacy binary model (optional)
├── requirements.txt
├── Dockerfile
├── TRAINING_INSTRUCTIONS.md    # Step-by-step training guide
└── README.md                   # This file

backend/
└── app/
    ├── controllers/
    │   └── mental_health.go    # Proxy controller (unchanged)
    └── models/
        └── request.go          # MentalHealthPredictResult (v2 struct)

frontend/
└── src/
    └── pages/
        └── mental-orang-tua/
            └── MentalHealthCheck.jsx  # 3-class UI
    └── styles/
        └── pages/
            └── mental-health-check.css  # Styling baru
```

---

## 5) Model Inference Flow (Code Walkthrough)

### Python API (`mental_health_api.py`)

```python
def preprocess_answers(q1..q10):
    adj = []
    for i, val in enumerate([q1..q10]):
        if i in {5,6,7,8,9}:  # Q6-10 reversed
            adj.append(4 - val)
        else:
            adj.append(val)
    return adj

def predict_pss10(raw_answers):
    adj = preprocess(raw_answers)
    skor = sum(adj)
    
    # ML prediction
    proba = model.predict_proba([adj])[0]
    conf = max(proba)
    label_ml = label_inv[model.predict([adj])[0]]
    
    # Fallback rule-based if low confidence
    if conf < 0.65:
        label = rule_based_label(skor)  # ≤13=RENDAH, ≤26=SEDANG, else=TINGGI
        is_fallback = True
    else:
        label = label_ml
        is_fallback = False
    
    # Map to binary for backward compatibility
    label_binary = 'tidak' if label == 'RENDAH' else 'stres'
    
    return {
        'label': label,
        'label_binary': label_binary,
        'score': conf,
        'skor_total': skor,
        'advice': ADVICE_MAP[label],
        'is_fallback': is_fallback,
        'probabilities': {'RENDAH':.., 'SEDANG':.., 'TINGGI':..},
        'model_version': version
    }
```

### Mapping Label ke UI

| Label 3-class | Label Binary | Color  | Advice Level |
|---------------|--------------|--------|--------------|
| RENDAH        | tidak        | Hijau  | Level 1 ( Maintain ) |
| SEDANG        | stres        | Kuning | Level 2 (Support needed) |
| TINGGI        | stres        | Merah  | Level 3 (Professional help) |

---

## 6) Docker Compose Integration

**docker-compose.yml ( excerpt ) :**
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    # ...

  api:
    build: ./backend
    ports:
      - "8081:8081"
    environment:
      - MENTAL_HEALTH_SERVICE_URL=http://mental_health:8000/api/v1
    depends_on:
      - postgres
      - mental_health

  mental_health:
    build: ./ml
    ports:
      - "8000:8000"
    volumes:
      - ./ml:/app  # for development (model hot-reload)
```

**ml/Dockerfile** ( already exists, just ensure it copies model ):
```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "mental_health_api:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 7) SOP Update Model (Retraining)

When new data available:

1. **Collect new labeled data** → append to `dataset_klasifikasi.csv`
2. **Validate data quality** (no missing values, correct label distribution)
3. **Retrain:**
   ```bash
   python train_rf_model.py
   ```
4. **Evaluate:** Check metrics in console output. If F1-macro > 0.85 → OK.
5. **Versioning:** Rename artifact
   ```bash
   cp pss10_rf_model_v2.pkl pss10_rf_model_v3.pkl
   ```
6. **Update API config** (if using new version):
   - Update `MODEL_PATH` env var or code
   - Or keep `pss10_rf_model_v2.pkl` as symlink to latest
7. **Deploy:**
   - Rebuild ML service Docker image
   - Roll out with zero-downtime (if using Kubernetes/swarm)
8. **Monitor:**
   - Prediction latency
   - Error rate 5xx
   - Distribution of predicted labels (should not drift to one class)

---

## 8) Checklist Integrasi (v2)

- [ ] `dataset_klasifikasi.csv` valid (1000 rows, balanced labels)
- [ ] `train_rf_model.py` runs without error
- [ ] `pss10_rf_model_v2.pkl` generated (size > 0)
- [ ] `mental_health_api.py` loads model successfully on startup
- [ ] `GET /health` returns `"model_type": "3-class-RF"`
- [ ] Prediction endpoint returns all new fields (label_binary, skor_total, etc.)
- [ ] Go backend struct `MentalHealthPredictResult` matches JSON schema
- [ ] Frontend displays 3-level result with colored title
- [ ] Frontend shows progress bar (0-40) and probability bars
- [ ] Fallback warning appears when confidence low (simulate with borderline case)
- [ ] Docker compose (if used) builds and runs both services
- [ ] End-to-end test: React → Go → Python → model → response displays correctly

---

## 9) Rekomendasi Lanjutan

- **Model Monitoring:** Log every prediction (timestamp, inputs, output, confidence) to database for drift detection.
- **A/B Testing:** Deploy both v1 (binary) and v2 (3-class) behind feature flag, compare user engagement.
- **Feedback Loop:** Add "Apakah hasil ini akurat?" button in UI to collect ground truth for future retraining.
- **Explainability:** Integrate SHAP to show which questions contributed most to prediction (especially high stress).
- **Security:** Add rate limiting on `/mental-health/predict` to prevent abuse.
- **Accessibility:** Ensure color-blind friendly (add icons ✅⚠️🚨 as shown).
- **Localization:** Advice messages can be expanded per region/culture.
- **Data Privacy:** Anonymize predictions, don't store PII with mental health results without consent.

---

## 10) Troubleshooting (v2-specific)

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| `model_type: binary-logistic` | `pss10_rf_model_v2.pkl` not found | Run training, place file in `ml/` |
| `is_fallback: true` for all predictions | Model confidence always < 0.65 (maybe wrong preprocess) | Check reversal logic, verify input range 0-3 |
| Label always "SEDANG" | Imbalanced dataset, model biased | Check label distribution, maybe use `class_weight='balanced'` (already set) |
| `keyerror 'RENDAH'` in API | Label mapping mismatch | Ensure dataset labels exactly `RENDAH`, `SEDANG`, `TINGGI` (case-sensitive) |
| Go unmarshal error | JSON field mismatch | Check struct tags in `request.go` match Python output keys |

---

**Last updated:** 2026-04-22  
**Version:** 2.0 (3-class Random Forest with fallback)

