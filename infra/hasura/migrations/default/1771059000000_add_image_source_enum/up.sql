-- Create image_source_enum type
CREATE TYPE public.image_source_enum AS ENUM (
  'intraoral',
  'panoramic',
  'webcam',
  'scanner',
  'photo'
);

COMMENT ON TYPE public.image_source_enum IS 'Source of the imaging capture device';
