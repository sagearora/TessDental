# TessDental Migration Policy (Required)

TessDental uses **Flyway** as the source of truth for all database schema changes.

## Non-negotiable rules
- All schema changes must be delivered as Flyway SQL migrations under `infra/flyway/sql`.
- Never modify an existing `V*` migration after it has shipped.
- Use **Expand → Migrate → Contract**:
  - Expand: add nullable columns/tables/indexes (backward compatible)
  - Migrate: backfill data via background jobs (not heavy SQL)
  - Contract: remove old columns/tables only after multiple releases

## Forbidden in normal releases
- Dropping columns/tables
- Renaming columns without compatibility strategy
- Large table rewrites in a single migration
- Adding NOT NULL / UNIQUE constraints without staged rollout

## Repeatable migrations
- `R__*.sql` is allowed only for views/functions.
