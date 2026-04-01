# Database Design Plan - KIA (Kesehatan Ibu dan Anak)

## 📋 Ringkasan Proyek

**Nama Proyek**: KIA (Kesehatan Ibu dan Anak)  
**Teknologi Backend**: Go (Golang) dengan GORM  
**Database**: PostgreSQL (Supabase)  
**Status**: Active Development  

---

## 🎯 Tujuan Database Design

1. **Mendukung fitur utama aplikasi**: Tracking imunisasi, konten edukasi, kuis, dan nutrisi
2. **Skalabilitas**: Menggunakan UUID untuk primary key utama
3. **Audit Trail**: Timestamp lengkap untuk semua operasi
4. **Soft Delete**: Data tidak dihapus fisik, hanya ditandai
5. **Performa**: Index strategis untuk query yang sering digunakan

---

## 📊 Entity Relationship Diagram (ERD)

### Core Entities (Sudah Migrated)

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   PENGGUNA      │       │      ANAK       │       │ RIWAYAT_IMUNISASI│
│─────────────────│       │─────────────────│       │─────────────────│
│ id (PK, UUID)   │───1:N─│ id (PK, UUID)   │───1:N─│ id (PK, UUID)   │
│ nama            │       │ pengguna_id (FK)│       │ anak_id (FK)    │
│ no_hp (UK)      │       │ nama            │       │ master_vaksin_id│
│ pin_hash        │       │ tanggal_lahir   │       │ nama_vaksin     │
│ role            │       │ jenis_kelamin   │       │ tanggal_done    │
│ desa            │       │ berat_lahir_kg  │       │ dicatat_oleh    │
│ created_at      │       │ golongan_darah  │       │ catatan         │
│ updated_at      │       │ created_at      │       │ created_at      │
│ deleted_at      │       │ updated_at      │       └─────────────────┘
└─────────────────┘       │ deleted_at      │               │
                          └─────────────────┘               │
                                                            │
                          ┌─────────────────┐               │
                          │  MASTER_VAKSIN  │               │
                          │─────────────────│               │
                          │ id (PK, INT)    │───────────────┘
                          │ nama_vaksin (UK)│
                          │ usia_bulan      │
                          │ usia_teks       │
                          │ deskripsi       │
                          │ lokasi          │
                          │ sumber          │
                          └─────────────────┘
```

### Content & Learning Entities

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    CONTENTS     │       │    QUIZZES      │       │ QUIZ_QUESTIONS  │
│─────────────────│       │─────────────────│       │─────────────────│
│ id (PK, UUID)   │       │ id (PK, UUID)   │───1:N─│ id (PK, UUID)   │
│ slug (UK)       │       │ judul           │       │ quiz_id (FK)    │
│ judul           │       │ deskripsi       │       │ teks            │
│ ringkasan       │       │ kategori        │       │ pilihan (JSON)  │
│ isi             │       │ phase           │       │ jawaban_benar   │
│ kategori        │       │ is_published    │       │ penjelasan      │
│ phase           │       │ created_at      │       │ urutan          │
│ tags            │       │ updated_at      │       │ created_at      │
│ gambar_url      │       │ deleted_at      │       │ deleted_at      │
│ read_minutes    │       └─────────────────┘       └─────────────────┘
│ is_published    │               │
│ created_at      │               │
│ updated_at      │               │
│ deleted_at      │               │
└─────────────────┘               │
                          ┌─────────────────┐
                          │  QUIZ_ATTEMPTS  │
                          │─────────────────│
                          │ id (PK, UUID)   │
                          │ pengguna_id (FK)│
                          │ quiz_id (FK)    │
                          │ skor            │
                          │ total           │
                          │ created_at      │
                          └─────────────────┘
```

### Nutrition Entities

