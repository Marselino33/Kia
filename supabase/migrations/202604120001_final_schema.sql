-- Final baseline migration for SEJIWA backend (PostgreSQL / Supabase)
-- Safe to run multiple times (idempotent where possible)

BEGIN;

-- ============================================================
-- Utility: updated_at trigger function
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- Core tables
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pengguna (
  id varchar(36) PRIMARY KEY,
  nama text NOT NULL,
  no_hp text NOT NULL,
  pin_hash text NOT NULL,
  role text NOT NULL DEFAULT 'ibu',
  desa text NOT NULL DEFAULT 'Hutabulu Mejan',
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  deleted_at timestamptz NULL
);

ALTER TABLE public.pengguna
  ADD COLUMN IF NOT EXISTS nama text,
  ADD COLUMN IF NOT EXISTS no_hp text,
  ADD COLUMN IF NOT EXISTS pin_hash text,
  ADD COLUMN IF NOT EXISTS role text DEFAULT 'ibu',
  ADD COLUMN IF NOT EXISTS desa text DEFAULT 'Hutabulu Mejan',
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'pengguna_role_check'
      AND conrelid = 'public.pengguna'::regclass
  ) THEN
    ALTER TABLE public.pengguna
      ADD CONSTRAINT pengguna_role_check
      CHECK (role IN ('ibu', 'ayah', 'kader', 'admin', 'user'));
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_pengguna_no_hp_unique
  ON public.pengguna (no_hp)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_pengguna_deleted_at ON public.pengguna (deleted_at);

CREATE TABLE IF NOT EXISTS public.anak (
  id varchar(36) PRIMARY KEY,
  pengguna_id varchar(36) NOT NULL,
  nama text NOT NULL,
  tanggal_lahir timestamptz NOT NULL,
  jenis_kelamin text NOT NULL,
  berat_lahir_kg double precision NULL,
  golongan_darah text NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  deleted_at timestamptz NULL,
  CONSTRAINT fk_anak_pengguna
    FOREIGN KEY (pengguna_id) REFERENCES public.pengguna(id)
    ON UPDATE CASCADE ON DELETE CASCADE
);

