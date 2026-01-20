-- TessDental V2: audit trail primitives (append-only)

CREATE TABLE IF NOT EXISTS audit_event (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Who did it (nullable for system events)
  actor_user_id      uuid REFERENCES app_user(id),

  -- What changed
  entity_type        text NOT NULL,      -- e.g. "patient", "appointment", "ledger_txn"
  entity_id          uuid NOT NULL,      -- points to the entity record id (uuid standard across tables)
  action             text NOT NULL,      -- e.g. "create", "update", "archive", "restore"

  -- When
  occurred_at        timestamptz NOT NULL DEFAULT now(),

  -- Integrity / defensibility
  reason             text,               -- "correction", "patient request", etc
  before_json        jsonb,              -- store only what you need; can be redacted later
  after_json         jsonb,
  request_id         text,               -- trace across services
  source_ip          inet,               -- optional, useful if remote access later
  user_agent         text                -- Intentionally no updated_at: append-only.
);

CREATE INDEX IF NOT EXISTS idx_audit_event_entity ON audit_event (entity_type, entity_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_event_actor ON audit_event (actor_user_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_event_occurred_at ON audit_event (occurred_at DESC);
