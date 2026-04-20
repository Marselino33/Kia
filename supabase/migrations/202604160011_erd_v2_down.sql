BEGIN;

-- ============================================================
-- ERD V2 rollback (conservative)
-- Drops only ERD V2 introduced tables.
-- Keeps legacy tables and compatibility columns to avoid breaking running app.
-- ============================================================

DROP TABLE IF EXISTS public.riwayat_baca;

DROP TABLE IF EXISTS public.jawaban_kuis;
DROP TABLE IF EXISTS public.hasil_kuis;
DROP TABLE IF EXISTS public.pilihan_soal;
DROP TABLE IF EXISTS public.soal_kuis;
DROP TABLE IF EXISTS public.kuis;

DROP TABLE IF EXISTS public.jawaban_self_check;
DROP TABLE IF EXISTS public.sesi_self_check;
DROP TABLE IF EXISTS public.pertanyaan_self_check;

DROP TABLE IF EXISTS public.progres_stimulus;

DROP TABLE IF EXISTS public.konten;
DROP TABLE IF EXISTS public.sub_kategori_konten;
DROP TABLE IF EXISTS public.kategori_konten;

COMMIT;
