-- Add audit triggers for tables that were missing them
-- This ensures all important tables have audit logging enabled

-- Add audit trigger for clinic table
CREATE TRIGGER tr_audit_row_change 
  AFTER INSERT OR DELETE OR UPDATE ON public.clinic 
  FOR EACH ROW 
  EXECUTE FUNCTION audit.fn_row_change_to_event();

-- Add audit trigger for role table
CREATE TRIGGER tr_audit_row_change 
  AFTER INSERT OR DELETE OR UPDATE ON public.role 
  FOR EACH ROW 
  EXECUTE FUNCTION audit.fn_row_change_to_event();

-- Add audit trigger for role_capability table
CREATE TRIGGER tr_audit_row_change 
  AFTER INSERT OR DELETE OR UPDATE ON public.role_capability 
  FOR EACH ROW 
  EXECUTE FUNCTION audit.fn_row_change_to_event();

-- Add audit trigger for clinic_user_role table
CREATE TRIGGER tr_audit_row_change 
  AFTER INSERT OR DELETE OR UPDATE ON public.clinic_user_role 
  FOR EACH ROW 
  EXECUTE FUNCTION audit.fn_row_change_to_event();
