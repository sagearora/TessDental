-- Rollback for capability enum migration

BEGIN;

-- Drop foreign key
ALTER TABLE IF EXISTS public.role_capability
  DROP CONSTRAINT IF EXISTS role_capability_capability_key_fkey;

-- Restore capability values (replace underscores with dots)
UPDATE public.capability
SET value = replace(value, '_', '.')
WHERE value LIKE '%_%';

-- Restore role_capability references
UPDATE public.role_capability
SET capability_key = replace(capability_key, '_', '.')
WHERE capability_key LIKE '%_%';

-- Rename value back to key
ALTER TABLE IF EXISTS public.capability
  RENAME COLUMN value TO key;

-- Recreate original foreign key
ALTER TABLE IF EXISTS public.role_capability
  ADD CONSTRAINT role_capability_capability_key_fkey
  FOREIGN KEY (capability_key) REFERENCES public.capability(key) ON DELETE RESTRICT;

-- Restore view
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
  AND r.is_active = true;

COMMIT;
