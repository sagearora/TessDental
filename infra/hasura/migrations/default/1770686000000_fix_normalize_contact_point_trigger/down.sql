-- Rollback: Restore the original fn_normalize_contact_point function
-- Note: This assumes value_norm column exists (which it won't if migration 0000000000048 was applied)
-- This down migration is provided for completeness but may not work if value_norm doesn't exist

CREATE OR REPLACE FUNCTION public.fn_normalize_contact_point() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  if NEW.kind = 'phone' then
    NEW.value_norm := regexp_replace(coalesce(NEW.value,''), '\D', '', 'g');
    if length(NEW.value_norm) = 11 and left(NEW.value_norm,1) = '1' then
      NEW.value_norm := substr(NEW.value_norm,2);
    end if;
  elsif NEW.kind = 'email' then
    NEW.value_norm := lower(trim(coalesce(NEW.value,'')));
  else
    NEW.value_norm := null;
  end if;
  return NEW;
end;
$$;
