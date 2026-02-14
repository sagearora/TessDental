-- Remove audit.export capability
delete from public.capability where key = 'audit.export';
