-- Fix fn_normalize_contact_point trigger function to remove value_norm references
-- The value_norm column was dropped in migration 0000000000048, but the trigger
-- function still tries to set it, causing database errors.

CREATE OR REPLACE FUNCTION public.fn_normalize_contact_point() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  -- value_norm column was removed, so this trigger no longer needs to do anything
  -- The trigger is kept for compatibility but does nothing
  -- Phone normalization is now handled via phone_e164 column in the application layer
  return NEW;
end;
$$;
