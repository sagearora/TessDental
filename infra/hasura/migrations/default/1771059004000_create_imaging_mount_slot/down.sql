-- Drop imaging_mount_slot table and triggers
DROP TRIGGER IF EXISTS trg_imaging_mount_slot_audit_event ON public.imaging_mount_slot;
DROP TRIGGER IF EXISTS trg_imaging_mount_slot_audit_stamp ON public.imaging_mount_slot;
DROP TABLE IF EXISTS public.imaging_mount_slot CASCADE;
