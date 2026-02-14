-- =========================================================
-- Fix remaining old search triggers that reference dropped functions
-- =========================================================

BEGIN;

-- Drop any remaining old triggers that might reference fn_rebuild_person_search_row
DROP TRIGGER IF EXISTS tr_person_rebuild_search ON public.person;
DROP TRIGGER IF EXISTS tr_patient_rebuild_search ON public.patient;
DROP TRIGGER IF EXISTS tr_contact_point_rebuild_search ON public.person_contact_point;
DROP TRIGGER IF EXISTS tr_person_search_refresh_from_person ON public.person;
DROP TRIGGER IF EXISTS tr_person_search_refresh_from_patient ON public.patient;
DROP TRIGGER IF EXISTS tr_person_search_refresh_from_contact_point ON public.person_contact_point;

-- Drop any old trigger functions that might still exist
DROP FUNCTION IF EXISTS public.fn_person_after_change_rebuild_search();
DROP FUNCTION IF EXISTS public.fn_patient_after_change_rebuild_search();
DROP FUNCTION IF EXISTS public.fn_contact_point_after_change_rebuild_search();
DROP FUNCTION IF EXISTS public.fn_person_search_refresh_from_person();
DROP FUNCTION IF EXISTS public.fn_person_search_refresh_from_patient();
DROP FUNCTION IF EXISTS public.fn_person_search_refresh_from_contact_point();

-- Ensure the correct triggers are in place (from migration 0048)
-- These use fn_person_search_refresh which is the correct function
DROP TRIGGER IF EXISTS person_search_refresh_on_person ON public.person;
CREATE TRIGGER person_search_refresh_on_person
AFTER INSERT OR UPDATE OF
  first_name, middle_name, last_name, preferred_name, dob, is_active
ON public.person
FOR EACH ROW EXECUTE FUNCTION public.trg_person_search_from_person();

DROP TRIGGER IF EXISTS person_search_refresh_on_patient ON public.patient;
CREATE TRIGGER person_search_refresh_on_patient
AFTER INSERT OR UPDATE OF
  chart_no, status
ON public.patient
FOR EACH ROW EXECUTE FUNCTION public.trg_person_search_from_patient();

DROP TRIGGER IF EXISTS person_search_refresh_on_contact_point ON public.person_contact_point;
CREATE TRIGGER person_search_refresh_on_contact_point
AFTER INSERT OR UPDATE OR DELETE
ON public.person_contact_point
FOR EACH ROW EXECUTE FUNCTION public.trg_person_search_from_contact_point();

COMMIT;