```
┌─────────────────┐       ┌─────────────────┐
│   RESEP_GIZI    │       │  JADWAL_MAKAN   │
│─────────────────│       │  (PLANNED)      │
│ id (PK, BIGINT) │───1:N─│─────────────────│
│ nama            │       │ id (PK, BIGINT) │
│ slug (UK)       │       │ pengguna_id (FK)│
│ deskripsi       │       │ resep_id (FK)   │
│ kategori        │       │ tanggal         │
│ usia_kategori   │       │ waktu_makan     │
│ durasi_menit    │       │ catatan         │
│ kalori          │       │ created_at      │
│ nutrisi (JSON)  │       └─────────────────┘
│ gambar_url      │               │
│ is_published    │               │
│ created_at      │               │
│ updated_at      │               │
│ deleted_at      │               │
└─────────────────┘               │
                          ┌─────────────────┐
                          │    BOOKMARKS    │
                          │   (PLANNED)     │
                          │─────────────────│
                          │ id (PK, BIGINT) │
                          │ pengguna_id (FK)│
                          │ content_id (FK) │
                          │ created_at      │
                          └─────────────────┘
```

---

## 📝 Detail Schema Setiap Tabel

### 1. TABEL PENGGUNA

**Deskripsi**: Menyimpan data pengguna aplikasi (Ibu, Ayah, Kader, Admin)

| Kolom | Tipe Data | Constraint | Deskripsi |
|-------|-----------|------------|-----------|
| id | varchar(36) | PRIMARY KEY | UUID, auto-generated |
| nama | text | NOT NULL | Nama lengkap pengguna |
| no_hp | text | NOT NULL, UNIQUE | Nomor HP, identifier utama login |
| pin_hash | text | NOT NULL | Hash bcrypt dari PIN |
| role | text | DEFAULT 'ibu' | Enum: ibu, ayah, kader, admin |
| desa | text | DEFAULT 'Hutabulu Mejan' | Nama desa tempat tinggal |
| created_at | timestamptz | NOT NULL | Timestamp pembuatan record |
| updated_at | timestamptz | NOT NULL | Timestamp update terakhir |
| deleted_at | timestamptz | NULL | Timestamp soft delete |

**Index**:
- PRIMARY KEY (id)
- UNIQUE INDEX idx_pengguna_no_hp (no_hp)
- INDEX idx_pengguna_deleted_at (deleted_at)

**Relasi**:
- PENGGUNA (1) → (N) ANAK
- PENGGUNA (1) → (N) QUIZ_ATTEMPTS
- PENGGUNA (1) → (N) JADWAL_MAKAN (planned)
- PENGGUNA (1) → (N) BOOKMARKS (planned)

---

### 2. TABEL ANAK

**Deskripsi**: Menyimpan data profil anak yang terdaftar oleh pengguna

| Kolom | Tipe Data | Constraint | Deskripsi |
|-------|-----------|------------|-----------|
| id | varchar(36) | PRIMARY KEY | UUID, auto-generated |
| pengguna_id | varchar(36) | NOT NULL, FK | Referensi ke pengguna.id |
| nama | text | NOT NULL | Nama anak |
| tanggal_lahir | timestamptz | NOT NULL | Tanggal lahir anak |
| jenis_kelamin | text | NOT NULL | Enum: laki-laki, perempuan |
| berat_lahir_kg | decimal | NULL | Berat saat lahir dalam kg |
| golongan_darah | text | NULL | Golongan darah: A, B, AB, O |
| created_at | timestamptz | NOT NULL | Timestamp pembuatan |
| updated_at | timestamptz | NOT NULL | Timestamp update |
| deleted_at | timestamptz | NULL | Timestamp soft delete |

**Foreign Key**:
- CONSTRAINT fk_anak_pengguna FOREIGN KEY (pengguna_id) REFERENCES pengguna(id)

**Index**:
- PRIMARY KEY (id)
- INDEX idx_anak_pengguna_id (pengguna_id)
- INDEX idx_anak_deleted_at (deleted_at)

**Relasi**:
- ANAK (N) → (1) PENGGUNA
- ANAK (1) → (N) RIWAYAT_IMUNISASI

