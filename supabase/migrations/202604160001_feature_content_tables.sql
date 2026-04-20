-- Separate content tables per feature, with admin_id relation to pengguna
ALTER TABLE IF EXISTS public.contents ADD COLUMN IF NOT EXISTS admin_id varchar(36);
ALTER TABLE IF EXISTS public.contents ALTER COLUMN admin_id DROP NOT NULL;

CREATE TABLE IF NOT EXISTS public.stimulus_anak (
  id varchar(36) PRIMARY KEY,
  admin_id varchar(36) REFERENCES public.pengguna(id) ON DELETE RESTRICT,
  slug text NOT NULL UNIQUE,
  judul text NOT NULL,
  ringkasan text,
  isi text,
  kategori text,
  phase text,
  tags text,
  gambar_url text,
  read_minutes integer DEFAULT 5,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.phbs (
  id varchar(36) PRIMARY KEY,
  admin_id varchar(36) REFERENCES public.pengguna(id) ON DELETE RESTRICT,
  slug text NOT NULL UNIQUE,
  judul text NOT NULL,
  ringkasan text,
  isi text,
  kategori text,
  phase text,
  tags text,
  gambar_url text,
  read_minutes integer DEFAULT 5,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.gizi_ibu (
  id varchar(36) PRIMARY KEY,
  admin_id varchar(36) REFERENCES public.pengguna(id) ON DELETE RESTRICT,
  slug text NOT NULL UNIQUE,
  judul text NOT NULL,
  ringkasan text,
  isi text,
  kategori text,
  phase text,
  tags text,
  gambar_url text,
  read_minutes integer DEFAULT 5,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.gizi_anak (
  id varchar(36) PRIMARY KEY,
  admin_id varchar(36) REFERENCES public.pengguna(id) ON DELETE RESTRICT,
  slug text NOT NULL UNIQUE,
  judul text NOT NULL,
  ringkasan text,
  isi text,
  kategori text,
  phase text,
  tags text,
  gambar_url text,
  read_minutes integer DEFAULT 5,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.mpasi (
  id varchar(36) PRIMARY KEY,
  admin_id varchar(36) REFERENCES public.pengguna(id) ON DELETE RESTRICT,
  slug text NOT NULL UNIQUE,
  judul text NOT NULL,
  ringkasan text,
  isi text,
  kategori text,
  phase text,
  tags text,
  gambar_url text,
  read_minutes integer DEFAULT 5,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.informasi_umum (
  id varchar(36) PRIMARY KEY,
  admin_id varchar(36) REFERENCES public.pengguna(id) ON DELETE RESTRICT,
  slug text NOT NULL UNIQUE,
  judul text NOT NULL,
  ringkasan text,
  isi text,
  kategori text,
  phase text,
  tags text,
  gambar_url text,
  read_minutes integer DEFAULT 5,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.mental_orang_tua (
  id varchar(36) PRIMARY KEY,
  admin_id varchar(36) REFERENCES public.pengguna(id) ON DELETE RESTRICT,
  slug text NOT NULL UNIQUE,
  judul text NOT NULL,
  ringkasan text,
  isi text,
  kategori text,
  phase text,
  tags text,
  gambar_url text,
  read_minutes integer DEFAULT 5,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

DO $$
DECLARE
  v_admin_id varchar(36);
BEGIN
  SELECT id INTO v_admin_id
  FROM public.pengguna
  WHERE role = 'admin'
  ORDER BY created_at ASC
  LIMIT 1;

  IF v_admin_id IS NULL THEN
    RETURN;
  END IF;

  INSERT INTO public.stimulus_anak (id, admin_id, slug, judul, ringkasan, isi, kategori, phase, tags, gambar_url, read_minutes, is_published, created_at, updated_at, deleted_at)
  SELECT id, v_admin_id, slug, judul, ringkasan, isi, kategori, phase, tags, gambar_url, COALESCE(read_minutes, 5), COALESCE(is_published, true), created_at, updated_at, deleted_at
  FROM public.contents
  WHERE LOWER(kategori) = 'parenting'
  ON CONFLICT (slug) DO NOTHING;

  INSERT INTO public.phbs (id, admin_id, slug, judul, ringkasan, isi, kategori, phase, tags, gambar_url, read_minutes, is_published, created_at, updated_at, deleted_at)
  SELECT id, v_admin_id, slug, judul, ringkasan, isi, kategori, phase, tags, gambar_url, COALESCE(read_minutes, 5), COALESCE(is_published, true), created_at, updated_at, deleted_at
  FROM public.contents
  WHERE LOWER(kategori) = 'phbs'
  ON CONFLICT (slug) DO NOTHING;

  INSERT INTO public.gizi_ibu (id, admin_id, slug, judul, ringkasan, isi, kategori, phase, tags, gambar_url, read_minutes, is_published, created_at, updated_at, deleted_at)
  SELECT id, v_admin_id, slug, judul, ringkasan, isi, kategori, phase, tags, gambar_url, COALESCE(read_minutes, 5), COALESCE(is_published, true), created_at, updated_at, deleted_at
  FROM public.contents
  WHERE LOWER(kategori) = 'gizi ibu'
  ON CONFLICT (slug) DO NOTHING;

  INSERT INTO public.gizi_anak (id, admin_id, slug, judul, ringkasan, isi, kategori, phase, tags, gambar_url, read_minutes, is_published, created_at, updated_at, deleted_at)
  SELECT id, v_admin_id, slug, judul, ringkasan, isi, kategori, phase, tags, gambar_url, COALESCE(read_minutes, 5), COALESCE(is_published, true), created_at, updated_at, deleted_at
  FROM public.contents
  WHERE LOWER(kategori) = 'gizi anak'
  ON CONFLICT (slug) DO NOTHING;

  INSERT INTO public.mpasi (id, admin_id, slug, judul, ringkasan, isi, kategori, phase, tags, gambar_url, read_minutes, is_published, created_at, updated_at, deleted_at)
  SELECT id, v_admin_id, slug, judul, ringkasan, isi, kategori, phase, tags, gambar_url, COALESCE(read_minutes, 5), COALESCE(is_published, true), created_at, updated_at, deleted_at
  FROM public.contents
  WHERE LOWER(kategori) = 'mpasi'
  ON CONFLICT (slug) DO NOTHING;

  INSERT INTO public.informasi_umum (id, admin_id, slug, judul, ringkasan, isi, kategori, phase, tags, gambar_url, read_minutes, is_published, created_at, updated_at, deleted_at)
  SELECT id, v_admin_id, slug, judul, ringkasan, isi, kategori, phase, tags, gambar_url, COALESCE(read_minutes, 5), COALESCE(is_published, true), created_at, updated_at, deleted_at
  FROM public.contents
  WHERE LOWER(kategori) = 'umum'
  ON CONFLICT (slug) DO NOTHING;

  INSERT INTO public.mental_orang_tua (id, admin_id, slug, judul, ringkasan, isi, kategori, phase, tags, gambar_url, read_minutes, is_published, created_at, updated_at, deleted_at)
  SELECT id, v_admin_id, slug, judul, ringkasan, isi, kategori, phase, tags, gambar_url, COALESCE(read_minutes, 5), COALESCE(is_published, true), created_at, updated_at, deleted_at
  FROM public.contents
  WHERE LOWER(kategori) = 'mental orang tua'
  ON CONFLICT (slug) DO NOTHING;
END $$;
