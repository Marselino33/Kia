# Alur Kerja Model ML dan Integrasi ke Proyek KIA

Dokumen ini menjelaskan struktur alur pengerjaan model mental health serta cara menggabungkannya ke backend dan frontend proyek ini.

## 1) Tujuan Arsitektur

Fitur mental health dibangun dengan pola **microservice ML**:

- `ml/` menjalankan model Python (FastAPI + scikit-learn) untuk inferensi.
- `backend/` menjadi **API gateway** untuk frontend.
- `frontend/` hanya memanggil endpoint backend (`/api/v1/mental-health/predict`).

Dengan pola ini:

- frontend tidak perlu tahu URL service ML internal,
- konfigurasi produksi lebih aman dan sederhana,
- service ML tetap bisa dikembangkan terpisah.

## 2) Struktur Alur End-to-End

### A. Data & Training (offline)

1. Siapkan data pada `ml/mental_health_data.csv`.
2. Jalankan training:

```bash
python ml/train_mental_health_model.py
```

3. Script akan menghasilkan model:

- `ml/mental_health_model.pkl`

4. Simpan metrik training (accuracy, classification report) untuk monitoring kualitas model.

### B. Serving / Inference (online)

1. Jalankan service ML:

```bash
uvicorn mental_health_api:app --host 0.0.0.0 --port 8000
```

2. Endpoint inferensi tersedia di:

- `POST /api/v1/mental-health/predict`

3. Input: `q1..q10` (skala 0-3)
4. Output: `label`, `score`, `advice`

### C. Integrasi Backend (Go)

Backend menyediakan endpoint publik:

- `POST /api/v1/mental-health/predict`

Alurnya:

1. Backend menerima payload dari frontend.
2. Backend meneruskan payload ke service ML Python.
3. Backend mengembalikan hasil dalam format response standar aplikasi.

Konfigurasi URL service ML melalui env:

- `MENTAL_HEALTH_SERVICE_URL`

Contoh:

- Lokal: `http://localhost:8000/api/v1`
- Docker internal network: `http://mental_health:8000/api/v1`

### D. Integrasi Frontend (React)

Frontend memanggil endpoint backend:

- `POST /mental-health/predict` via `src/lib/api.js`

Flow UI:

1. User isi 10 pertanyaan.
2. Frontend kirim payload `q1..q10` ke backend.
3. Tampilkan hasil label, score, dan advice.

## 3) Struktur Folder yang Direkomendasikan

```text
ml/
  mental_health_data.csv
  train_mental_health_model.py
  mental_health_api.py
  mental_health_model.pkl
  requirements.txt
  Dockerfile
  README.md

backend/
  app/
    controllers/
      mental_health.go
    models/
      request.go (MentalHealthPredictRequest, MentalHealthPredictResult)
    routes/
      routes.go (route /mental-health/predict)
```

## 4) Menjalankan dengan Docker Compose

Service yang terlibat:

- `postgres`
- `api` (Go backend)
- `mental_health` (FastAPI)

Pada container backend, env `MENTAL_HEALTH_SERVICE_URL` diarahkan ke:

- `http://mental_health:8000/api/v1`

Jalankan dari folder `backend/`:

```bash
docker compose up --build
```

## 5) SOP Update Model

Saat ada data baru:

1. Update dataset `mental_health_data.csv`
2. Retrain model
3. Validasi metrik model
4. Replace `mental_health_model.pkl`
5. Redeploy service `mental_health`

Disarankan tambahkan versioning model, contoh:

- `mental_health_model_v1.pkl`
- `mental_health_model_v2.pkl`

## 6) Checklist Integrasi

- [ ] Service ML hidup dan endpoint bisa diakses
- [ ] Backend env `MENTAL_HEALTH_SERVICE_URL` benar
- [ ] Endpoint backend `/api/v1/mental-health/predict` sukses
- [ ] Frontend menampilkan hasil dari backend
- [ ] Docker compose berjalan untuk seluruh service

## 7) Rekomendasi Lanjutan

- Simpan riwayat hasil screening ke database untuk dashboard tren.
- Tambahkan auth/rate limit khusus endpoint mental health.
- Tambahkan monitoring latency dan error rate untuk service ML.
- Tambahkan evaluasi bias model sebelum produksi.
