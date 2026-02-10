-- =========================================================
-- Migrate capability table to use 'value' as primary key
-- Hasura enum tables require the primary key to be named 'value'
-- =========================================================

BEGIN;

-- =========================================================
-- 1) Drop foreign key constraint that references capability.key
-- =========================================================
ALTER TABLE IF EXISTS public.role_capability
  DROP CONSTRAINT IF EXISTS role_capability_capability_key_fkey;

ALTER TABLE IF EXISTS public.role_capability
  DROP CONSTRAINT IF EXISTS role_capability_capability_key_v_fkey;

-- =========================================================
-- 2) Rename capability.key to capability.value
-- =========================================================
ALTER TABLE IF EXISTS public.capability
  RENAME COLUMN key TO value;

-- =========================================================
-- 2.5) Update capability values to be valid GraphQL enum names
-- Replace dots with underscores (e.g., "audit.export" -> "audit_export")
-- =========================================================
UPDATE public.capability
SET value = replace(value, '.', '_')
WHERE value LIKE '%.%';

-- Update role_capability references to match
UPDATE public.role_capability
SET capability_key = replace(capability_key, '.', '_')
WHERE capability_key LIKE '%.%';

-- =========================================================
-- 3) Recreate foreign key constraint using 'value'
-- =========================================================
ALTER TABLE IF EXISTS public.role_capability
  ADD CONSTRAINT role_capability_capability_key_fkey
  FOREIGN KEY (capability_key) REFERENCES public.capability(value) ON DELETE RESTRICT;

-- =========================================================
-- 4) Update any functions/views that reference capability.key
-- =========================================================

-- Update clinic_user_effective_capabilities_v if it references c.key
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
  ON c.value = rc.capability_key
WHERE
  cu.is_active = true
  AND r.is_active = true;

COMMIT;
