-- Create imaging_mount_slot table (junction table)
CREATE TABLE public.imaging_mount_slot (
  id bigserial PRIMARY KEY,
  mount_id bigint NOT NULL REFERENCES public.imaging_mount(id) ON DELETE CASCADE,
  asset_id bigint NOT NULL REFERENCES public.imaging_asset(id) ON DELETE SET NULL,
  slot_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid,
  is_active boolean NOT NULL DEFAULT true
);

COMMENT ON TABLE public.imaging_mount_slot IS 'Junction table linking imaging assets to mount slots';
COMMENT ON COLUMN public.imaging_mount_slot.slot_id IS 'Slot identifier from the mount template (e.g., "slot_1", "fms_ur1")';
COMMENT ON COLUMN public.imaging_mount_slot.asset_id IS 'Reference to the imaging asset assigned to this slot';

-- Create unique constraint: one asset per slot per mount (when active)
CREATE UNIQUE INDEX idx_imaging_mount_slot_unique 
  ON public.imaging_mount_slot(mount_id, slot_id) 
  WHERE is_active = true;

-- Create indexes
CREATE INDEX idx_imaging_mount_slot_mount ON public.imaging_mount_slot(mount_id);
CREATE INDEX idx_imaging_mount_slot_asset ON public.imaging_mount_slot(asset_id);

-- Apply audit stamp trigger
CREATE TRIGGER trg_imaging_mount_slot_audit_stamp
  BEFORE INSERT OR UPDATE ON public.imaging_mount_slot
  FOR EACH ROW
  EXECUTE FUNCTION audit.fn_stamp_audit_columns();

-- Apply audit event trigger
CREATE TRIGGER trg_imaging_mount_slot_audit_event
  AFTER INSERT OR UPDATE OR DELETE ON public.imaging_mount_slot
  FOR EACH ROW
  EXECUTE FUNCTION audit.fn_row_change_to_event();
