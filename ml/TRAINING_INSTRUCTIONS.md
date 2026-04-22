# Training Instructions untuk Model Mental Health (Strategy 1 - 3-Class)

## Prerequisites
Pastikan Python 3.8+ dan package berikut terinstall:
```bash
pip install fastapi uvicorn pandas scikit-learn joblib pydantic
```

Atau install dari requirements.txt:
```bash
cd ml
pip install -r requirements.txt
```

---

## Step 1: Aktifkan Dataset

Dataset yang digunakan: `ml/dataset_klasifikasi.csv`

File ini sudah contain:
- `q1_raw` sampai `q10_raw` (jawaban asli 0-4)
- `q1_adj` sampai `q10_adj` (sudah reversal untuk Q6-10)
- `skor_total` (sum dari q*_adj)
- `label` (RENDAH/SEDANG/TINGGI)

**Verifikasi:**
```bash
python -c "import pandas as pd; df = pd.read_csv('ml/dataset_klasifikasi.csv'); print(df.shape); print(df['label'].value_counts())"
```
Expected output:
```
(1000, 23)
TINGGI    300
SEDANG    500
RENDAH    200
```

---

## Step 2: Training Model Random Forest 3-Class

**Option A: Using Jupyter Notebook (Recommended for exploration)**
```bash
# Open notebook
jupyter notebook ml/Model.ipynb

# Run all cells secara berurutan
# Notebook akan:
# - Load dataset
# - Split train/test (80/20 stratified)
# - Train baseline RF (100 trees)
# - Hyperparameter tuning dengan GridSearchCV
# - Evaluate best model
# - Save artifact ke 'pss10_rf_model_v2.pkl'
```

**Option B: Using Python script (faster, headless)**
```bash
cd ml
python train_rf_model.py
```

Script ini akan:
1. Load `dataset_klasifikasi.csv`
2. Compute adjusted scores (jika belum ada)
3. Split data (80% train, 20% test stratified)
4. Train baseline RF (100 estimators)
5. GridSearchCV untuk tuning (300 estimators optimum)
6. Evaluate & print metrics
7. Save artifact `pss10_rf_model_v2.pkl`

**Output expected:**
```
✅ Model artifact saved: ml/pss10_rf_model_v2.pkl
Artifact contents:
  model                : <RandomForestClassifier>
  feature_cols         : ['q1_adj', 'q2_adj', ..., 'q10_adj']
  label_map            : {'RENDAH': 0, 'SEDANG': 1, 'TINGGI': 2}
  label_inv            : {0: 'RENDAH', 1: 'SEDANG', 2: 'TINGGI'}
  reversed_idx         : {5, 6, 7, 8, 9}
  best_params          : {'max_depth': None, 'min_samples_leaf': 2, 'min_samples_split': 5, 'n_estimators': 300}
  metrics              : {'accuracy_baseline': 0.87, 'f1_baseline': 0.8557, 'accuracy_tuned': 0.86, 'f1_tuned': 0.8586}
  versi                : v2 — no skor_total, no SMOTE, class_weight=balanced
  n_train              : 800
  n_test               : 200
```

---

## Step 3: Verify Model File

Check if `pss10_rf_model_v2.pkl` exists:
```bash
ls -lh ml/pss10_rf_model_v2.pkl
```

Expected size: ~1-2 MB

---

## Step 4: Test Python API (Mental Health Service)

Start the FastAPI service:
```bash
cd ml
uvicorn mental_health_api:app --host 0.0.0.0 --port 8000 --reload
```

Test health endpoint:
```bash
curl http://localhost:8000/health
```
Expected:
```json
{
  "status": "healthy",
  "model_version": "v2 — no skor_total feature, with reversal, class_weight=balanced",
  "model_type": "3-class-RF"
}
```

Test prediction (contoh Stres Tinggi):
```bash
curl -X POST http://localhost:8000/api/v1/mental-health/predict \
  -H "Content-Type: application/json" \
  -d '{"q1":4,"q2":4,"q3":4,"q4":3,"q5":4,"q6":0,"q7":0,"q8":1,"q9":0,"q10":0}'
```

