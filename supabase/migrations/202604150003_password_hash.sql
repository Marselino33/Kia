-- Migrasi credential pengguna dari pin_hash ke password_hash
ALTER TABLE IF EXISTS public.pengguna ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE IF EXISTS public.pengguna ADD COLUMN IF NOT EXISTS password_hash text;

UPDATE public.pengguna
SET email = 'admin@sejiwa.id'
WHERE role = 'admin' AND (email IS NULL OR btrim(email) = '');

UPDATE public.pengguna
SET email = lower(no_hp)
WHERE (email IS NULL OR btrim(email) = '') AND no_hp IS NOT NULL AND position('@' in no_hp) > 1;

UPDATE public.pengguna
SET email = concat('user_', id, '@placeholder.local')
WHERE email IS NULL OR btrim(email) = '';

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'pengguna'
      AND column_name = 'pin_hash'
  ) THEN
    EXECUTE 'UPDATE public.pengguna SET password_hash = COALESCE(password_hash, pin_hash) WHERE password_hash IS NULL OR btrim(password_hash) = '''''';';
  END IF;
END $$;

ALTER TABLE IF EXISTS public.pengguna
ALTER COLUMN password_hash SET NOT NULL;

ALTER TABLE IF EXISTS public.pengguna
ALTER COLUMN no_hp DROP NOT NULL;

DROP INDEX IF EXISTS public.idx_pengguna_no_hp_unique;
DROP INDEX IF EXISTS public.idx_pengguna_no_hp;
DROP INDEX IF EXISTS public.idx_pengguna_email_unique;
CREATE UNIQUE INDEX idx_pengguna_email_unique ON public.pengguna (lower(email)) WHERE deleted_at IS NULL;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'pengguna'
      AND column_name = 'pin_hash'
  ) THEN
    EXECUTE 'ALTER TABLE public.pengguna DROP COLUMN pin_hash';
  END IF;
END $$;
