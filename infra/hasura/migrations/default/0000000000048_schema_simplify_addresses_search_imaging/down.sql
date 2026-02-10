-- Rollback for schema simplification migration
-- Note: This is a complex rollback. Some data may be lost if person_address was dropped.

BEGIN;

-- Phase 10: Revert person_search rebuild (triggers will handle updates)
-- No rollback needed, triggers will maintain state

-- Phase 9: Drop partial indexes
DROP INDEX IF EXISTS public.imaging_asset_active_study_idx;
DROP INDEX IF EXISTS public.imaging_study_active_patient_idx;
DROP INDEX IF EXISTS public.person_contact_point_active_phone_e164_idx;
DROP INDEX IF EXISTS public.person_contact_point_active_email_idx;
DROP INDEX IF EXISTS public.person_contact_point_active_person_kind_idx;
DROP INDEX IF EXISTS public.person_active_clinic_last_first_idx;

-- Phase 8: Revert citext changes
DO $$
BEGIN
  ALTER TABLE IF EXISTS public.person_contact_point
    DROP CONSTRAINT IF EXISTS chk_contact_point_phone_e164_null_for_email,
    DROP CONSTRAINT IF EXISTS chk_contact_point_phone_e164_only_for_phone;
END $$;

ALTER TABLE IF EXISTS public.person_contact_point
  ADD COLUMN IF NOT EXISTS value_norm text;

ALTER TABLE IF EXISTS public.person_contact_point
  DROP COLUMN IF EXISTS phone_e164;

ALTER TABLE IF EXISTS public.person_contact_point
  ALTER COLUMN value TYPE text USING value::text;

-- Phase 7: Revert search system
DROP INDEX IF EXISTS public.person_search_search_text_trgm_idx;

DROP TRIGGER IF EXISTS person_search_refresh_on_contact_point ON public.person_contact_point;
DROP TRIGGER IF EXISTS person_search_refresh_on_patient ON public.patient;
DROP TRIGGER IF EXISTS person_search_refresh_on_person ON public.person;

DROP FUNCTION IF EXISTS public.trg_person_search_from_contact_point();
DROP FUNCTION IF EXISTS public.trg_person_search_from_patient();
DROP FUNCTION IF EXISTS public.trg_person_search_from_person();
DROP FUNCTION IF EXISTS public.fn_person_search_refresh(bigint);
DROP FUNCTION IF EXISTS public.fn_person_search_build(bigint);

ALTER TABLE IF EXISTS public.person_search
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS last_name text,
  ADD COLUMN IF NOT EXISTS preferred_name text,
  ADD COLUMN IF NOT EXISTS phone_norm text,
  ADD COLUMN IF NOT EXISTS email_norm text,
  DROP COLUMN IF EXISTS display_name;

ALTER TABLE IF EXISTS public.person
  ADD COLUMN IF NOT EXISTS search_name text DEFAULT '' NOT NULL,
  ADD COLUMN IF NOT EXISTS search_email text DEFAULT '' NOT NULL,
  ADD COLUMN IF NOT EXISTS search_phone text DEFAULT '' NOT NULL,
  ADD COLUMN IF NOT EXISTS search_blob text DEFAULT '' NOT NULL;

-- Phase 6: Revert financial simplification
ALTER TABLE IF EXISTS public.patient_financial
  ADD COLUMN IF NOT EXISTS custom_billing_address_id bigint,
  ADD COLUMN IF NOT EXISTS billing_address_source text DEFAULT 'responsible_party' NOT NULL,
  ADD COLUMN IF NOT EXISTS responsible_party_person_id bigint NOT NULL;

-- Phase 5: Revert address refactor
-- Note: Cannot fully restore person_address data, structure only
CREATE TABLE IF NOT EXISTS public.person_address (
  id bigint NOT NULL,
  clinic_id bigint NOT NULL,
  person_id bigint NOT NULL,
  kind text NOT NULL,
  line1 text NOT NULL,
  line2 text,
  city text NOT NULL,
  region text NOT NULL,
  postal_code text NOT NULL,
  country text DEFAULT 'Canada' NOT NULL,
  is_primary boolean DEFAULT true NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  created_by uuid,
  updated_at timestamptz DEFAULT now() NOT NULL,
  updated_by uuid
);

ALTER TABLE IF EXISTS public.person
  DROP COLUMN IF EXISTS billing_address_id,
  DROP COLUMN IF EXISTS mailing_address_id;

DROP TABLE IF EXISTS public.address CASCADE;

-- Phase 4: Revert imaging redundancy removal
ALTER TABLE IF EXISTS public.imaging_asset
  ADD COLUMN IF NOT EXISTS patient_id bigint,
  ADD COLUMN IF NOT EXISTS clinic_id bigint;

-- Phase 3: Revert redundant clinic_id removal
ALTER TABLE IF EXISTS public.patient_referral
  ADD COLUMN IF NOT EXISTS clinic_id bigint;

ALTER TABLE IF EXISTS public.patient_financial
  ADD COLUMN IF NOT EXISTS clinic_id bigint;

ALTER TABLE IF EXISTS public.person_contact_point
  ADD COLUMN IF NOT EXISTS clinic_id bigint;

ALTER TABLE IF EXISTS public.person_address
  ADD COLUMN IF NOT EXISTS clinic_id bigint;

ALTER TABLE IF EXISTS public.patient
  ADD COLUMN IF NOT EXISTS clinic_id bigint;

-- Phase 2: Revert bootstrap_event migration
-- Note: Cannot restore bootstrap_event data from audit.event
CREATE TABLE IF NOT EXISTS public.bootstrap_event (
  id bigint NOT NULL,
  admin_user_id uuid NOT NULL,
  clinic_id bigint NOT NULL,
  clinic_user_id bigint NOT NULL,
  role_id bigint NOT NULL,
  success boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Phase 1: Revert table drops
-- Note: Cannot restore data for dropped tables
CREATE TABLE IF NOT EXISTS public.user_capability_override (
  id bigint NOT NULL,
  user_id uuid NOT NULL,
  capability_key text NOT NULL,
  granted boolean NOT NULL
);

CREATE TABLE IF NOT EXISTS public."user" (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  email text NOT NULL,
  password_hash text NOT NULL,
  role text DEFAULT 'admin' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Phase 0: Extensions remain (no rollback needed)

COMMIT;
