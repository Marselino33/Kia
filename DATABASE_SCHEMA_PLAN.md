# Database Schema Plan (KIA) - Teks Detail

Dokumen ini berisi plan lengkap schema database dalam format teks terstruktur untuk pembuatan ERD.

---

## 1. TABEL PENGGUNA

**Deskripsi**: Menyimpan data pengguna aplikasi (Ibu, Ayah, Kader, Admin)

| Kolom | Tipe | Constraint | Deskripsi |
|-------|------|-----------|-----------|
| id | varchar(36) | PRIMARY KEY | UUID, auto-generated |
| nama | text | NOT NULL | Nama lengkap pengguna |
| no_hp | text | NOT NULL, UNIQUE INDEX | Nomor HP, identifier utama login |
| pin_hash | text | NOT NULL | Hash bcrypt dari PIN (bukan plaintext) |
| role | text | DEFAULT 'ibu' | Enum: ibu, ayah, kader, admin |
| desa | text | DEFAULT 'Hutabulu Mejan' | Nama desa tempat tinggal |
| created_at | timestamptz | NOT NULL | Timestamp pembuatan record |
| updated_at | timestamptz | NOT NULL | Timestamp update terakhir |
| deleted_at | timestamptz | SOFT DELETE INDEX | Timestamp soft delete (untuk GORM) |

**Index**:
- PRIMARY KEY (id)
- UNIQUE INDEX idx_pengguna_no_hp (no_hp)
- INDEX idx_pengguna_deleted_at (deleted_at)

---

## 2. TABEL ANAK

**Deskripsi**: Menyimpan data profil anak yang terdaftar oleh pengguna

| Kolom | Tipe | Constraint | Deskripsi |
|-------|------|-----------|-----------|
| id | varchar(36) | PRIMARY KEY | UUID, auto-generated |
| pengguna_id | varchar(36) | NOT NULL, FOREIGN KEY | Referensi ke pengguna.id (parent/caregiver) |
| nama | text | NOT NULL | Nama anak |
| tanggal_lahir | timestamptz | NOT NULL | Tanggal lahir anak (untuk hitung usia bulan) |
| jenis_kelamin | text | NOT NULL | Enum: laki-laki, perempuan |
| berat_lahir_kg | decimal | NULL | Berat saat lahir dalam kg |
| golongan_darah | text | NULL | Golongan darah: A, B, AB, O |
| created_at | timestamptz | NOT NULL | Timestamp pembuatan |
| updated_at | timestamptz | NOT NULL | Timestamp update |
| deleted_at | timestamptz | SOFT DELETE INDEX | Timestamp soft delete |

**Foreign Key**:
- CONSTRAINT fk_anak_pengguna FOREIGN KEY (pengguna_id) REFERENCES pengguna(id)

**Index**:
- PRIMARY KEY (id)
- INDEX idx_anak_pengguna_id (pengguna_id)
- INDEX idx_anak_deleted_at (deleted_at)

**Relasi**: ANAK (N) → (1) PENGGUNA

---

## 3. TABEL MASTER_VAKSIN

**Deskripsi**: Tabel master berisi 26 vaksin wajib dari Buku KIA 2024 (standar nasional)

| Kolom | Tipe | Constraint | Deskripsi |
|-------|------|-----------|-----------|
| id | int | PRIMARY KEY, AUTO INCREMENT | ID vaksin |
| nama_vaksin | varchar(100) | NOT NULL, UNIQUE INDEX | Nama vaksin (contoh: "Hepatitis B (HB-0)") |
| usia_bulan | int | NOT NULL | Usia pemberian vaksin dalam bulan (contoh: 0, 1, 2, 9, 18, 60) |
| usia_teks | varchar(100) | NOT NULL | Deskripsi usia pemberian (contoh: "0-24 jam setelah lahir") |
| deskripsi | text | NULL | Penjelasan lengkap penyakit dan vaksin |
| lokasi | varchar(200) | DEFAULT 'Posyandu Mejan / Puskesmas Balige' | Tempat pemberian vaksin |
| sumber | varchar(100) | DEFAULT 'Buku KIA 2024' | Sumber referensi |

**Index**:
- PRIMARY KEY (id)
- UNIQUE INDEX idx_master_vaksin_nama_vaksin (nama_vaksin)

**Data**: 26 record vaksin pre-loaded dari seed di backend

---

## 4. TABEL RIWAYAT_IMUNISASI

