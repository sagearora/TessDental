-- Drop imaging_mount table and triggers
DROP TRIGGER IF EXISTS trg_imaging_mount_audit_event ON public.imaging_mount;
DROP TRIGGER IF EXISTS trg_imaging_mount_audit_stamp ON public.imaging_mount;
DROP TABLE IF EXISTS public.imaging_mount CASCADE;