---

### 3. TABEL MASTER_VAKSIN

**Deskripsi**: Tabel master berisi 26 vaksin wajib dari Buku KIA 2024

| Kolom | Tipe Data | Constraint | Deskripsi |
|-------|-----------|------------|-----------|
| id | int | PRIMARY KEY, AUTO INCREMENT | ID vaksin |
| nama_vaksin | varchar(100) | NOT NULL, UNIQUE | Nama vaksin |
| usia_bulan | int | NOT NULL | Usia pemberian vaksin dalam bulan |
| usia_teks | varchar(100) | NOT NULL | Deskripsi usia pemberian |
| deskripsi | text | NULL | Penjelasan lengkap penyakit dan vaksin |
| lokasi | varchar(200) | DEFAULT 'Posyandu Mejan / Puskesmas Balige' | Tempat pemberian vaksin |
| sumber | varchar(100) | DEFAULT 'Buku KIA 2024' | Sumber referensi |

**Index**:
- PRIMARY KEY (id)
- UNIQUE INDEX idx_master_vaksin_nama_vaksin (nama_vaksin)

**Data**: 26 record vaksin pre-loaded dari seed

**Relasi**:
- MASTER_VAKSIN (1) → (N) RIWAYAT_IMUNISASI

---

### 4. TABEL RIWAYAT_IMUNISASI

**Deskripsi**: Mencatat setiap vaksin yang sudah diberikan kepada anak

| Kolom | Tipe Data | Constraint | Deskripsi |
|-------|-----------|------------|-----------|
| id | varchar(36) | PRIMARY KEY | UUID, auto-generated |
| anak_id | varchar(36) | NOT NULL, FK | Referensi ke anak.id |
| master_vaksin_id | int | NOT NULL, FK | Referensi ke master_vaksin.id |
| nama_vaksin | varchar(100) | NOT NULL | Denormalized: nama vaksin |
| tanggal_done | timestamptz | NOT NULL | Tanggal vaksin diberikan |
| dicatat_oleh | varchar(20) | NOT NULL | Siapa yang mencatat: "ibu" atau "kader" |
| catatan | text | NULL | Catatan tambahan |
| created_at | timestamptz | NOT NULL | Timestamp pencatatan |

**Foreign Keys**:
- CONSTRAINT fk_riwayat_imunisasi_anak FOREIGN KEY (anak_id) REFERENCES anak(id)
- CONSTRAINT fk_riwayat_imunisasi_master_vaksin FOREIGN KEY (master_vaksin_id) REFERENCES master_vaksin(id)

**Index**:
- PRIMARY KEY (id)
- INDEX idx_riwayat_imunisasi_anak_id (anak_id)

**Relasi**:
- RIWAYAT_IMUNISASI (N) → (1) ANAK
- RIWAYAT_IMUNISASI (N) → (1) MASTER_VAKSIN

---

### 5. TABEL CONTENTS

**Deskripsi**: Menyimpan artikel/konten edukasi kesehatan ibu dan anak

| Kolom | Tipe Data | Constraint | Deskripsi |
|-------|-----------|------------|-----------|
| id | varchar(36) | PRIMARY KEY | UUID, auto-generated |
| slug | text | NOT NULL, UNIQUE | URL-friendly identifier |
| judul | text | NOT NULL | Judul artikel |
| ringkasan | text | NULL | Ringkasan singkat |
| isi | text | NULL | Konten artikel lengkap |
| kategori | text | NULL | Kategori: Gizi, Imunisasi, Kesehatan, PHBS |
| phase | text | NULL | Fase: kehamilan_1, kehamilan_2, kehamilan_3, bayi, balita |
| tags | text | NULL | Tags CSV |
| gambar_url | text | NULL | URL gambar cover |
| read_minutes | int | DEFAULT 5 | Estimasi waktu baca |
| is_published | boolean | DEFAULT true | Status publikasi |
| created_at | timestamptz | NOT NULL | Timestamp pembuatan |
| updated_at | timestamptz | NOT NULL | Timestamp update |
| deleted_at | timestamptz | NULL | Timestamp soft delete |