**Deskripsi**: Mencatat setiap vaksin yang sudah diberikan kepada anak

| Kolom | Tipe | Constraint | Deskripsi |
|-------|------|-----------|-----------|
| id | varchar(36) | PRIMARY KEY | UUID, auto-generated |
| anak_id | varchar(36) | NOT NULL, FOREIGN KEY | Referensi ke anak.id |
| master_vaksin_id | int | NOT NULL, FOREIGN KEY | Referensi ke master_vaksin.id |
| nama_vaksin | varchar(100) | NOT NULL | Denormalized: nama vaksin (copy dari master_vaksin) |
| tanggal_done | timestamptz | NOT NULL | Tanggal vaksin diberikan |
| dicatat_oleh | varchar(20) | NOT NULL | Siapa yang mencatat: "ibu" atau "kader" |
| catatan | text | NULL | Catatan tambahan (misal: reaksi, lokasi suntik) |
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

## 5. TABEL CONTENTS

**Deskripsi**: Menyimpan artikel/konten edukasi kesehatan ibu dan anak

| Kolom | Tipe | Constraint | Deskripsi |
|-------|------|-----------|-----------|
| id | varchar(36) | PRIMARY KEY | UUID, auto-generated |
| slug | text | NOT NULL, UNIQUE INDEX | URL-friendly identifier (contoh: "gizi-ibu-hamil") |
| judul | text | NOT NULL | Judul artikel |
| ringkasan | text | NULL | Ringkasan singkat (preview) |
| isi | text | NULL | Konten artikel lengkap (bisa berisi markdown/HTML) |
| kategori | text | NULL | Kategori konten: Gizi, Imunisasi, Kesehatan, PHBS, dll |
| phase | text | NULL | Fase kehidupan: kehamilan_1, kehamilan_2, kehamilan_3, bayi, balita, dll |
| tags | text | NULL | Tags CSV (contoh: "gizi,kehamilan,nutrisi") |
| gambar_url | text | NULL | URL gambar cover artikel |
| read_minutes | int | DEFAULT 5 | Estimasi waktu baca dalam menit |
| is_published | boolean | DEFAULT true | Status publikasi artikel |
| created_at | timestamptz | NOT NULL | Timestamp pembuatan |
| updated_at | timestamptz | NOT NULL | Timestamp update |
| deleted_at | timestamptz | SOFT DELETE INDEX | Timestamp soft delete |

**Index**:
- PRIMARY KEY (id)
- UNIQUE INDEX idx_contents_slug (slug)
- INDEX idx_contents_deleted_at (deleted_at)

---

## 6. TABEL QUIZZES

**Deskripsi**: Menyimpan kuis/ujian edukasi kesehatan

| Kolom | Tipe | Constraint | Deskripsi |
|-------|------|-----------|-----------|
| id | varchar(36) | PRIMARY KEY | UUID, auto-generated |
| judul | text | NOT NULL | Judul kuis (contoh: "Nutrisi Ibu Hamil") |
| deskripsi | text | NULL | Deskripsi kuis |
| kategori | text | NULL | Kategori: Gizi, Imunisasi, PHBS, dll |
| phase | text | NULL | Filter fase opsional (kehamilan, bayi, balita, dll) |
| is_published | boolean | DEFAULT true | Status publikasi kuis |
| created_at | timestamptz | NOT NULL | Timestamp pembuatan |
| updated_at | timestamptz | NOT NULL | Timestamp update |
| deleted_at | timestamptz | SOFT DELETE INDEX | Timestamp soft delete |

**Index**:
- PRIMARY KEY (id)
- INDEX idx_quizzes_deleted_at (deleted_at)

**Relasi**: QUIZZES (1) → (N) QUIZ_QUESTIONS

---

## 7. TABEL QUIZ_QUESTIONS

**Deskripsi**: Menyimpan pertanyaan dalam kuis

| Kolom | Tipe | Constraint | Deskripsi |
|-------|------|-----------|-----------|
| id | varchar(36) | PRIMARY KEY | UUID, auto-generated |
| quiz_id | varchar(36) | NOT NULL, FOREIGN KEY, INDEX | Referensi ke quizzes.id |
| teks | text | NOT NULL | Teks pertanyaan |
| pilihan | text | NULL | JSON string array opsi jawaban: ["A", "B", "C", "D"] |
| jawaban_benar | text | NULL | Jawaban benar (label: "A", "B", "C", atau "D") |
| penjelasan | text | NULL | Penjelasan jawaban (untuk pembelajaran) |
| urutan | int | DEFAULT 0 | Urutan pertanyaan dalam kuis |
| created_at | timestamptz | NOT NULL | Timestamp pembuatan |
| deleted_at | timestamptz | SOFT DELETE INDEX | Timestamp soft delete |

