## 📋 Daftar Penyebab:

### 1. **Supabase Anon Key Belum Dikonfigurasi** ⚠️ (PENYEBAB UTAMA)

**Masalah:**
```
Saat ini file .env berisi:
VITE_SUPABASE_ANON_KEY=your-anon-key-here  ❌ (Placeholder, bukan kunci asli)
```

**Solusi:**
1. Buka [Supabase Dashboard](https://app.supabase.com)
2. Pilih project `kia-edukasi` (atau project yang sesuai dengan URL yang ada)
3. Klik **Settings** → **API** di sidebar kiri
4. Salin nilai **Anon public key** (bukan Service Role Key)
5. Update file `.env` dengan kunci sesungguhnya:

```env
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...
```

6. Simpan file dan **restart frontend server** (Ctrl+C dan `npm run dev`)

---

### 2. **Email Authentication Belum Diaktifkan di Supabase**

**Masalah:**
```
Error: "Email signups disabled on this project"
```

**Solusi:**
1. Buka Supabase Dashboard
2. Navigasi ke **Authentication** → **Providers**
3. Cari **Email** provider
4. Pastikan toggle **ENABLED** dinyalakan (berwarna hijau ✓)
5. Klik **Save**

---

### 3. **Project URL Tidak Sesuai**

**Masalah:**
```
Saat ini: VITE_SUPABASE_URL=https://xxhsnrvlwfkqwxrmfsus.supabase.co
```

Jika ini bukan project Anda, update dengan URL yang benar dari Supabase dashboard Anda.

**Solusi:**
1. Di Supabase Dashboard → **Settings** → **API**
2. Salin **Project URL** (format: `https://xxx.supabase.co`)
3. Update `.env`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
```

---

### 4. **Frontend Menggunakan Port 5174 Bukan 5173**

Jika melihat warning CORS, pastikan CORS di backend sudah support port 5174:

**Backend `main.go` sudah diupdate dengan:**
```go
AllowOrigins: []string{"http://localhost:5173", "http://localhost:5174", ...}
```

---

## ✅ Checklist Setup Lengkap

- [ ] Supabase project sudah dibuat di [app.supabase.com](https://app.supabase.com)
- [ ] Email provider sudah diaktifkan (**Authentication** → **Providers**)
- [ ] `VITE_SUPABASE_URL` sudah diisi dengan benar
- [ ] `VITE_SUPABASE_ANON_KEY` sudah diisi dengan kunci asli (bukan placeholder)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` sudah diisi di `.env` backend
- [ ] Frontend server di-restart setelah update `.env`
- [ ] Backend server sudah dijalankan
- [ ] Browser sudah me-refresh halaman (Ctrl+R)

---

## 🧪 Cara Test Login/Register

### Scenario 1: Test Registrasi
1. Buka http://localhost:5174
2. Klik **"Daftar gratis"**
3. Isi form:
   - Nama: `John Doe`
   - Email: `john@example.com`
   - Password: `password123`
   - Konfirmasi: `password123`
4. Klik **"Daftar Sekarang"**

**Hasil yang diharapkan:**
- ✅ Berhasil: Redirect ke halaman login + toast "Akun berhasil dibuat"
- ❌ Gagal: Toast error dengan pesan spesifik

### Scenario 2: Test Login
1. Buka http://localhost:5174/login
2. Isi form:
   - Email: `john@example.com`
   - Password: `password123`
3. Klik **"Masuk"**

**Hasil yang diharapkan:**
- ✅ Berhasil: Redirect ke `/dashboard` + toast "Selamat datang kembali"
- ❌ Gagal: Toast error (biasanya "Email atau password salah")

---

## 🔍 Debug Info

### Cek di Browser Console (F12 → Console Tab)
Akan melihat pesan:
```
Supabase Config: {
  url: "https://xxhsnrvlwfkqwxrmfsus.supabase.co",
  keyConfigured: false  ← Ini false berarti anon key masih placeholder!
}
```

### Cek di Backend Terminal
Jalankan:
```bash
curl http://localhost:8081/api/health
```

Respon yang diharapkan:
```json
{
  "status": "ok",
  "message": "Server is running",
  "supabaseConnected": true
}
```

---

## 📞 Common Errors & Solutions

| Error | Penyebab | Solusi |
|-------|---------|--------|
| `Invalid API Key` | Anon key tidak sesuai | Copy anon key dari Supabase lagi |
| `Email signups disabled` | Provider tidak aktif | Aktifkan di Auth → Providers |
| `User already registered` | Email sudah terdaftar | Gunakan email lain |
| `Invalid password` | Password terlalu pendek | Minimal 6 karakter |
| `Connection refused` | Backend tidak running | Jalankan `go run main.go` |
| `CORS error` | Domain tidak di-allow | Backend sudah support 5174 |

---

## 🚀 Next Steps Setelah Login Berhasil

1. Implementasi profile pages
2. Setup database schema untuk content, growth, bookmarks
3. Implement fitur content management
4. Setup push notifications
5. Add quiz functionality

---

**📚 Dokumentasi lengkap ada di:**
- [SETUP_SUPABASE.md](./SETUP_SUPABASE.md) - Setup database
- [README.md](./frontend/README.md) - Tech stack & development