**Index**:
- PRIMARY KEY (id)
- UNIQUE INDEX idx_contents_slug (slug)
- INDEX idx_contents_deleted_at (deleted_at)

**Relasi**:
- CONTENTS (1) → (N) BOOKMARKS (planned)

---

### 6. TABEL QUIZZES

**Deskripsi**: Menyimpan kuis/ujian edukasi kesehatan

| Kolom | Tipe Data | Constraint | Deskripsi |
|-------|-----------|------------|-----------|
| id | varchar(36) | PRIMARY KEY | UUID, auto-generated |
| judul | text | NOT NULL | Judul kuis |
| deskripsi | text | NULL | Deskripsi kuis |
| kategori | text | NULL | Kategori: Gizi, Imunisasi, PHBS |
| phase | text | NULL | Filter fase opsional |
| is_published | boolean | DEFAULT true | Status publikasi |
| created_at | timestamptz | NOT NULL | Timestamp pembuatan |
| updated_at | timestamptz | NOT NULL | Timestamp update |
| deleted_at | timestamptz | NULL | Timestamp soft delete |

**Index**:
- PRIMARY KEY (id)
- INDEX idx_quizzes_deleted_at (deleted_at)

**Relasi**:
- QUIZZES (1) → (N) QUIZ_QUESTIONS
- QUIZZES (1) → (N) QUIZ_ATTEMPTS

---

### 7. TABEL QUIZ_QUESTIONS

**Deskripsi**: Menyimpan pertanyaan dalam kuis

| Kolom | Tipe Data | Constraint | Deskripsi |
|-------|-----------|------------|-----------|
| id | varchar(36) | PRIMARY KEY | UUID, auto-generated |
| quiz_id | varchar(36) | NOT NULL, FK | Referensi ke quizzes.id |
| teks | text | NOT NULL | Teks pertanyaan |
| pilihan | text | NULL | JSON string array opsi jawaban |
| jawaban_benar | text | NULL | Jawaban benar (A, B, C, D) |
| penjelasan | text | NULL | Penjelasan jawaban |
| urutan | int | DEFAULT 0 | Urutan pertanyaan |
| created_at | timestamptz | NOT NULL | Timestamp pembuatan |
| deleted_at | timestamptz | NULL | Timestamp soft delete |

**Foreign Key**:
- CONSTRAINT fk_quizzes_pertanyaan FOREIGN KEY (quiz_id) REFERENCES quizzes(id)

**Index**:
- PRIMARY KEY (id)
- INDEX idx_quiz_questions_quiz_id (quiz_id)
- INDEX idx_quiz_questions_deleted_at (deleted_at)

**Relasi**:
- QUIZ_QUESTIONS (N) → (1) QUIZZES

---

### 8. TABEL QUIZ_ATTEMPTS

**Deskripsi**: Mencatat setiap kali pengguna mengerjakan kuis

| Kolom | Tipe Data | Constraint | Deskripsi |
|-------|-----------|------------|-----------|
| id | varchar(36) | PRIMARY KEY | UUID, auto-generated |
| pengguna_id | varchar(36) | NOT NULL, FK | Referensi ke pengguna.id |
| quiz_id | varchar(36) | NOT NULL, FK | Referensi ke quizzes.id |
| skor | int | NULL | Skor yang didapat |
| total | int | NULL | Total skor maksimal |
| created_at | timestamptz | NOT NULL | Timestamp saat kuis dikerjakan |

**Foreign Keys**:
- CONSTRAINT fk_quiz_attempts_pengguna FOREIGN KEY (pengguna_id) REFERENCES pengguna(id)
- CONSTRAINT fk_quiz_attempts_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id)

**Index**:
- PRIMARY KEY (id)
- INDEX idx_quiz_attempts_pengguna_id (pengguna_id)
- INDEX idx_quiz_attempts_quiz_id (quiz_id)

