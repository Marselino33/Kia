BEGIN;

-- ============================================================
-- ERD V2 (staged, minimal-risk) without superadmin
-- This migration ADDS new domain tables and backfills from current schema.
-- Existing tables (contents, quizzes, quiz_questions, ...) are kept for compatibility.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- KONTEN MASTER
-- ============================================================
CREATE TABLE IF NOT EXISTS public.kategori_konten (
  id bigserial PRIMARY KEY,
  slug text NOT NULL,
  nama text NOT NULL,
  deskripsi text,
  urutan integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_kategori_konten_slug_unique
  ON public.kategori_konten (lower(slug))
  WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS public.sub_kategori_konten (
  id bigserial PRIMARY KEY,
  kategori_id bigint NOT NULL REFERENCES public.kategori_konten(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  slug text NOT NULL,
  nama text NOT NULL,
  deskripsi text,
  urutan integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_sub_kategori_konten_slug_unique
  ON public.sub_kategori_konten (kategori_id, lower(slug))
  WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS public.konten (
  id varchar(36) PRIMARY KEY,
  kategori_id bigint REFERENCES public.kategori_konten(id) ON UPDATE CASCADE ON DELETE SET NULL,
  sub_kategori_id bigint REFERENCES public.sub_kategori_konten(id) ON UPDATE CASCADE ON DELETE SET NULL,
  judul text NOT NULL,
  slug text NOT NULL,
  ringkasan text,
  isi text,
  gambar_url text,
  video_url text,
  tags text,
  filter_usia text,
  read_minutes integer DEFAULT 5,
  is_published boolean DEFAULT true,
  dibuat_oleh varchar(36) REFERENCES public.pengguna(id) ON UPDATE CASCADE ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_konten_slug_unique
  ON public.konten (lower(slug))
  WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_konten_kategori_id ON public.konten (kategori_id);
CREATE INDEX IF NOT EXISTS idx_konten_sub_kategori_id ON public.konten (sub_kategori_id);
CREATE INDEX IF NOT EXISTS idx_konten_dibuat_oleh ON public.konten (dibuat_oleh);
CREATE INDEX IF NOT EXISTS idx_konten_deleted_at ON public.konten (deleted_at);

INSERT INTO public.kategori_konten (slug, nama, deskripsi, urutan)
VALUES
  ('parenting', 'Parenting', 'Konten parenting dan pola asuh', 1),
  ('phbs', 'PHBS', 'Perilaku Hidup Bersih dan Sehat', 2),
  ('gizi-ibu', 'Gizi Ibu', 'Konten gizi untuk ibu', 3),
  ('gizi-anak', 'Gizi Anak', 'Konten gizi untuk anak', 4),
  ('mpasi', 'MPASI', 'Konten resep dan panduan MPASI', 5),
  ('mental-orang-tua', 'Mental Orang Tua', 'Konten kesehatan mental orang tua', 6),
  ('informasi-umum', 'Informasi Umum', 'Konten informasi umum', 7),
  ('lainnya', 'Lainnya', 'Konten umum lintas kategori', 99)
ON CONFLICT DO NOTHING;

WITH admin_default AS (
  SELECT id
  FROM public.pengguna
  WHERE role = 'admin'
  ORDER BY created_at ASC
  LIMIT 1
)
INSERT INTO public.konten (
  id, judul, slug, ringkasan, isi, gambar_url, tags, filter_usia,
  read_minutes, is_published, dibuat_oleh, created_at, updated_at, deleted_at
)
SELECT
  c.id,
  c.judul,
  c.slug,
  c.ringkasan,
  c.isi,
  c.gambar_url,
  c.tags,
  c.phase,
  COALESCE(c.read_minutes, 5),
  COALESCE(c.is_published, true),
  COALESCE(c.admin_id, (SELECT id FROM admin_default)),
  c.created_at,
  c.updated_at,
  c.deleted_at
FROM public.contents c
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.konten (
  id, judul, slug, ringkasan, isi, gambar_url, tags, filter_usia,
  read_minutes, is_published, dibuat_oleh, created_at, updated_at, deleted_at
)
SELECT
  s.id::text,
  s.judul,
  s.slug,
  s.ringkasan,
  s.isi,
  s.gambar_url,
  s.tags,
  s.phase,
  COALESCE(s.read_minutes, 5),
  COALESCE(s.is_published, true),
  s.admin_id,
  s.created_at,
  s.updated_at,
  s.deleted_at
FROM public.stimulus_anak s
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.konten (
  id, judul, slug, ringkasan, isi, gambar_url, tags, filter_usia,
  read_minutes, is_published, dibuat_oleh, created_at, updated_at, deleted_at
)
SELECT
  p.id::text,
  p.judul,
  p.slug,
  p.ringkasan,
  p.isi,
  p.gambar_url,
  p.tags,
  p.phase,
  COALESCE(p.read_minutes, 5),
  COALESCE(p.is_published, true),
  p.admin_id,
  p.created_at,
  p.updated_at,
  p.deleted_at
FROM public.phbs p
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.konten (
  id, judul, slug, ringkasan, isi, gambar_url, tags, filter_usia,
  read_minutes, is_published, dibuat_oleh, created_at, updated_at, deleted_at
)
SELECT
  g.id::text,
  g.judul,
  g.slug,
  g.ringkasan,
  g.isi,
  g.gambar_url,
  g.tags,
  g.phase,
  COALESCE(g.read_minutes, 5),
  COALESCE(g.is_published, true),
  g.admin_id,
  g.created_at,
  g.updated_at,
  g.deleted_at
FROM public.gizi_ibu g
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.konten (
  id, judul, slug, ringkasan, isi, gambar_url, tags, filter_usia,
  read_minutes, is_published, dibuat_oleh, created_at, updated_at, deleted_at
)
SELECT
  g.id::text,
  g.judul,
  g.slug,
  g.ringkasan,
  g.isi,
  g.gambar_url,
  g.tags,
  g.phase,
  COALESCE(g.read_minutes, 5),
  COALESCE(g.is_published, true),
  g.admin_id,
  g.created_at,
  g.updated_at,
  g.deleted_at
FROM public.gizi_anak g
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.konten (
  id, judul, slug, ringkasan, isi, gambar_url, tags, filter_usia,
  read_minutes, is_published, dibuat_oleh, created_at, updated_at, deleted_at
)
SELECT
  m.id::text,
  m.judul,
  m.slug,
  m.ringkasan,
  m.isi,
  m.gambar_url,
  m.tags,
  m.phase,
  COALESCE(m.read_minutes, 5),
  COALESCE(m.is_published, true),
  m.admin_id,
  m.created_at,
  m.updated_at,
  m.deleted_at
FROM public.mpasi m
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.konten (
  id, judul, slug, ringkasan, isi, gambar_url, tags, filter_usia,
  read_minutes, is_published, dibuat_oleh, created_at, updated_at, deleted_at
)
SELECT
  i.id::text,
  i.judul,
  i.slug,
  i.ringkasan,
  i.isi,
  i.gambar_url,
  i.tags,
  i.phase,
  COALESCE(i.read_minutes, 5),
  COALESCE(i.is_published, true),
  i.admin_id,
  i.created_at,
  i.updated_at,
  i.deleted_at
FROM public.informasi_umum i
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.konten (
  id, judul, slug, ringkasan, isi, gambar_url, tags, filter_usia,
  read_minutes, is_published, dibuat_oleh, created_at, updated_at, deleted_at
)
SELECT
  m.id::text,
  m.judul,
  m.slug,
  m.ringkasan,
  m.isi,
  m.gambar_url,
  m.tags,
  m.phase,
  COALESCE(m.read_minutes, 5),
  COALESCE(m.is_published, true),
  m.admin_id,
  m.created_at,
  m.updated_at,
  m.deleted_at
FROM public.mental_orang_tua m
ON CONFLICT (id) DO NOTHING;

UPDATE public.konten k
SET kategori_id = kk.id
FROM public.kategori_konten kk
WHERE k.kategori_id IS NULL
  AND (
    lower(replace(replace(coalesce(k.filter_usia, ''), '_', '-'), ' ', '-')) = lower(kk.slug)
    OR lower(replace(replace(coalesce(k.tags, ''), '_', '-'), ' ', '-')) = lower(kk.slug)
    OR lower(replace(replace(coalesce(k.judul, ''), '_', '-'), ' ', '-')) LIKE '%' || lower(kk.slug) || '%'
    OR lower(replace(replace(coalesce(k.ringkasan, ''), '_', '-'), ' ', '-')) LIKE '%' || lower(kk.slug) || '%'
  );

UPDATE public.konten k
SET kategori_id = kk.id
FROM public.kategori_konten kk
WHERE k.kategori_id IS NULL
  AND lower(kk.slug) = lower(
    CASE
      WHEN lower(coalesce(k.filter_usia, '')) LIKE '%parenting%' THEN 'parenting'
      WHEN lower(coalesce(k.filter_usia, '')) LIKE '%phbs%' THEN 'phbs'
      WHEN lower(coalesce(k.filter_usia, '')) LIKE '%gizi-ibu%' OR lower(coalesce(k.filter_usia, '')) LIKE '%gizi ibu%' THEN 'gizi-ibu'
      WHEN lower(coalesce(k.filter_usia, '')) LIKE '%gizi-anak%' OR lower(coalesce(k.filter_usia, '')) LIKE '%gizi anak%' THEN 'gizi-anak'
      WHEN lower(coalesce(k.filter_usia, '')) LIKE '%mpasi%' THEN 'mpasi'
      WHEN lower(coalesce(k.filter_usia, '')) LIKE '%mental%' THEN 'mental-orang-tua'
      WHEN lower(coalesce(k.filter_usia, '')) LIKE '%umum%' THEN 'informasi-umum'
      ELSE 'lainnya'
    END
  );

-- ============================================================
-- STIMULUS + PROGRESS
-- ============================================================
-- Keep stimulus_anak as-is if already exists with varchar id (compat mode).
-- Add ERD fields if missing.
ALTER TABLE IF EXISTS public.stimulus_anak ADD COLUMN IF NOT EXISTS usia_min_hari integer;
ALTER TABLE IF EXISTS public.stimulus_anak ADD COLUMN IF NOT EXISTS usia_max_hari integer;
ALTER TABLE IF EXISTS public.stimulus_anak ADD COLUMN IF NOT EXISTS usia_label text;
ALTER TABLE IF EXISTS public.stimulus_anak ADD COLUMN IF NOT EXISTS deskripsi text;
ALTER TABLE IF EXISTS public.stimulus_anak ADD COLUMN IF NOT EXISTS tujuan text;
ALTER TABLE IF EXISTS public.stimulus_anak ADD COLUMN IF NOT EXISTS alat_dibutuhkan text;
ALTER TABLE IF EXISTS public.stimulus_anak ADD COLUMN IF NOT EXISTS langkah_langkah text;
ALTER TABLE IF EXISTS public.stimulus_anak ADD COLUMN IF NOT EXISTS video_url text;
ALTER TABLE IF EXISTS public.stimulus_anak ADD COLUMN IF NOT EXISTS dibuat_oleh varchar(36);

CREATE TABLE IF NOT EXISTS public.progres_stimulus (
  id bigserial PRIMARY KEY,
  anak_id varchar(36) NOT NULL REFERENCES public.anak(id) ON UPDATE CASCADE ON DELETE CASCADE,
  stimulus_id text NOT NULL,
  is_done boolean DEFAULT false,
  catatan text,
  tanggal_done timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_progres_stimulus_anak_id ON public.progres_stimulus (anak_id);
CREATE INDEX IF NOT EXISTS idx_progres_stimulus_stimulus_id ON public.progres_stimulus (stimulus_id);

-- ============================================================
-- SELF CHECK
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pertanyaan_self_check (
  id bigserial PRIMARY KEY,
  teks_pertanyaan text NOT NULL,
  pilihan text,
  urutan integer DEFAULT 0,
  is_aktif boolean DEFAULT true,
  dibuat_oleh varchar(36) REFERENCES public.pengguna(id) ON UPDATE CASCADE ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.sesi_self_check (
  id bigserial PRIMARY KEY,
  pengguna_id varchar(36) NOT NULL REFERENCES public.pengguna(id) ON UPDATE CASCADE ON DELETE CASCADE,
  total_skor integer DEFAULT 0,
  level_stres text,
  rekomendasi text,
  tanggal_isi timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.jawaban_self_check (
  id bigserial PRIMARY KEY,
  sesi_id bigint NOT NULL REFERENCES public.sesi_self_check(id) ON UPDATE CASCADE ON DELETE CASCADE,
  pertanyaan_id bigint NOT NULL REFERENCES public.pertanyaan_self_check(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  skor_jawaban integer,
  teks_jawaban text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_jawaban_self_check_sesi_id ON public.jawaban_self_check (sesi_id);
CREATE INDEX IF NOT EXISTS idx_jawaban_self_check_pertanyaan_id ON public.jawaban_self_check (pertanyaan_id);

-- ============================================================
-- KUIS (ERD names) + backfill from existing quiz tables
-- ============================================================
CREATE TABLE IF NOT EXISTS public.kuis (
  id varchar(36) PRIMARY KEY,
  judul text NOT NULL,
  deskripsi text,
  kategori text,
  is_published boolean DEFAULT true,
  dibuat_oleh varchar(36) REFERENCES public.pengguna(id) ON UPDATE CASCADE ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.soal_kuis (
  id varchar(36) PRIMARY KEY,
  kuis_id varchar(36) NOT NULL REFERENCES public.kuis(id) ON UPDATE CASCADE ON DELETE CASCADE,
  teks text NOT NULL,
  penjelasan text,
  urutan integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.pilihan_soal (
  id bigserial PRIMARY KEY,
  soal_id varchar(36) NOT NULL REFERENCES public.soal_kuis(id) ON UPDATE CASCADE ON DELETE CASCADE,
  option_key text,
  option_text text,
  is_correct boolean DEFAULT false,
  urutan integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.hasil_kuis (
  id varchar(36) PRIMARY KEY,
  pengguna_id varchar(36) NOT NULL REFERENCES public.pengguna(id) ON UPDATE CASCADE ON DELETE CASCADE,
  kuis_id varchar(36) NOT NULL REFERENCES public.kuis(id) ON UPDATE CASCADE ON DELETE CASCADE,
  skor integer DEFAULT 0,
  total_soal integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.jawaban_kuis (
  id bigserial PRIMARY KEY,
  hasil_id varchar(36) NOT NULL REFERENCES public.hasil_kuis(id) ON UPDATE CASCADE ON DELETE CASCADE,
  soal_id varchar(36) NOT NULL REFERENCES public.soal_kuis(id) ON UPDATE CASCADE ON DELETE CASCADE,
  selected_option_key text,
  is_correct boolean,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.kuis (id, judul, deskripsi, kategori, is_published, created_at, updated_at, deleted_at)
SELECT q.id, q.judul, q.deskripsi, q.kategori, q.is_published, q.created_at, q.updated_at, q.deleted_at
FROM public.quizzes q
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.soal_kuis (id, kuis_id, teks, penjelasan, urutan, created_at, deleted_at)
SELECT qq.id, qq.quiz_id, qq.teks, qq.penjelasan, qq.urutan, qq.created_at, qq.deleted_at
FROM public.quiz_questions qq
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.pilihan_soal (id, soal_id, option_key, option_text, is_correct, urutan, created_at)
SELECT qo.id, qo.question_id, qo.option_key, qo.option_text, qo.is_correct, qo.urutan, qo.created_at
FROM public.quiz_options qo
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.hasil_kuis (id, pengguna_id, kuis_id, skor, total_soal, created_at)
SELECT qa.id, qa.pengguna_id, qa.quiz_id, qa.skor, qa.total, qa.created_at
FROM public.quiz_attempts qa
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.jawaban_kuis (id, hasil_id, soal_id, selected_option_key, is_correct, created_at)
SELECT qaa.id, qaa.attempt_id, qaa.question_id, qaa.selected_option_key, qaa.is_correct, qaa.created_at
FROM public.quiz_attempt_answers qaa
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- RIWAYAT BACA
-- ============================================================
CREATE TABLE IF NOT EXISTS public.riwayat_baca (
  id bigserial PRIMARY KEY,
  pengguna_id varchar(36) NOT NULL REFERENCES public.pengguna(id) ON UPDATE CASCADE ON DELETE CASCADE,
  tipe_konten text NOT NULL,
  konten_id text NOT NULL,
  waktu_akses timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_riwayat_baca_pengguna_waktu
  ON public.riwayat_baca (pengguna_id, waktu_akses DESC);
CREATE INDEX IF NOT EXISTS idx_riwayat_baca_tipe_konten
  ON public.riwayat_baca (tipe_konten);

COMMIT;
