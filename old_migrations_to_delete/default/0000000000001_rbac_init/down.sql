drop function if exists public.fn_effective_capabilities(bigint, uuid);
drop function if exists public.fn_has_capability(bigint, uuid, text);

drop view if exists public.clinic_user_effective_capabilities_v;
drop view if exists public.role_v;
drop view if exists public.clinic_user_v;
drop view if exists public.clinic_v;
drop view if exists public.app_user_v;

drop table if exists public.user_capability_override;
drop type if exists public.override_effect;

drop table if exists public.clinic_user_role;
drop table if exists public.role_capability;
drop table if exists public.role;

drop table if exists public.capability;

drop table if exists public.clinic_user;
drop table if exists public.clinic;

drop table if exists public.app_user;