**Relasi**:
- QUIZ_ATTEMPTS (N) → (1) PENGGUNA
- QUIZ_ATTEMPTS (N) → (1) QUIZZES

---

### 9. TABEL RESEP_GIZI

**Deskripsi**: Menyimpan resep makanan bergizi untuk berbagai fase kehidupan

| Kolom | Tipe Data | Constraint | Deskripsi |
|-------|-----------|------------|-----------|
| id | bigint | PRIMARY KEY, AUTO INCREMENT | ID resep |
| nama | text | NOT NULL | Nama resep |
| slug | text | NOT NULL, UNIQUE | URL-friendly identifier |
| deskripsi | text | NULL | Deskripsi resep lengkap |
| kategori | text | NULL | Kategori: sarapan, makan_siang, makan_malam, camilan |
| usia_kategori | text | NULL | Kategori usia: ibu_hamil, bayi_0_6, mpasi_6_24, ibu_menyusui, balita_2_5 |
| durasi_menit | int | NULL | Durasi memasak dalam menit |
| kalori | int | NULL | Kandungan kalori per porsi |
| nutrisi | text | NULL | JSON array nutrisi |
| gambar_url | text | NULL | URL gambar resep |
| is_published | boolean | DEFAULT true | Status publikasi |
| created_at | timestamptz | NOT NULL | Timestamp pembuatan |
| updated_at | timestamptz | NOT NULL | Timestamp update |
| deleted_at | timestamptz | NULL | Timestamp soft delete |

**Index**:
- PRIMARY KEY (id)
- UNIQUE INDEX idx_resep_gizi_slug (slug)
- INDEX idx_resep_gizi_deleted_at (deleted_at)

**Relasi**:
- RESEP_GIZI (1) → (N) JADWAL_MAKAN (planned)

---

### 10. TABEL JADWAL_MAKAN (PLANNED)

**Deskripsi**: Menyimpan jadwal makan yang direncanakan pengguna

| Kolom | Tipe Data | Constraint | Deskripsi |
|-------|-----------|------------|-----------|
| id | bigint | PRIMARY KEY, AUTO INCREMENT | ID jadwal |
| pengguna_id | varchar(36) | NOT NULL, FK | Referensi ke pengguna.id |
| resep_id | bigint | NOT NULL, FK | Referensi ke resep_gizi.id |
| tanggal | date | NOT NULL | Tanggal jadwal makan |
| waktu_makan | varchar(50) | NOT NULL | Waktu makan: sarapan, makan_siang, makan_malam, camilan |
| catatan | text | NULL | Catatan pengguna |
| created_at | timestamptz | NOT NULL | Timestamp pembuatan |

**Foreign Keys**:
- FOREIGN KEY (pengguna_id) REFERENCES pengguna(id)
- FOREIGN KEY (resep_id) REFERENCES resep_gizi(id)

**Index**:
- PRIMARY KEY (id)
- INDEX idx_jadwal_makan_pengguna_id (pengguna_id)
- INDEX idx_jadwal_makan_tanggal (tanggal)

**Relasi**:
- JADWAL_MAKAN (N) → (1) PENGGUNA
- JADWAL_MAKAN (N) → (1) RESEP_GIZI

**Status**: Belum diaktifkan di AutoMigrate

---

### 11. TABEL BOOKMARKS (PLANNED)

**Deskripsi**: Menyimpan artikel yang di-bookmark oleh pengguna

| Kolom | Tipe Data | Constraint | Deskripsi |
|-------|-----------|------------|-----------|
| id | bigint | PRIMARY KEY, AUTO INCREMENT | ID bookmark |
| pengguna_id | varchar(36) | NOT NULL, FK | Referensi ke pengguna.id |
| content_id | varchar(36) | NOT NULL, FK | Referensi ke contents.id |
| created_at | timestamptz | NOT NULL | Timestamp bookmark dibuat |