ALTER TABLE public.anak
  ADD COLUMN IF NOT EXISTS pengguna_id varchar(36),
  ADD COLUMN IF NOT EXISTS nama text,
  ADD COLUMN IF NOT EXISTS tanggal_lahir timestamptz,
  ADD COLUMN IF NOT EXISTS jenis_kelamin text,
  ADD COLUMN IF NOT EXISTS berat_lahir_kg double precision,
  ADD COLUMN IF NOT EXISTS golongan_darah text,
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'anak_jenis_kelamin_check'
      AND conrelid = 'public.anak'::regclass
  ) THEN
    ALTER TABLE public.anak
      ADD CONSTRAINT anak_jenis_kelamin_check
      CHECK (jenis_kelamin IN ('laki-laki', 'perempuan'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_anak_pengguna_id ON public.anak (pengguna_id);
CREATE INDEX IF NOT EXISTS idx_anak_deleted_at ON public.anak (deleted_at);

CREATE TABLE IF NOT EXISTS public.master_vaksin (
  id bigserial PRIMARY KEY,
  nama_vaksin text NOT NULL,
  usia_bulan integer NOT NULL,
  usia_teks text NOT NULL,
  deskripsi text,
  lokasi text,
  sumber text,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  deleted_at timestamptz NULL
);

ALTER TABLE public.master_vaksin
  ADD COLUMN IF NOT EXISTS nama_vaksin text,
  ADD COLUMN IF NOT EXISTS usia_bulan integer,
  ADD COLUMN IF NOT EXISTS usia_teks text,
  ADD COLUMN IF NOT EXISTS deskripsi text,
  ADD COLUMN IF NOT EXISTS lokasi text,
  ADD COLUMN IF NOT EXISTS sumber text,
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS idx_master_vaksin_nama_unique
  ON public.master_vaksin (nama_vaksin)
  WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_master_vaksin_usia_bulan_id ON public.master_vaksin (usia_bulan, id);
CREATE INDEX IF NOT EXISTS idx_master_vaksin_deleted_at ON public.master_vaksin (deleted_at);

CREATE TABLE IF NOT EXISTS public.riwayat_imunisasi (
  id bigserial PRIMARY KEY,
  anak_id varchar(36) NOT NULL,
  master_vaksin_id bigint NOT NULL,
  nama_vaksin text NOT NULL,
  tanggal_done timestamptz NOT NULL,
  dicatat_oleh text NOT NULL,
  catatan text NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  deleted_at timestamptz NULL,
  CONSTRAINT fk_riwayat_anak
    FOREIGN KEY (anak_id) REFERENCES public.anak(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_riwayat_master_vaksin
    FOREIGN KEY (master_vaksin_id) REFERENCES public.master_vaksin(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

ALTER TABLE public.riwayat_imunisasi
  ADD COLUMN IF NOT EXISTS anak_id varchar(36),
  ADD COLUMN IF NOT EXISTS master_vaksin_id bigint,
  ADD COLUMN IF NOT EXISTS nama_vaksin text,
  ADD COLUMN IF NOT EXISTS tanggal_done timestamptz,
  ADD COLUMN IF NOT EXISTS dicatat_oleh text,
  ADD COLUMN IF NOT EXISTS catatan text,
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'riwayat_imunisasi_dicatat_oleh_check'
      AND conrelid = 'public.riwayat_imunisasi'::regclass
  ) THEN
    ALTER TABLE public.riwayat_imunisasi
      ADD CONSTRAINT riwayat_imunisasi_dicatat_oleh_check
      CHECK (dicatat_oleh IN ('ibu', 'kader', 'admin'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_riwayat_imunisasi_anak_id ON public.riwayat_imunisasi (anak_id);
CREATE INDEX IF NOT EXISTS idx_riwayat_imunisasi_anak_tanggal ON public.riwayat_imunisasi (anak_id, tanggal_done DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_riwayat_imunisasi_anak_nama_unique
  ON public.riwayat_imunisasi (anak_id, nama_vaksin)
  WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_riwayat_imunisasi_deleted_at ON public.riwayat_imunisasi (deleted_at);

CREATE TABLE IF NOT EXISTS public.contents (
  id varchar(36) PRIMARY KEY,
  slug text NOT NULL,
  judul text NOT NULL,
  ringkasan text,
  isi text,
  kategori text,
  phase text,
  tags text,
  gambar_url text,
  read_minutes integer NOT NULL DEFAULT 5,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  deleted_at timestamptz NULL
);

ALTER TABLE public.contents
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS judul text,
  ADD COLUMN IF NOT EXISTS ringkasan text,
  ADD COLUMN IF NOT EXISTS isi text,
  ADD COLUMN IF NOT EXISTS kategori text,
  ADD COLUMN IF NOT EXISTS phase text,
  ADD COLUMN IF NOT EXISTS tags text,
  ADD COLUMN IF NOT EXISTS gambar_url text,
  ADD COLUMN IF NOT EXISTS read_minutes integer DEFAULT 5,
  ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS idx_contents_slug_unique
  ON public.contents (slug)
  WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_contents_kategori ON public.contents (kategori);
CREATE INDEX IF NOT EXISTS idx_contents_phase ON public.contents (phase);
CREATE INDEX IF NOT EXISTS idx_contents_is_published ON public.contents (is_published);
CREATE INDEX IF NOT EXISTS idx_contents_deleted_at ON public.contents (deleted_at);

CREATE TABLE IF NOT EXISTS public.quizzes (
  id varchar(36) PRIMARY KEY,
  judul text NOT NULL,
  deskripsi text,
  kategori text,
  phase text,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  deleted_at timestamptz NULL
);

ALTER TABLE public.quizzes
  ADD COLUMN IF NOT EXISTS judul text,
  ADD COLUMN IF NOT EXISTS deskripsi text,
  ADD COLUMN IF NOT EXISTS kategori text,
  ADD COLUMN IF NOT EXISTS phase text,
  ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_quizzes_kategori ON public.quizzes (kategori);
CREATE INDEX IF NOT EXISTS idx_quizzes_phase ON public.quizzes (phase);
CREATE INDEX IF NOT EXISTS idx_quizzes_is_published ON public.quizzes (is_published);
CREATE INDEX IF NOT EXISTS idx_quizzes_deleted_at ON public.quizzes (deleted_at);

CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id varchar(36) PRIMARY KEY,
  quiz_id varchar(36) NOT NULL,
  teks text NOT NULL,
  pilihan text,
  jawaban_benar text,
  penjelasan text,
  urutan integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  deleted_at timestamptz NULL,
  CONSTRAINT fk_quiz_questions_quiz
    FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id)
    ON UPDATE CASCADE ON DELETE CASCADE
);

ALTER TABLE public.quiz_questions
  ADD COLUMN IF NOT EXISTS quiz_id varchar(36),
  ADD COLUMN IF NOT EXISTS teks text,
  ADD COLUMN IF NOT EXISTS pilihan text,
  ADD COLUMN IF NOT EXISTS jawaban_benar text,
  ADD COLUMN IF NOT EXISTS penjelasan text,
  ADD COLUMN IF NOT EXISTS urutan integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON public.quiz_questions (quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_urutan ON public.quiz_questions (quiz_id, urutan);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_deleted_at ON public.quiz_questions (deleted_at);

CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id varchar(36) PRIMARY KEY,
  pengguna_id varchar(36) NOT NULL,
  quiz_id varchar(36) NOT NULL,
  skor integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_quiz_attempts_pengguna
    FOREIGN KEY (pengguna_id) REFERENCES public.pengguna(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_quiz_attempts_quiz
    FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id)
    ON UPDATE CASCADE ON DELETE CASCADE
);

ALTER TABLE public.quiz_attempts
  ADD COLUMN IF NOT EXISTS pengguna_id varchar(36),
  ADD COLUMN IF NOT EXISTS quiz_id varchar(36),
  ADD COLUMN IF NOT EXISTS skor integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_pengguna_id ON public.quiz_attempts (pengguna_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON public.quiz_attempts (quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_created_at ON public.quiz_attempts (created_at DESC);

CREATE TABLE IF NOT EXISTS public.resep_gizi (
  id bigserial PRIMARY KEY,
  nama text NOT NULL,
  slug text NOT NULL,
  deskripsi text,
  kategori text,
  usia_kategori text,
  durasi_menit integer NOT NULL DEFAULT 0,
  kalori integer NOT NULL DEFAULT 0,
  nutrisi text,
  gambar_url text,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  deleted_at timestamptz NULL
);

ALTER TABLE public.resep_gizi
  ADD COLUMN IF NOT EXISTS nama text,
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS deskripsi text,
  ADD COLUMN IF NOT EXISTS kategori text,
  ADD COLUMN IF NOT EXISTS usia_kategori text,
  ADD COLUMN IF NOT EXISTS durasi_menit integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS kalori integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS nutrisi text,
  ADD COLUMN IF NOT EXISTS gambar_url text,
  ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS idx_resep_gizi_slug_unique
  ON public.resep_gizi (slug)
  WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_resep_gizi_kategori ON public.resep_gizi (kategori);
CREATE INDEX IF NOT EXISTS idx_resep_gizi_usia_kategori ON public.resep_gizi (usia_kategori);
CREATE INDEX IF NOT EXISTS idx_resep_gizi_is_published ON public.resep_gizi (is_published);
CREATE INDEX IF NOT EXISTS idx_resep_gizi_deleted_at ON public.resep_gizi (deleted_at);

-- ============================================================
-- Quiz normalization extension (compatible with current schema)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.quiz_options (
  id bigserial PRIMARY KEY,
  question_id varchar(36) NOT NULL,
  option_key text NOT NULL,
  option_text text NOT NULL,
  is_correct boolean NOT NULL DEFAULT false,
  urutan integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_quiz_options_question
    FOREIGN KEY (question_id) REFERENCES public.quiz_questions(id)
    ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_quiz_options_question_id ON public.quiz_options (question_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_quiz_options_question_key_unique
  ON public.quiz_options (question_id, option_key);
CREATE INDEX IF NOT EXISTS idx_quiz_options_question_urutan
  ON public.quiz_options (question_id, urutan);

CREATE TABLE IF NOT EXISTS public.quiz_attempt_answers (
  id bigserial PRIMARY KEY,
  attempt_id varchar(36) NOT NULL,
  question_id varchar(36) NOT NULL,
  selected_option_key text,
  selected_option_text text,
  is_correct boolean,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_quiz_attempt_answers_attempt
    FOREIGN KEY (attempt_id) REFERENCES public.quiz_attempts(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_quiz_attempt_answers_question
    FOREIGN KEY (question_id) REFERENCES public.quiz_questions(id)
    ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_quiz_attempt_answers_attempt_id
  ON public.quiz_attempt_answers (attempt_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempt_answers_question_id
  ON public.quiz_attempt_answers (question_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_quiz_attempt_answers_attempt_question_unique
  ON public.quiz_attempt_answers (attempt_id, question_id);

-- ============================================================
-- Data quality and compatibility fixes
-- ============================================================
UPDATE public.contents
SET read_minutes = 5
WHERE read_minutes IS NULL OR read_minutes <= 0;

UPDATE public.quizzes
SET is_published = true
WHERE is_published IS NULL;

UPDATE public.resep_gizi
SET is_published = true
WHERE is_published IS NULL;

-- ============================================================
-- updated_at triggers
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_pengguna_set_updated_at') THEN
    CREATE TRIGGER trg_pengguna_set_updated_at
    BEFORE UPDATE ON public.pengguna
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_anak_set_updated_at') THEN
    CREATE TRIGGER trg_anak_set_updated_at
    BEFORE UPDATE ON public.anak
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_master_vaksin_set_updated_at') THEN
    CREATE TRIGGER trg_master_vaksin_set_updated_at
    BEFORE UPDATE ON public.master_vaksin
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_riwayat_imunisasi_set_updated_at') THEN
    CREATE TRIGGER trg_riwayat_imunisasi_set_updated_at
    BEFORE UPDATE ON public.riwayat_imunisasi
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_contents_set_updated_at') THEN
    CREATE TRIGGER trg_contents_set_updated_at
    BEFORE UPDATE ON public.contents
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_quizzes_set_updated_at') THEN
    CREATE TRIGGER trg_quizzes_set_updated_at
    BEFORE UPDATE ON public.quizzes
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_resep_gizi_set_updated_at') THEN
    CREATE TRIGGER trg_resep_gizi_set_updated_at
    BEFORE UPDATE ON public.resep_gizi
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

COMMIT;
