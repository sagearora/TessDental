-- Add audit.export capability
insert into public.capability (key, description, module, is_deprecated)
values
  ('audit.export', 'Export audit logs (CSV/JSONL)', 'audit', false)
on conflict (key) do update
set
  description = excluded.description,
  module = excluded.module,
  is_deprecated = excluded.is_deprecated;
