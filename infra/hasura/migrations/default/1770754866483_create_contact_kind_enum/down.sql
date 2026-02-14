-- ============================================================================
-- Rollback: Remove contact_kind_enum and restore original structure
-- ============================================================================

-- Restore patient_profile_v view with label
CREATE OR REPLACE VIEW public.patient_profile_v AS
 SELECT p.id AS person_id,
    p.clinic_id,
    p.first_name,
    p.middle_name,
    p.last_name,
    p.preferred_name,
    p.dob,
    p.gender,
    p.preferred_language,
    p.is_active AS person_is_active,
    pat.person_id AS patient_person_id,
    pat.chart_no,
    pat.status AS patient_status,
    pat.family_doctor_name,
    pat.family_doctor_phone,
    pat.imaging_id,
    pat.is_active AS patient_is_active,
    p.responsible_party_id,
    p.household_relationship,
    p.household_head_id,
    COALESCE(rp.id, p.id) AS effective_responsible_party_person_id,
    COALESCE(rp.first_name, p.first_name) AS responsible_party_first_name,
    COALESCE(rp.last_name, p.last_name) AS responsible_party_last_name,
    p.mailing_address_id,
    p.billing_address_id,
    ma.line1 AS mailing_line1,
    ma.line2 AS mailing_line2,
    ma.city AS mailing_city,
    ma.region AS mailing_region,
    ma.postal_code AS mailing_postal_code,
    ma.country AS mailing_country,
    ba.line1 AS billing_line1,
    ba.line2 AS billing_line2,
    ba.city AS billing_city,
    ba.region AS billing_region,
    ba.postal_code AS billing_postal_code,
    ba.country AS billing_country,
    ( SELECT jsonb_agg(jsonb_build_object('kind', person_contact_point.kind, 'label', person_contact_point.label, 'value', person_contact_point.value, 'phone_e164', person_contact_point.phone_e164, 'is_primary', person_contact_point.is_primary) ORDER BY person_contact_point.is_primary DESC, person_contact_point.kind) AS jsonb_agg
           FROM public.person_contact_point
          WHERE ((person_contact_point.person_id = p.id) AND (person_contact_point.is_active = true))) AS contact_points
   FROM ((((public.patient pat
     JOIN public.person p ON ((p.id = pat.person_id)))
     LEFT JOIN public.person rp ON ((rp.id = p.responsible_party_id)))
     LEFT JOIN public.address ma ON ((ma.id = p.mailing_address_id)))
     LEFT JOIN public.address ba ON ((ba.id = p.billing_address_id)));

-- Restore constraints
ALTER TABLE public.person_contact_point
    DROP CONSTRAINT IF EXISTS chk_contact_point_phone_e164_required_for_phone;

ALTER TABLE public.person_contact_point
    DROP CONSTRAINT IF EXISTS chk_contact_point_phone_e164_null_for_email;

ALTER TABLE public.person_contact_point
    ADD CONSTRAINT chk_contact_point_phone_e164_null_for_email CHECK (((kind <> 'email'::text) OR (phone_e164 IS NULL)));

ALTER TABLE public.person_contact_point
    ADD CONSTRAINT chk_contact_point_phone_e164_required_for_phone CHECK (((kind <> 'phone'::text) OR (phone_e164 IS NOT NULL)));

-- Restore phone_last10 generated column
ALTER TABLE public.person_contact_point
    DROP COLUMN IF EXISTS phone_last10;

ALTER TABLE public.person_contact_point
    ADD COLUMN phone_last10 text GENERATED ALWAYS AS (
CASE
    WHEN ((kind = 'phone'::text) AND (value_norm IS NOT NULL) AND (length(value_norm) >= 10)) THEN "right"(value_norm, 10)
    ELSE NULL::text
END) STORED;

-- Restore trigger function
CREATE OR REPLACE FUNCTION public.fn_person_contact_point_set_value_norm() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  v text;
BEGIN
  v := coalesce(NEW.value, '');
  IF NEW.kind = 'email' THEN
    NEW.value_norm := lower(trim(v));
  ELSIF NEW.kind = 'phone' THEN
    -- accepts (519) 240-2222, 5192402222, +1 519 240 2222
    NEW.value_norm := regexp_replace(v, '\D', '', 'g');
  ELSE
    NEW.value_norm := NULL;
  END IF;
  RETURN NEW;
END;
$$;

-- Add label column back
ALTER TABLE public.person_contact_point
    ADD COLUMN label text;

-- Drop foreign key constraint
ALTER TABLE public.person_contact_point
    DROP CONSTRAINT IF EXISTS fk_person_contact_point_kind;

-- Recreate the original CHECK constraint
ALTER TABLE public.person_contact_point
    ADD CONSTRAINT person_contact_point_kind_check CHECK ((kind = ANY (ARRAY['phone'::text, 'email'::text])));

-- Drop enum table
DROP TABLE IF EXISTS public.contact_kind_enum;
