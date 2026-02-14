-- =========================================================
-- Simplify enum tables to meet Hasura requirements
-- Hasura requires enum tables to have exactly:
-- 1. One primary key column (text type) - named 'value' or 'key'
-- 2. Optionally one comment/description column (text type)
-- 3. No other columns
-- =========================================================

BEGIN;

-- =========================================================
-- 1) Drop the _v tables and their triggers (if they exist)
-- =========================================================
DROP TRIGGER IF EXISTS tr_sync_capability_enum_v ON public.capability;
DROP TRIGGER IF EXISTS tr_sync_referral_kind_enum_v ON public.referral_kind_enum;
DROP TRIGGER IF EXISTS tr_sync_patient_status_enum_v ON public.patient_status_enum;
DROP TRIGGER IF EXISTS tr_sync_gender_enum_v ON public.gender_enum;

DROP FUNCTION IF EXISTS public.sync_capability_enum_v();
DROP FUNCTION IF EXISTS public.sync_referral_kind_enum_v();
DROP FUNCTION IF EXISTS public.sync_patient_status_enum_v();
DROP FUNCTION IF EXISTS public.sync_gender_enum_v();

DROP TABLE IF EXISTS public.capability_enum_v CASCADE;
DROP TABLE IF EXISTS public.referral_kind_enum_v CASCADE;
DROP TABLE IF EXISTS public.patient_status_enum_v CASCADE;
DROP TABLE IF EXISTS public.gender_enum_v CASCADE;

-- =========================================================
-- 2) Restore foreign keys to original enum tables (if they were changed)
-- =========================================================
-- Drop _v foreign keys if they exist
ALTER TABLE IF EXISTS public.role_capability
  DROP CONSTRAINT IF EXISTS role_capability_capability_key_v_fkey;

ALTER TABLE IF EXISTS public.patient_referral
  DROP CONSTRAINT IF EXISTS patient_referral_referral_kind_v_fkey;

ALTER TABLE IF EXISTS public.patient
  DROP CONSTRAINT IF EXISTS fk_patient_status_v;

ALTER TABLE IF EXISTS public.person
  DROP CONSTRAINT IF EXISTS fk_person_gender_v;

-- Ensure original foreign keys exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_schema='public' AND table_name='person'
      AND constraint_name='fk_person_gender'
  ) THEN
    ALTER TABLE public.person
      ADD CONSTRAINT fk_person_gender
      FOREIGN KEY (gender) REFERENCES public.gender_enum(value);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_schema='public' AND table_name='patient'
      AND constraint_name='fk_patient_status'
  ) THEN
    ALTER TABLE public.patient
      ADD CONSTRAINT fk_patient_status
      FOREIGN KEY (status) REFERENCES public.patient_status_enum(value);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_schema='public' AND table_name='patient_referral'
      AND constraint_name='patient_referral_referral_kind_fkey'
  ) THEN
    ALTER TABLE public.patient_referral
      ADD CONSTRAINT patient_referral_referral_kind_fkey
      FOREIGN KEY (referral_kind) REFERENCES public.referral_kind_enum(value);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_schema='public' AND table_name='role_capability'
      AND constraint_name='role_capability_capability_key_fkey'
  ) THEN
    ALTER TABLE public.role_capability
      ADD CONSTRAINT role_capability_capability_key_fkey
      FOREIGN KEY (capability_key) REFERENCES public.capability(key) ON DELETE RESTRICT;
  END IF;
END $$;

-- =========================================================
-- 3) Simplify enum tables - remove extra columns, keep only value/key and comment
-- =========================================================

-- Simplify gender_enum: keep value and display_name (as comment), drop others
ALTER TABLE IF EXISTS public.gender_enum
  DROP COLUMN IF EXISTS display_order,
  DROP COLUMN IF EXISTS is_active,
  DROP COLUMN IF EXISTS created_at;

-- Rename display_name to comment for Hasura convention
ALTER TABLE IF EXISTS public.gender_enum
  RENAME COLUMN display_name TO comment;

-- Simplify patient_status_enum: keep value and display_name (as comment), drop others
ALTER TABLE IF EXISTS public.patient_status_enum
  DROP COLUMN IF EXISTS display_order,
  DROP COLUMN IF EXISTS is_active,
  DROP COLUMN IF EXISTS created_at,
  DROP COLUMN IF EXISTS created_by,
  DROP COLUMN IF EXISTS updated_at,
  DROP COLUMN IF EXISTS updated_by;

-- Rename display_name to comment for Hasura convention
ALTER TABLE IF EXISTS public.patient_status_enum
  RENAME COLUMN display_name TO comment;

-- Simplify referral_kind_enum: keep value and display_name (as comment), drop others
ALTER TABLE IF EXISTS public.referral_kind_enum
  DROP COLUMN IF EXISTS display_order,
  DROP COLUMN IF EXISTS is_active,
  DROP COLUMN IF EXISTS created_at;

-- Rename display_name to comment for Hasura convention
ALTER TABLE IF EXISTS public.referral_kind_enum
  RENAME COLUMN display_name TO comment;

-- Simplify capability: keep key and description (as comment), drop others
ALTER TABLE IF EXISTS public.capability
  DROP COLUMN IF EXISTS module,
  DROP COLUMN IF EXISTS is_deprecated,
  DROP COLUMN IF EXISTS created_at;

-- Rename description to comment for Hasura convention
ALTER TABLE IF EXISTS public.capability
  RENAME COLUMN description TO comment;

COMMIT;
