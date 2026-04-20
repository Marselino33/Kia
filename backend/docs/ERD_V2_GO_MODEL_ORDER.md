# ERD V2 - Urutan Perubahan Model Go (Minim Risiko)

Dokumen ini menyusun urutan perubahan model Go agar transisi dari skema lama ke ERD V2 aman dan bertahap.

## Prinsip

- Jangan putus kompatibilitas endpoint lama secara langsung.
- Pakai dual-read dan dual-write selama fase transisi.
- Migrasi data dilakukan lebih dulu, baru pengalihan endpoint penuh.

## Fase 1 - Tambah model baru tanpa menghapus model lama

Tambahkan file model baru:

1. app/models/kategori_konten.go
2. app/models/sub_kategori_konten.go
3. app/models/konten.go
4. app/models/stimulus_v2.go
5. app/models/self_check.go
6. app/models/kuis_v2.go
7. app/models/riwayat_baca.go

Catatan:
- Pertahankan model lama tetap ada: content.go, quiz.go, dan tabel lama lain.
- Tambahkan tag gorm table name sesuai ERD V2.

## Fase 2 - Repository layer dual-read

Tambahkan repository baru:

1. app/repositories/konten_v2.go
2. app/repositories/stimulus_v2.go
3. app/repositories/self_check.go
3. app/repositories/kuis_v2.go
4. app/repositories/riwayat_baca.go

Aturan:
- Read endpoint publik utama mulai baca dari tabel ERD V2.
- Jika data belum ada, fallback baca tabel lama.

## Fase 3 - Controller dual-write admin

Ubah controller admin agar write ke ERD V2:

1. controllers/admin.go
   - POST/PUT/DELETE konten tulis ke konten (ERD V2)
   - endpoint per fitur tulis ke tabel domain masing-masing
2. controllers/master.go
   - GET konten baca konten (ERD V2)
   - GET detail baca konten (ERD V2)

Sementara itu, endpoint lama tetap disediakan sampai frontend selesai migrasi.

## Fase 4 - Frontend switch endpoint

Ubah frontend admin/public:

1. pages/admin/AdminContent.jsx -> pakai endpoint ERD V2
2. pages/content/ContentList.jsx -> baca konten ERD V2
3. pages/content/ContentDetail.jsx -> detail konten ERD V2
4. halaman parenting/gizi/phbs/mental -> endpoint domain ERD V2

## Fase 5 - Cleanup

Setelah verifikasi stabil:

1. Hapus fallback read tabel lama.
2. Bekukan write ke tabel lama.
3. Optional: migrasi final drop tabel lama dalam migration terpisah.

## Daftar model minimum yang perlu disesuaikan

1. app/models/pengguna.go
   - pertahankan field: id, nama, email, password_hash, role, desa, created_at, updated_at, deleted_at
2. app/models/anak.go
   - sudah sesuai ERD V2, cukup sinkronkan tipe tanggal_lahir bila perlu
3. app/models/content.go
   - tetap dipakai sementara untuk kompatibilitas tabel lama
4. app/models/quiz.go
   - tetap dipakai sementara untuk kompatibilitas tabel lama

## Kriteria siap pindah penuh

- Semua endpoint admin CRUD sudah menulis ke tabel ERD V2.
- Semua endpoint publik membaca dari tabel ERD V2.
- Verifikasi data utama: pengguna, anak, konten, kuis, self-check, riwayat baca.
- Tidak ada error foreign key dan slug duplicate di staging.
