-- Disable immunization module tables (master_vaksin, riwayat_imunisasi)
-- Apply this after baseline migration when immunization feature is no longer used.

BEGIN;

-- Drop dependent tables first
DROP TABLE IF EXISTS public.riwayat_imunisasi CASCADE;
DROP TABLE IF EXISTS public.master_vaksin CASCADE;

COMMIT;
