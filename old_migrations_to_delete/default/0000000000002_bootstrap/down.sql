drop function if exists public.fn_bootstrap_system(text, text, text, text, text, text);
drop function if exists public.fn_is_bootstrapped();
drop index if exists public.bootstrap_event_singleton;
drop table if exists public.bootstrap_event;