Expected response (similar):
```json
{
  "label": "TINGGI",
  "label_binary": "stres",
  "score": 0.9874,
  "skor_total": 38,
  "advice": "Ibu tidak harus menghadapi ini sendirian. Ada bantuan yang siap menemani Ibu.",
  "is_fallback": false,
  "probabilities": {
    "RENDAH": 0.0,
    "SEDANG": 0.0126,
    "TINGGI": 0.9874
  },
  "model_version": "v2 — ..."
}
```

---

## Step 5: Update Go Backend Configuration

Pastikan environment variable `MENTAL_HEALTH_SERVICE_URL` di backend mengarah ke Python service:

**Lokal (.env atau config):**
```
MENTAL_HEALTH_SERVICE_URL=http://localhost:8000/api/v1
```

**Docker Compose (jika pakai docker):**
```yaml
services:
  api:
    environment:
      - MENTAL_HEALTH_SERVICE_URL=http://mental_health:8000/api/v1
  mental_health:
    build: ./ml
    ports:
      - "8000:8000"
```

---

## Step 6: Test Full Integration (Go -> Python)

Start Go backend:
```bash
cd backend
air  # atau go run main.go
```

Test endpoint via Go backend:
```bash
curl -X POST http://localhost:8081/api/v1/mental-health/predict \
  -H "Content-Type: application/json" \
  -d '{"q1":4,"q2":4,"q3":4,"q4":3,"q5":4,"q6":0,"q7":0,"q8":1,"q9":0,"q10":0}'
```

Should return same result as Python service.

---

## Step 7: Test Frontend

1. Start frontend: `cd frontend && npm run dev`
2. Buka http://localhost:3000/mental-health-check
3. Login sebagai ibu
4. Isi kuesioner dengan nilai tinggi (misal: semua 4 kecuali Q6-10 = 0)
5. Submit dan lihat hasil:
   - Label: TINGGI ( merah )
   - Skor: 38/40
   - Confidence: ~98.74%
   - Advice: untuk tingkat tinggi
   - Probability bars shown

---

## Troubleshooting

### Problem: `No module named 'sklearn'`
**Solution:** `pip install scikit-learn`

### Problem: `FileNotFoundError: ml/dataset_klasifikasi.csv`
**Solution:** Pastikan working directory adalah root project, atau adjust path di script.

### Problem: Model file not found di API
**Solution:** Pastikan `pss10_rf_model_v2.pkl` ada di folder `ml/`. API akan fallback ke `mental_health_model.pkl` (legacy binary) jika tidak ada.

### Problem: Port 8000 already in use
**Solution:** `uvicorn mental_health_api:app --port 8001` dan update `MENTAL_HEALTH_SERVICE_URL`.

### Problem: Go backend tidak bisa reach Python service
**Solution:** Check firewall, pastikan both services running, cek URL config.

---

## Rollback ke Legacy Model (jika perlu)

Jika ingin kembali ke model binary lama (Logistic Regression):
1. Hapus/rename `pss10_rf_model_v2.pkl`
2. Pastikan `mental_health_model.pkl` ada (dari `train_mental_health_model.py`)
3. Restart Python API
4. Akan otomatis load legacy model
5. Frontend tetap compatible (label_binary = "stres"/"tidak")

---

## Performance Metrics Expected

Setelah training, model RFC v2 harus achieve:
- **Accuracy**: ~86% (test set 200 samples)
- **F1 Macro**: ~0.8586
- **Class-wise F1**:
  - RENDAH: 0.85
  - SEDANG: 0.86
  - TINGGI: 0.87

If metrics significantly lower, check data leakage or retrain with different seed.

---

## Next Steps after Success

1. Simpan model ke Git LFS atau artifact registry (karena .pkl usually large)
2. Tambahkan versioning di API response
3. Add monitoring: prediction latency, error rate
4. Collect feedback dari user untuk future retraining
