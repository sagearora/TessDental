-- Rollback for enum table simplification
-- Note: This rollback recreates columns but cannot restore the original data

BEGIN;

-- Restore capability columns
ALTER TABLE IF EXISTS public.capability
  RENAME COLUMN comment TO description;

ALTER TABLE IF EXISTS public.capability
  ADD COLUMN IF NOT EXISTS module text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS is_deprecated boolean DEFAULT false NOT NULL,
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now() NOT NULL;

-- Restore referral_kind_enum columns
ALTER TABLE IF EXISTS public.referral_kind_enum
  RENAME COLUMN comment TO display_name;

ALTER TABLE IF EXISTS public.referral_kind_enum
  ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true NOT NULL,
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now() NOT NULL;

-- Restore patient_status_enum columns
ALTER TABLE IF EXISTS public.patient_status_enum
  RENAME COLUMN comment TO display_name;

ALTER TABLE IF EXISTS public.patient_status_enum
  ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true NOT NULL,
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now() NOT NULL,
  ADD COLUMN IF NOT EXISTS created_by uuid,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now() NOT NULL,
  ADD COLUMN IF NOT EXISTS updated_by uuid;

-- Restore gender_enum columns
ALTER TABLE IF EXISTS public.gender_enum
  RENAME COLUMN comment TO display_name;

ALTER TABLE IF EXISTS public.gender_enum
  ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true NOT NULL,
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now() NOT NULL;

COMMIT;