**Foreign Keys**:
- FOREIGN KEY (pengguna_id) REFERENCES pengguna(id)
- FOREIGN KEY (content_id) REFERENCES contents(id)

**Index**:
- PRIMARY KEY (id)
- UNIQUE INDEX idx_bookmarks_pengguna_content (pengguna_id, content_id)
- INDEX idx_bookmarks_pengguna_id (pengguna_id)

**Relasi**:
- BOOKMARKS (N) → (1) PENGGUNA
- BOOKMARKS (N) → (1) CONTENTS

**Status**: Belum diimplementasikan

---

### 12. TABEL USER_PROFILES (SUPABASE AUTH - OPTIONAL)

**Deskripsi**: Profil pengguna dari Supabase Auth

| Kolom | Tipe Data | Constraint | Deskripsi |
|-------|-----------|------------|-----------|
| id | uuid | PRIMARY KEY, FK | Referensi ke auth.users(id) |
| full_name | text | NULL | Nama lengkap |
| email | text | UNIQUE | Email pengguna |
| avatar_url | text | NULL | URL avatar |
| created_at | timestamptz | DEFAULT now() | Timestamp pembuatan |
| updated_at | timestamptz | DEFAULT now() | Timestamp update |

**Foreign Key**:
- FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE

**Status**: Optional, hanya jika menggunakan Supabase built-in auth

---

## 🔗 Ringkasan Relasi

```
PENGGUNA (1) ─── (N) ANAK
PENGGUNA (1) ─── (N) RIWAYAT_IMUNISASI (indirect via ANAK)
PENGGUNA (1) ─── (N) QUIZ_ATTEMPTS
PENGGUNA (1) ─── (N) JADWAL_MAKAN (planned)
PENGGUNA (1) ─── (N) BOOKMARKS (planned)

ANAK (1) ─── (N) RIWAYAT_IMUNISASI

MASTER_VAKSIN (1) ─── (N) RIWAYAT_IMUNISASI

QUIZZES (1) ─── (N) QUIZ_QUESTIONS
QUIZZES (1) ─── (N) QUIZ_ATTEMPTS

PENGGUNA (N) ─── (N) QUIZZES (via QUIZ_ATTEMPTS)

RESEP_GIZI (1) ─── (N) JADWAL_MAKAN (planned)

CONTENTS (1) ─── (N) BOOKMARKS (planned)
```

---

## ⚙️ Teknis Implementasi

### 1. Primary Key Strategy
- **UUID (varchar(36))**: Untuk tabel utama (pengguna, anak, contents, quizzes, dll)
- **Auto Increment (int/bigint)**: Untuk tabel master (master_vaksin, resep_gizi, jadwal_makan, bookmarks)

### 2. Soft Delete Pattern
- Kolom `deleted_at` bertipe `timestamptz` dengan default `NULL`
- Record dengan `deleted_at != NULL` dianggap terhapus
- GORM otomatis handle soft delete

### 3. Timestamp Management
- Semua timestamp menggunakan `timestamptz` (with timezone)
- `created_at`: Set otomatis saat insert
- `updated_at`: Set otomatis saat update
- `deleted_at`: Set saat soft delete

### 4. Denormalisasi
- `riwayat_imunisasi.nama_vaksin`: Disimpan redundan dari `master_vaksin.nama_vaksin`
- Tujuan: Performa query dan audit trail

### 5. JSON Storage
- `quiz_questions.pilihan`: JSON string array untuk opsi jawaban
- `resep_gizi.nutrisi`: JSON string array untuk nutrisi
- Format: JSON string (bukan native PostgreSQL array) untuk kompatibilitas GORM

### 6. Index Strategy
- **Primary Key**: Otomatis di-index
- **Foreign Key**: Di-index untuk performa join
- **Unique Constraint**: Otomatis di-index (no_hp, slug, nama_vaksin)
- **Soft Delete**: Di-index untuk filter cepat
- **Query Pattern**: Index pada kolom yang sering di-where

