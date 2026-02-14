-- Rollback for fix remaining old search triggers
-- Note: This just ensures correct triggers are in place, no data changes

BEGIN;

-- The triggers we created are the correct ones, so rollback is a no-op
-- If you need to rollback, you would need to restore the old functions first

COMMIT;
