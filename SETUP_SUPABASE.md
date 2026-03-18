# 🚀 Setup Supabase untuk Autentikasi

## 1. Dapatkan Credentials dari Supabase

### Langkah-langkah:
1. Buka [Supabase Dashboard](https://app.supabase.com)
2. Login atau buat akun baru
3. Pilih project: `kia-edukasi` (atau buat project baru)
4. Di sidebar, klik **Settings** → **API**
5. Salin kedua nilai ini:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon public key** → `VITE_SUPABASE_ANON_KEY`
   - **Service Role Key** → `SUPABASE_SERVICE_ROLE_KEY` (untuk backend)

## 2. Konfigurasi Environment Variables

### Frontend (.env)
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=http://localhost:8081/api
```

### Backend (.env)
```env
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
PORT=8081
JWT_SECRET=your-jwt-secret-here
```

## 3. Aktifkan Email Authentication di Supabase

1. Di Supabase Dashboard, buka **Authentication** → **Providers**
2. Pastikan **Email** provider sudah **ENABLED** ✓
3. Optional: Setup SMTP untuk email verifikasi di **Settings** → **Email**

## 4. Buat Tabel Users di Database

Di Supabase Dashboard, buka **SQL Editor** dan jalankan:

```sql
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text UNIQUE,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy untuk users bisa read profile mereka sendiri
CREATE POLICY "Users can read own profile"
ON public.user_profiles FOR SELECT
USING (auth.uid() = id);

-- Policy untuk users bisa update profile mereka sendiri
CREATE POLICY "Users can update own profile"
ON public.user_profiles FOR UPDATE
USING (auth.uid() = id);
```

## 5. Test Login & Register

1. Buka browser: **http://localhost:5174**
2. Klik **"Daftar"** untuk membuat akun baru
3. Gunakan email dan password Anda
4. Setelah berhasil, klik **"Masuk"**

## 🐛 Troubleshooting

### Error: "Invalid API Key"
→ Pastikan `VITE_SUPABASE_ANON_KEY` di `.env` benar dan sesuai dengan project Supabase Anda

### Error: "Email signups disabled"
→ Aktivkan **Email Provider** di Supabase Authentication settings

### Error: "User already registered"
→ User dengan email tersebut sudah terdaftar, gunakan email lain

### Error: "Weak password"
→ Password minimal 6 karakter (atau sesuai setting Supabase Anda)

## ℹ️ Nilai Default Saat Ini

```env
VITE_SUPABASE_URL=https://xxhsnrvlwfkqwxrmfsus.supabase.co
VITE_SUPABASE_ANON_KEY=PERLU DIISI! ⚠️
```

✅ Setelah mengikuti langkah ini, login dan registrasi akan berfungsi!
