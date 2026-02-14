-- =========================================================
-- Post-migration cleanup: remove invalid functions/triggers
-- and recreate views/functions to use new schema structure
-- =========================================================

BEGIN;

-- =========================================================
-- 1) DROP invalid clinic match trigger/function (patient has no clinic_id now)
-- =========================================================
DROP TRIGGER IF EXISTS tr_ensure_patient_clinic_match ON public.patient;
DROP FUNCTION IF EXISTS public.fn_ensure_patient_clinic_match();

-- =========================================================
-- 2) REMOVE old search rebuild pipeline (it references dropped person.search_* columns)
-- =========================================================
DROP TRIGGER IF EXISTS tr_patient_rebuild_search ON public.patient;
DROP FUNCTION IF EXISTS public.fn_patient_after_change_rebuild_search();
DROP FUNCTION IF EXISTS public.fn_rebuild_person_search_row(bigint);

DROP TRIGGER IF EXISTS tr_person_search_refresh_from_patient ON public.patient;
DROP TRIGGER IF EXISTS tr_person_search_refresh_from_contact_point ON public.person_contact_point;
DROP TRIGGER IF EXISTS tr_person_rebuild_search ON public.person;

DROP FUNCTION IF EXISTS public.fn_person_search_refresh_from_patient();
DROP FUNCTION IF EXISTS public.fn_person_search_refresh_from_contact_point();
DROP FUNCTION IF EXISTS public.fn_person_after_change_rebuild_search();

-- =========================================================
-- 3) REPLACE fn_search_people to use person_search (single deterministic system)
-- Keeps the SAME return signature currently in schema to minimize Hasura churn:
--   RETURNS TABLE(person_id, clinic_id, display_name, matched_on, rank_score)
-- =========================================================
CREATE OR REPLACE FUNCTION public.fn_search_people(
  p_clinic_id bigint,
  p_query text,
  p_limit integer DEFAULT 15,
  p_include_inactive boolean DEFAULT false
)
RETURNS TABLE(
  person_id bigint,
  clinic_id bigint,
  display_name text,
  matched_on text,
  rank_score double precision
)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  q text := trim(coalesce(p_query, ''));
  q_phone text;
BEGIN
  IF q = '' THEN
    RETURN;
  END IF;

  -- Extract digits for phone matching
  q_phone := regexp_replace(q, '\D', '', 'g');

  RETURN QUERY
  WITH base AS (
    SELECT
      ps.person_id,
      ps.clinic_id,
      ps.display_name,
      ps.search_text,
      ps.is_active
    FROM public.person_search ps
    WHERE ps.clinic_id = p_clinic_id
      AND (p_include_inactive OR ps.is_active = true)
  ),
  scored AS (
    SELECT
      b.person_id,
      b.clinic_id,
      b.display_name,
      CASE
        WHEN q_phone <> '' AND length(q_phone) >= 7 AND b.search_text LIKE '%' || q_phone || '%' THEN 'phone'
        WHEN b.search_text ILIKE '%' || lower(q) || '%' THEN 'contains'
        WHEN b.search_text % lower(q) THEN 'trgm'
        ELSE 'other'
      END AS matched_on,
      CASE
        WHEN q_phone <> '' AND length(q_phone) >= 7 AND b.search_text LIKE '%' || q_phone || '%' THEN 1.2
        ELSE similarity(b.search_text, lower(q))
      END AS rank_score
    FROM base b
    WHERE
      (q_phone <> '' AND length(q_phone) >= 7 AND b.search_text LIKE '%' || q_phone || '%')
      OR b.search_text ILIKE '%' || lower(q) || '%'
      OR b.search_text % lower(q)
  )
  SELECT
    s.person_id,
    s.clinic_id,
    s.display_name,
    s.matched_on,
    s.rank_score
  FROM scored s
  ORDER BY s.rank_score DESC, s.display_name ASC
  LIMIT greatest(1, least(p_limit, 50));

END;
$$;

-- =========================================================
-- 4) RECREATE clinic_user_effective_capabilities_v
-- Needed because fn_effective_capabilities references it.
-- Uses role-based capabilities only (no overrides since user_capability_override was dropped).
-- =========================================================
CREATE OR REPLACE VIEW public.clinic_user_effective_capabilities_v AS
SELECT
  cu.clinic_id,
  cu.user_id,
  rc.capability_key
FROM public.clinic_user cu
JOIN public.clinic_user_role cur
  ON cur.clinic_user_id = cu.id
JOIN public.role r
  ON r.id = cur.role_id
JOIN public.role_capability rc
  ON rc.role_id = r.id
JOIN public.capability c
  ON c.key = rc.capability_key
WHERE
  cu.is_active = true
  AND r.is_active = true
  AND c.is_deprecated = false;

-- =========================================================
-- 5) Recreate patient_profile_v with new address structure
-- =========================================================
CREATE OR REPLACE VIEW public.patient_profile_v AS
SELECT
  -- Person info
  p.id AS person_id,
  p.clinic_id,
  p.first_name,
  p.middle_name,
  p.last_name,
  p.preferred_name,
  p.dob,
  p.gender,
  p.preferred_language,
  p.is_active AS person_is_active,

  -- Patient extension
  pat.person_id AS patient_person_id,
  pat.chart_no,
  pat.status AS patient_status,
  pat.family_doctor_name,
  pat.family_doctor_phone,
  pat.imaging_id,
  pat.is_active AS patient_is_active,

  -- Responsible party info
  p.responsible_party_id,
  p.household_relationship,
  p.household_head_id,
  
  -- Responsible party person details (family root)
  COALESCE(rp.id, p.id) AS effective_responsible_party_person_id,
  COALESCE(rp.first_name, p.first_name) AS responsible_party_first_name,
  COALESCE(rp.last_name, p.last_name) AS responsible_party_last_name,
  
  -- Addresses (new structure)
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

  -- Primary contact points (aggregated)
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'kind', kind,
        'label', label,
        'value', value,
        'phone_e164', phone_e164,
        'is_primary', is_primary
      ) ORDER BY is_primary DESC, kind
    )
    FROM public.person_contact_point
    WHERE person_id = p.id AND is_active = true
  ) AS contact_points

FROM public.patient pat
JOIN public.person p ON p.id = pat.person_id
LEFT JOIN public.person rp ON rp.id = p.responsible_party_id
LEFT JOIN public.address ma ON ma.id = p.mailing_address_id
LEFT JOIN public.address ba ON ba.id = p.billing_address_id;

COMMIT;
