-- Remove imaging capabilities
-- Note: This will fail if any roles are using these capabilities
-- You should remove them from roles first

DELETE FROM public.capability 
WHERE key IN ('imaging.read', 'imaging.write');