**Foreign Key**:
- CONSTRAINT fk_quizzes_pertanyaan FOREIGN KEY (quiz_id) REFERENCES quizzes(id)

**Index**:
- PRIMARY KEY (id)
- INDEX idx_quiz_questions_quiz_id (quiz_id)
- INDEX idx_quiz_questions_deleted_at (deleted_at)

**Relasi**: QUIZ_QUESTIONS (N) → (1) QUIZZES

---

## 8. TABEL QUIZ_ATTEMPTS

**Deskripsi**: Mencatat setiap kali pengguna mengerjakan kuis (untuk riwayat dan scoring)

| Kolom | Tipe | Constraint | Deskripsi |
|-------|------|-----------|-----------|
| id | varchar(36) | PRIMARY KEY | UUID, auto-generated |
| pengguna_id | varchar(36) | NOT NULL, FOREIGN KEY, INDEX | Referensi ke pengguna.id |
| quiz_id | varchar(36) | NOT NULL, FOREIGN KEY, INDEX | Referensi ke quizzes.id |
| skor | int | NULL | Skor yang didapat pengguna |
| total | int | NULL | Total skor maksimal kuis |
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

## 9. TABEL RESEP_GIZI

**Deskripsi**: Menyimpan resep makanan bergizi untuk berbagai fase kehidupan

| Kolom | Tipe | Constraint | Deskripsi |
|-------|------|-----------|-----------|
| id | bigint | PRIMARY KEY, AUTO INCREMENT | ID resep |
| nama | text | NOT NULL | Nama resep (contoh: "Bubur Tim Telur Salmon") |
| slug | text | NOT NULL, UNIQUE INDEX | URL-friendly identifier (contoh: "bubur-tim-telur-salmon") |
| deskripsi | text | NULL | Deskripsi resep lengkap (bahan-bahan, cara membuat) |
| kategori | text | NULL | Kategori waktu makan: sarapan, makan_siang, makan_malam, camilan |
| usia_kategori | text | NULL | Kategori usia: ibu_hamil, bayi_0_6, mpasi_6_24, ibu_menyusui, balita_2_5 |
| durasi_menit | int | NULL | Durasi memasak dalam menit |
| kalori | int | NULL | Kandungan kalori per porsi |
| nutrisi | text | NULL | JSON array nutrisi (contoh: ["protein", "kalsium", "zat_besi"]) |
| gambar_url | text | NULL | URL gambar resep |
| is_published | boolean | DEFAULT true | Status publikasi resep |
| created_at | timestamptz | NOT NULL | Timestamp pembuatan |
| updated_at | timestamptz | NOT NULL | Timestamp update |
| deleted_at | timestamptz | SOFT DELETE INDEX | Timestamp soft delete |

**Index**:
- PRIMARY KEY (id)
- UNIQUE INDEX idx_resep_gizi_slug (slug)
- INDEX idx_resep_gizi_deleted_at (deleted_at)

---

## 10. TABEL JADWAL_MAKAN (PLANNED - Belum di AutoMigrate)

**Deskripsi**: Menyimpan jadwal makan yang direncanakan pengguna (saat ini in-memory, placeholder untuk persistence)

| Kolom | Tipe | Constraint | Deskripsi |
|-------|------|-----------|-----------|
| id | bigint | PRIMARY KEY, AUTO INCREMENT | ID jadwal |
| pengguna_id | varchar(36) | NOT NULL, FOREIGN KEY | Referensi ke pengguna.id |
| resep_id | bigint | NOT NULL, FOREIGN KEY | Referensi ke resep_gizi.id |
| tanggal | date | NOT NULL | Tanggal jadwal makan |
| waktu_makan | varchar(50) | NOT NULL | Waktu makan: sarapan, makan_siang, makan_malam, camilan |
| catatan | text | NULL | Catatan pengguna tentang makan |
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

**Status**: Belum diaktifkan di AutoMigrate, perlu di-include di model list untuk persistence.

---

