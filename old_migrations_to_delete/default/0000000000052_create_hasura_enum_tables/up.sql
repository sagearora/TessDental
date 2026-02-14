-- =========================================================
-- Create simplified enum tables for Hasura enum support
-- Hasura requires enum tables to have exactly:
-- 1. One primary key column (text type)
-- 2. Optionally one comment/description column (text type)
-- 3. No other columns
-- =========================================================

BEGIN;

-- =========================================================
-- 1) Create simplified enum tables with only value and comment
-- =========================================================

-- Gender enum (simplified)
CREATE TABLE IF NOT EXISTS public.gender_enum_v (
  value text PRIMARY KEY,
  comment text
);

-- Patient status enum (simplified)
CREATE TABLE IF NOT EXISTS public.patient_status_enum_v (
  value text PRIMARY KEY,
  comment text
);

-- Referral kind enum (simplified)
CREATE TABLE IF NOT EXISTS public.referral_kind_enum_v (
  value text PRIMARY KEY,
  comment text
);

-- Capability enum (simplified) - note: uses 'key' as primary key name
CREATE TABLE IF NOT EXISTS public.capability_enum_v (
  key text PRIMARY KEY,
  comment text
);

-- =========================================================
-- 2) Populate simplified enum tables from full enum tables
-- =========================================================

-- Populate gender_enum_v
INSERT INTO public.gender_enum_v (value, comment)
SELECT value, display_name
FROM public.gender_enum
WHERE is_active = true
ON CONFLICT (value) DO NOTHING;

-- Populate patient_status_enum_v
INSERT INTO public.patient_status_enum_v (value, comment)
SELECT value, display_name
FROM public.patient_status_enum
WHERE is_active = true
ON CONFLICT (value) DO NOTHING;

-- Populate referral_kind_enum_v
INSERT INTO public.referral_kind_enum_v (value, comment)
SELECT value, display_name
FROM public.referral_kind_enum
WHERE is_active = true
ON CONFLICT (value) DO NOTHING;

-- Populate capability_enum_v
INSERT INTO public.capability_enum_v (key, comment)
SELECT key, description
FROM public.capability
WHERE is_deprecated = false
ON CONFLICT (key) DO NOTHING;

-- =========================================================
-- 3) Create triggers to keep simplified enum tables in sync
-- =========================================================

-- Trigger function to sync gender_enum_v
CREATE OR REPLACE FUNCTION public.sync_gender_enum_v()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    IF NEW.is_active = true THEN
      INSERT INTO public.gender_enum_v (value, comment)
      VALUES (NEW.value, NEW.display_name)
      ON CONFLICT (value) DO UPDATE SET comment = EXCLUDED.comment;
    ELSE
      DELETE FROM public.gender_enum_v WHERE value = NEW.value;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM public.gender_enum_v WHERE value = OLD.value;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_sync_gender_enum_v
AFTER INSERT OR UPDATE OR DELETE ON public.gender_enum
FOR EACH ROW EXECUTE FUNCTION public.sync_gender_enum_v();

-- Trigger function to sync patient_status_enum_v
CREATE OR REPLACE FUNCTION public.sync_patient_status_enum_v()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    IF NEW.is_active = true THEN
      INSERT INTO public.patient_status_enum_v (value, comment)
      VALUES (NEW.value, NEW.display_name)
      ON CONFLICT (value) DO UPDATE SET comment = EXCLUDED.comment;
    ELSE
      DELETE FROM public.patient_status_enum_v WHERE value = NEW.value;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM public.patient_status_enum_v WHERE value = OLD.value;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_sync_patient_status_enum_v
AFTER INSERT OR UPDATE OR DELETE ON public.patient_status_enum
FOR EACH ROW EXECUTE FUNCTION public.sync_patient_status_enum_v();

-- Trigger function to sync referral_kind_enum_v
CREATE OR REPLACE FUNCTION public.sync_referral_kind_enum_v()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    IF NEW.is_active = true THEN
      INSERT INTO public.referral_kind_enum_v (value, comment)
      VALUES (NEW.value, NEW.display_name)
      ON CONFLICT (value) DO UPDATE SET comment = EXCLUDED.comment;
    ELSE
      DELETE FROM public.referral_kind_enum_v WHERE value = NEW.value;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM public.referral_kind_enum_v WHERE value = OLD.value;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_sync_referral_kind_enum_v
AFTER INSERT OR UPDATE OR DELETE ON public.referral_kind_enum
FOR EACH ROW EXECUTE FUNCTION public.sync_referral_kind_enum_v();

-- Trigger function to sync capability_enum_v
CREATE OR REPLACE FUNCTION public.sync_capability_enum_v()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    IF NEW.is_deprecated = false THEN
      INSERT INTO public.capability_enum_v (key, comment)
      VALUES (NEW.key, NEW.description)
      ON CONFLICT (key) DO UPDATE SET comment = EXCLUDED.comment;
    ELSE
      DELETE FROM public.capability_enum_v WHERE key = NEW.key;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM public.capability_enum_v WHERE key = OLD.key;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_sync_capability_enum_v
AFTER INSERT OR UPDATE OR DELETE ON public.capability
FOR EACH ROW EXECUTE FUNCTION public.sync_capability_enum_v();

COMMIT;
