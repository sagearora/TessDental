-- Remove audit.fn_log function
DROP FUNCTION IF EXISTS audit.fn_log(text, text, text, jsonb, boolean);