## 11. TABEL BOOKMARKS (PLANNED - Belum Persistent)

**Deskripsi**: Menyimpan artikel yang di-bookmark oleh pengguna

| Kolom | Tipe | Constraint | Deskripsi |
|-------|------|-----------|-----------|
| id | bigint | PRIMARY KEY, AUTO INCREMENT | ID bookmark |
| pengguna_id | varchar(36) | NOT NULL, FOREIGN KEY | Referensi ke pengguna.id |
| content_id | varchar(36) | NOT NULL, FOREIGN KEY | Referensi ke contents.id |
| created_at | timestamptz | NOT NULL | Timestamp bookmark dibuat |

**Foreign Keys**:
- FOREIGN KEY (pengguna_id) REFERENCES pengguna(id)
- FOREIGN KEY (content_id) REFERENCES contents(id)

**Index**:
- PRIMARY KEY (id)
- UNIQUE INDEX idx_bookmarks_pengguna_content (pengguna_id, content_id) -- cegah duplikasi
- INDEX idx_bookmarks_pengguna_id (pengguna_id)

**Relasi**:
- BOOKMARKS (N) → (1) PENGGUNA
- BOOKMARKS (N) → (1) CONTENTS

**Status**: Belum di-implementasikan, endpoint masih stub (baris 60-72 di master.go).

---

## 12. TABEL USER_PROFILES (SUPABASE AUTH - Optional)

**Deskripsi**: Profil pengguna dari Supabase Auth (management identitas terpisah, optional jika pakai Supabase auth)

| Kolom | Tipe | Constraint | Deskripsi |
|-------|------|-----------|-----------|
| id | uuid | PRIMARY KEY, FOREIGN KEY | Referensi langsung ke auth.users(id) |
| full_name | text | NULL | Nama lengkap |
| email | text | UNIQUE | Email pengguna (dari auth.users) |
| avatar_url | text | NULL | URL avatar pengguna |
| created_at | timestamptz | DEFAULT now() | Timestamp pembuatan |
| updated_at | timestamptz | DEFAULT now() | Timestamp update |

**Foreign Key**:
- FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE

**Status**: Optional, hanya jika menggunakan Supabase built-in auth (saat ini menggunakan PENGGUNA tabel internal).

---

## RINGKASAN RELASI (Entity Relationship)

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

## CATATAN TEKNIS

1. **UUID**: ID utama untuk tabel utama (pengguna, anak, contents, quizzes, dll) menggunakan UUID agar scalable di distributed system.
2. **Soft Delete**: Kolom `deleted_at` digunakan oleh GORM untuk soft delete (record tidak dihapus fisik, hanya ditandai deleted).
3. **Timestamp**: Semua `created_at`, `updated_at`, `deleted_at` adalah tipe `timestamptz` (with timezone) karena database Supabase dalam timezone PostgreSQL.
4. **Denormalisasi**: `riwayat_imunisasi.nama_vaksin` disimpan redundan dari `master_vaksin.nama_vaksin` untuk performa query dan audit trail.
5. **JSON String**: Kolom seperti `pilihan` (quiz option), `nutrisi` (resep) disimpan sebagai JSON string (bukan array native PostgreSQL) untuk kompatibilitas dengan client dan GORM.
6. **Index**: Foreign key dan kolom sering di-query sudah diindex untuk performa.
7. **Planned Tables** (`jadwal_makan`, `bookmarks`): Sudah disain ERD-nya tapi belum di-AutoMigrate. Tinggal tambah ke model list di `app.go` untuk activate.

---

## LANGKAH IMPLEMENTASI ERD

Gunakan informasi di atas untuk membuat ERD dengan tools seperti:
- **PlantUML**: Gunakan syntax ER diagram
- **Mermaid**: Format Markdown ER
- **Lucidchart / Draw.io**: GUI-based
- **dbdiagram.io**: Online ER diagram builder

Prioritas visualisasi:
1. **Core** (sudah migrated): PENGGUNA → ANAK → RIWAYAT_IMUNISASI ← MASTER_VAKSIN
2. **Content & Learning**: CONTENTS, QUIZZES → QUIZ_QUESTIONS, QUIZ_ATTEMPTS ← PENGGUNA
3. **Nutrition**: RESEP_GIZI ← JADWAL_MAKAN ← PENGGUNA (planned)
4. **Social**: BOOKMARKS ← PENGGUNA, CONTENTS (planned)
