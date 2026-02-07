# Audit Export via Auth Service (audit.event + audit.export)

## 1) Database changes

### 1.1 Add capability `audit.export` (idempotent)

Create a migration:

`infra/hasura/migrations/default/0000000000010_audit_export_capability/up.sql`

```sql
insert into public.capability (key, description, module, is_deprecated)
values
  ('audit.export', 'Export audit logs (CSV/JSONL)', 'audit', false)
on conflict (key) do update
set
  description = excluded.description,
  module = excluded.module,
  is_deprecated = excluded.is_deprecated;
```

`down.sql` (optional; usually keep capabilities):

```sql
delete from public.capability where key = 'audit.export';
```

### 1.2 Seed: grant `audit.export` to Owner role during bootstrap

Update your `fn_bootstrap_system` (or your seed migration) so that when you create the Owner role you also attach:

* `audit.export`

Add one more row to the existing insert into `public.role_capability`:

```sql
(v_role_id, 'audit.export')
```

---

## 2) Auth Service Endpoint

### 2.1 Route

`GET /audit/export`

### 2.2 Authorization

* Requires JWT
* Uses `clinicId` from JWT claims by default
* Allows optional `clinicId` query param only if caller has `system.admin` for that requested clinic (v1 can also forbid clinic override)

Permission rule:

* must have **`audit.export` OR `system.admin`** for the clinic being exported

Capability check uses DB function:

* `public.fn_has_capability(p_clinic_id bigint, p_user_id uuid, p_capability_key text) returns boolean`

### 2.3 Query params

* `format`: `csv | jsonl` default `csv`
* `from`: ISO date/datetime optional
* `to`: ISO date/datetime optional
* `action`: optional exact match (e.g. `user.create`)
* `entityType`: optional exact match
* `actorUserId`: optional uuid
* `success`: optional boolean
* `limit`: default 100000, max 500000
* `order`: `asc | desc`, default `desc`
* `clinicId`: optional bigint override (only for system.admin)

### 2.4 Export columns (stable contract)

Export exactly:

* `occurred_at`
* `clinic_id`
* `actor_user_id`
* `action`
* `entity_type`
* `entity_id`
* `success`
* `request_id`
* `ip`
* `user_agent`
* `payload`

---

## 3) Auth service implementation details (Fastify + Postgres streaming)

### 3.1 Dependencies

Add to `apps/auth/package.json`:

```json
{
  "dependencies": {
    "pg-copy-streams": "^6.0.6"
  }
}
```

### 3.2 Implement `GET /audit/export` using COPY TO STDOUT

* Use `pg-copy-streams` to stream CSV:

  * `copy (select ...) to stdout with (format csv, header true)`
* For JSONL:

  * v1 may return rows and write line-by-line up to `limit` (ok)
  * later you can implement cursor streaming if you want true streaming

### 3.3 Also audit the export itself

When an export is performed, insert an audit row:

* `action = 'audit.export'`
* `entity_type = 'audit.event'`
* `entity_id = null`
* payload includes:

  * filters
  * format
  * limit
  * order

This makes exports traceable.

---

## 4) Files to create/update

### 4.1 `apps/auth/src/routes/auditExport.ts`

Create this route module and register it in your server.

**Must do:**

* validate query with Zod
* determine clinicId
* perform capability check
* build parameterized SQL
* stream output

**CSV must be streamed** (do not load into memory).

### 4.2 `apps/auth/src/rbac/requireCapability.ts`

Implement helper that supports:

* single capability check
* OR-check (any of list)

### 4.3 `apps/auth/src/index.ts`

Register audit export routes.

---

## 5) Example SQL used by the exporter

Base query template (parameterized):

```sql
select
  occurred_at,
  clinic_id,
  actor_user_id,
  action,
  entity_type,
  entity_id,
  success,
  request_id,
  ip,
  user_agent,
  payload
from audit.event
where clinic_id = $1
  and ($2::timestamptz is null or occurred_at >= $2)
  and ($3::timestamptz is null or occurred_at <  $3)
  and ($4::text is null or action = $4)
  and ($5::text is null or entity_type = $5)
  and ($6::uuid is null or actor_user_id = $6)
  and ($7::boolean is null or success = $7)
order by occurred_at desc
limit $8;
```

Then wrap with:

```sql
copy (<base query>) to stdout with (format csv, header true)
```

---

## 6) Frontend usage

To download logs:

* make a GET request with bearer token
* browser will download file

Example URL:

`/audit/export?from=2026-02-01&to=2026-02-07&format=csv`

---

## 7) Tests (required)

Write integration tests (Vitest) that:

1. No token → 401
2. Token without `audit.export` (and without system.admin) → 403
3. Token with `audit.export` → 200 and CSV has header
4. Filtering by `action=user.create` reduces rows
5. Export itself creates an `audit.event` row with `action='audit.export'`