---

## 📋 Status Implementasi

### ✅ Sudah Migrated (AutoMigrate)
1. PENGGUNA
2. ANAK
3. MASTER_VAKSIN (dengan 26 record seed)
4. RIWAYAT_IMUNISASI
5. CONTENTS
6. QUIZZES
7. QUIZ_QUESTIONS
8. QUIZ_ATTEMPTS
9. RESEP_GIZI

### ⏳ Planned (Belum Migrated)
1. JADWAL_MAKAN - Sudah ada di controller, belum persistent
2. BOOKMARKS - Endpoint masih stub

### 🔧 Optional
1. USER_PROFILES - Hanya jika menggunakan Supabase Auth

---

## 🚀 Rencana Implementasi

### Phase 1: Stabilkan Schema Aktif
- [ ] Validasi semua foreign key constraint
- [ ] Test performa query dengan index
- [ ] Pastikan seed data master_vaksin lengkap (26 record)

### Phase 2: Aktifkan Planned Tables
- [ ] Tambahkan JADWAL_MAKAN ke AutoMigrate
- [ ] Tambahkan BOOKMARKS ke AutoMigrate
- [ ] Implementasi endpoint untuk jadwal_makan dan bookmarks

### Phase 3: Optimasi
- [ ] Tambahkan composite index untuk query kompleks
- [ ] Implementasi pagination untuk query besar
- [ ] Monitoring query performance

### Phase 4: Migration Strategy
- [ ] Buat SQL migration versioned
- [ ] Tidak bergantung penuh pada AutoMigrate
- [ ] Dokumentasi rollback procedure

---

## 📊 Data Volume Estimation

| Tabel | Estimasi Record | Growth Rate |
|-------|----------------|-------------|
| PENGGUNA | 100-1,000 | Low |
| ANAK | 200-2,000 | Low |
| MASTER_VAKSIN | 26 | Static |
| RIWAYAT_IMUNISASI | 5,000-50,000 | Medium |
| CONTENTS | 50-500 | Low |
| QUIZZES | 10-100 | Low |
| QUIZ_QUESTIONS | 100-1,000 | Low |
| QUIZ_ATTEMPTS | 1,000-10,000 | Medium |
| RESEP_GIZI | 50-500 | Low |
| JADWAL_MAKAN | 1,000-10,000 | Medium |
| BOOKMARKS | 500-5,000 | Medium |

---

## 🔒 Keamanan & Validasi

### 1. Authentication
- PIN disimpan sebagai hash bcrypt (bukan plaintext)
- Nomor HP sebagai identifier unik

### 2. Authorization
- Role-based access: ibu, ayah, kader, admin
- Admin memiliki akses penuh
- Kader bisa mencatat imunisasi
- Ibu/Ayah hanya bisa akses data anak sendiri

### 3. Data Validation
- Foreign key constraint untuk integritas referensial
- Unique constraint untuk mencegah duplikasi
- NOT NULL constraint untuk data wajib

---

## 📚 Referensi

- **Buku KIA 2024**: Standar nasional imunisasi anak
- **GORM Documentation**: ORM untuk Go
- **Supabase**: Backend-as-a-Service untuk PostgreSQL
- **PostgreSQL**: Database engine

---

## 📝 Catatan Penting

1. **UUID vs Auto Increment**: UUID dipilih untuk scalability di distributed system
2. **Soft Delete**: Data tidak dihapus fisik untuk audit trail dan recovery
3. **Denormalisasi**: Nama vaksin disimpan redundan untuk performa
4. **JSON String**: Digunakan untuk kompatibilitas cross-platform
5. **Index**: Strategis ditempatkan untuk query yang sering digunakan
6. **Planned Tables**: Sudah di-design, tinggal aktifkan di AutoMigrate

---

*Dokumen ini dibuat berdasarkan analisis kode backend dan frontend yang ada.*
*Last Updated: 2026-03-30*
