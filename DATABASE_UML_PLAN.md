# Database UML Plan (KIA)

Dokumen ini merangkum rencana UML/ERD untuk seluruh layer data pada project KIA berdasarkan model GORM aktif dan setup Supabase.

## 1) Sumber Kebenaran Schema

- AutoMigrate aktif di backend: `backend/app/app.go`
- Model database utama: `backend/app/models/*.go`
- Setup auth/profile Supabase: `SETUP_SUPABASE.md`

## 2) ERD Utama (Database Aplikasi - Postgres/GORM)

```mermaid
erDiagram
    PENGGUNA {
        varchar(36) id PK
        string nama
        string no_hp UK
        string pin_hash
        string role
        string desa
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    ANAK {
        varchar(36) id PK
        varchar(36) pengguna_id FK
        string nama
        date tanggal_lahir
        string jenis_kelamin
        float berat_lahir_kg
        string golongan_darah
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    MASTER_VAKSIN {
        int id PK
        string nama_vaksin UK
        int usia_bulan
        string usia_teks
        text deskripsi
        string lokasi
        string sumber
    }

    RIWAYAT_IMUNISASI {
        varchar(36) id PK
        varchar(36) anak_id FK
        int master_vaksin_id FK
        string nama_vaksin
        date tanggal_done
        string dicatat_oleh
        text catatan
        timestamp created_at
    }

    CONTENTS {
        varchar(36) id PK
        string slug UK
        string judul
        string ringkasan
        text isi
        string kategori
        string phase
        string tags
        string gambar_url
        int read_minutes
        bool is_published
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    QUIZZES {
        varchar(36) id PK
        string judul
        string deskripsi
        string kategori
        string phase
        bool is_published
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    QUIZ_QUESTIONS {
        varchar(36) id PK
        varchar(36) quiz_id FK
        string teks
        text pilihan
        string jawaban_benar
        text penjelasan
        int urutan
        timestamp created_at
        timestamp deleted_at
    }

    QUIZ_ATTEMPTS {
        varchar(36) id PK
        varchar(36) pengguna_id FK
        varchar(36) quiz_id FK
        int skor
        int total
        timestamp created_at
    }

    RESEP_GIZI {
        bigint id PK
        string nama
        string slug UK
        text deskripsi
        string kategori
        string usia_kategori
        int durasi_menit
        int kalori
        text nutrisi
        string gambar_url
        bool is_published
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    PENGGUNA ||--o{ ANAK : memiliki
    ANAK ||--o{ RIWAYAT_IMUNISASI : memiliki
    MASTER_VAKSIN ||--o{ RIWAYAT_IMUNISASI : referensi
    QUIZZES ||--o{ QUIZ_QUESTIONS : memiliki
    PENGGUNA ||--o{ QUIZ_ATTEMPTS : mengerjakan
    QUIZZES ||--o{ QUIZ_ATTEMPTS : dicoba
```

## 3) ERD Auth/Profile (Supabase)

Catatan: tabel ini dikelola di Supabase, bukan AutoMigrate backend.

```mermaid
erDiagram
    AUTH_USERS {
        uuid id PK
        string email
        timestamp created_at
    }

    USER_PROFILES {
        uuid id PK, FK
        string full_name
        string email UK
        string avatar_url
        timestamp created_at
        timestamp updated_at
    }

    AUTH_USERS ||--|| USER_PROFILES : owns_profile
```

## 4) Tabel Planned (Belum Persisten di DB Saat Ini)

Entity di bawah sudah ada pada level API/model view, tetapi belum dimasukkan ke AutoMigrate:

- JadwalMakan (saat ini masih disimpan in-memory map di controller gizi)
- Bookmark (endpoint masih stub)
- Profile domain aplikasi (backend endpoint masih stub; Supabase profile sudah ada sebagai opsi)

Contoh draft ERD untuk planned table `jadwal_makan`:

```mermaid
erDiagram
    JADWAL_MAKAN {
        bigint id PK
        varchar(36) pengguna_id FK
        bigint resep_id FK
        date tanggal
        string waktu_makan
        text catatan
        timestamp created_at
    }

    PENGGUNA ||--o{ JADWAL_MAKAN : memiliki
    RESEP_GIZI ||--o{ JADWAL_MAKAN : dijadwalkan
```

## 5) Catatan Implementasi

- Kolom soft delete digunakan pada beberapa tabel (`deleted_at`) via GORM.
- Relasi foreign key eksplisit sudah ada di model `Anak`, `RiwayatImunisasi`, dan `QuizQuestion`.
- Pastikan penambahan FK constraint fisik di DB mengikuti environment Supabase (transaction pooler + migration strategy).

## 6) Prioritas Eksekusi Rencana

1. Stabilkan schema aktif sesuai ERD utama.
2. Putuskan satu sumber profile: `pengguna` internal atau `user_profiles` Supabase.
3. Implementasikan persistence untuk `jadwal_makan` dan `bookmark`.
4. Tambahkan migration SQL versioned agar tidak bergantung penuh pada AutoMigrate.
