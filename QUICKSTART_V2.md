# 🚀 QUICK START: Mental Health Integration v2 (3-Class)

## Prerequisites
- Python 3.8+ with pip
- Go 1.21+
- Node.js 18+ (for frontend)
- Git

---

## ⚡ TL;DR - 5 Steps to Run

### Step 1: Train Model
```bash
cd ml
python train_rf_model.py
# Wait ~30 sec, should see: "Model artifact saved: pss10_rf_model_v2.pkl"
```

### Step 2: Start Python ML Service
```bash
cd ml
uvicorn mental_health_api:app --reload --port 8000
# Test: curl http://localhost:8000/health
```

### Step 3: Start Go Backend
```bash
cd backend
go run main.go
# Server on http://localhost:8081
```

### Step 4: Start Frontend
```bash
cd frontend
npm install  # first time only
npm run dev
# Open http://localhost:3000
```

### Step 5: Test
1. Login as mother user
2. Navigate to "Cek Kesehatan Mental"
3. Fill all questions with high values (4) except Q6-10 = 0
4. Submit → Should show red "TINGGI" with 38/40 score

---

## 📁 Files Changed Summary

### Created (new):
- `ml/mental_health_api.py` - FastAPI service (v2)
- `ml/train_rf_model.py` - Training script
- `ml/TRAINING_INSTRUCTIONS.md` - Detailed training guide
- `ml/test_integration.py` - API integration tests
- `ml/train.bat` - Windows training launcher
- `IMPLEMENTATION_SUMMARY.md` - This implementation overview

### Modified:
- `backend/app/models/request.go` - Extended `MentalHealthPredictResult`
- `frontend/src/pages/mental-orang-tua/MentalHealthCheck.jsx` - 3-class UI
- `frontend/src/styles/pages/mental-health-check.css` - New styling

### Expected (after training):
- `ml/pss10_rf_model_v2.pkl` - Trained model artifact

---

## 🔧 Configuration

### Environment Variables (Backend)
Create `.env` in `backend/`:
```bash
MENTAL_HEALTH_SERVICE_URL=http://localhost:8000/api/v1
```

Or in Docker:
```yaml
environment:
  - MENTAL_HEALTH_SERVICE_URL=http://mental_health:8000/api/v1
```

---

## 🧪 Run Tests

### Unit: Python API
```bash
cd ml
python test_integration.py
# Requires: pip install requests
```

### Manual: cURL
```bash
# 1. Health
curl http://localhost:8000/health

# 2. Predict (high stress)
curl -X POST http://localhost:8000/api/v1/mental-health/predict \
  -H "Content-Type: application/json" \
  -d '{"q1":4,"q2":4,"q3":4,"q4":3,"q5":4,"q6":0,"q7":0,"q8":1,"q9":0,"q10":0}'

# 3. Predict via Go backend
curl -X POST http://localhost:8081/api/v1/mental-health/predict \
  -H "Content-Type: application/json" \
  -d '{"q1":4,"q2":4,"q3":4,"q4":3,"q5":4,"q6":0,"q7":0,"q8":1,"q9":0,"q10":0}'
```

---

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| `ModuleNotFoundError: No module named 'sklearn'` | `pip install -r ml/requirements.txt` |
| `model_artifact is None` (503) | Run training first: `python train_rf_model.py` |
| `connection refused` from Go | Ensure Python service running on port 8000 |
| Frontend shows binary "stres/tidak" | Python using legacy model; check `pss10_rf_model_v2.pkl` exists |
| Colors not showing | Hard refresh browser (Ctrl+Shift+R) |
| Port 8000/8081/3000 busy | Kill other processes or change ports |

---

## 📊 Expected Output

**Prediction JSON (TINGGI case):**
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
  "model_version": "v2 — no skor_total, with reversal, class_weight=balanced"
}
```

**Frontend UI:**
- 🚨 **STRA TINGGI** (red badge)
- Skor: 38 / 40 (red progress bar 95%)
- Confidence: 98.74%
- 3 colored probability bars
- Advice in blue quote box

---

## 🔄 Rollback to Legacy

If you need to revert to old binary model:
1. Rename/remove `pss10_rf_model_v2.pkl`
2. Ensure `mental_health_model.pkl` exists (from old training)
3. Restart Python API
4. Response will have only `label`, `score`, `advice` (Go struct still accepts it due to JSON omission)

---

## 📚 Documentation

- **Implementation details:** `IMPLEMENTATION_SUMMARY.md`
- **Training guide:** `ml/TRAINING_INSTRUCTIONS.md`
- **Model exploration:** `ml/Model.ipynb` (Jupyter notebook)

---

## ✅ Completion Checklist

- [ ] Model trained (`pss10_rf_model_v2.pkl` exists)
- [ ] Python API starts without error
- [ ] Health check returns `"model_type": "3-class-RF"`
- [ ] Prediction returns 8 fields including `skor_total` and `probabilities`
- [ ] Go backend running and proxying correctly
- [ ] Frontend displays 3-level colored result with progress bars
- [ ] Fallback warning appears for low-confidence predictions (test with values near decision boundary)

---

**Ready to go!** Start with `ml/train.bat` then `uvicorn mental_health_api:app`.
