-- Migrate auth identifier from no_hp to email
-- Safe to run multiple times

BEGIN;

ALTER TABLE public.pengguna
  ADD COLUMN IF NOT EXISTS email text;

-- Ensure admin has deterministic email for login after migration.
UPDATE public.pengguna
SET email = 'admin@sejiwa.id'
WHERE role = 'admin'
  AND (email IS NULL OR btrim(email) = '');

-- Backfill from existing no_hp only when it already contains email-like value.
UPDATE public.pengguna
SET email = lower(no_hp)
WHERE (email IS NULL OR btrim(email) = '')
  AND no_hp IS NOT NULL
  AND position('@' in no_hp) > 1;

-- Last-resort backfill for legacy phone-only rows to satisfy NOT NULL.
UPDATE public.pengguna
SET email = concat('user_', id, '@placeholder.local')
WHERE email IS NULL OR btrim(email) = '';

ALTER TABLE public.pengguna
  ALTER COLUMN email SET NOT NULL;

-- no_hp is now optional and no longer used for auth login.
ALTER TABLE public.pengguna
  ALTER COLUMN no_hp DROP NOT NULL;

DROP INDEX IF EXISTS public.idx_pengguna_no_hp_unique;
DROP INDEX IF EXISTS public.idx_pengguna_no_hp;

CREATE UNIQUE INDEX IF NOT EXISTS idx_pengguna_email_unique
  ON public.pengguna (lower(email))
  WHERE deleted_at IS NULL;

COMMIT;
