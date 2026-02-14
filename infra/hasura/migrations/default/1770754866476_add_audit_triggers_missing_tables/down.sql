-- Remove audit triggers for tables

DROP TRIGGER IF EXISTS tr_audit_row_change ON public.clinic;
DROP TRIGGER IF EXISTS tr_audit_row_change ON public.role;
DROP TRIGGER IF EXISTS tr_audit_row_change ON public.role_capability;
DROP TRIGGER IF EXISTS tr_audit_row_change ON public.clinic_user_role;
