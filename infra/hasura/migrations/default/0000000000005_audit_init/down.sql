drop function if exists audit.fn_log(text, text, text, jsonb, boolean);
drop table if exists audit.event;
drop function if exists audit.fn_ctx_bigint(text);
drop function if exists audit.fn_ctx_uuid(text);
drop function if exists audit.fn_ctx_text(text);
drop schema if exists audit;
