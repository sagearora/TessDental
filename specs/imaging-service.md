# Imaging Service Spec (Cursor)

## 0) Goals

1. Frontend never touches NAS/S3 directly. **All access goes through imaging-service**.
2. Storage backend is swappable: `IMAGING_STORAGE_BACKEND = s3 | nfs`.
3. Every action writes an `audit.event`.
4. Fast UI: thumbnails and “web-optimized” versions.
5. Clinic scoping is enforced from JWT (`x-hasura-clinic-id`, `x-hasura-user-id`).

---

# 1) Service shape

* Package: `apps/imaging-service`
* Runtime: Node 20 + TypeScript
* Framework: **Fastify**
* Runs on port `4010`
* Dockerized
* Talks to Postgres (direct) OR to Hasura (admin secret) for metadata writes.

  * **Recommended v1:** talk to Postgres directly for `imaging_*` + `audit.event` to avoid Hasura file ops.

---

# 2) Environment variables (required)

### Core

* `PORT=4010`
* `NODE_ENV=development|production`
* `IMAGING_STORAGE_BACKEND=s3|nfs`
* `IMAGING_MAX_UPLOAD_MB=100`
* `IMAGING_THUMBS_ENABLED=true`

### JWT verification

* JWT_SECRET: ${JWT_SECRET}
* JWT_ISSUER: ${JWT_ISSUER}
* JWT_AUDIENCE: ${JWT_AUDIENCE} 

This is waht hasura uses for authentication, if you need to decode the jwt and verify, you may have to update the docker-compose to set those secrets

### Postgres

* `DATABASE_URL=postgres://...`

### S3 backend (MinIO/AWS)

* `IMAGING_S3_ENDPOINT=http://minio:9000` (omit endpoint for AWS if you want)
* `IMAGING_S3_REGION=us-east-1`
* `IMAGING_S3_BUCKET=tess-imaging`
* `IMAGING_S3_ACCESS_KEY_ID=...`
* `IMAGING_S3_SECRET_ACCESS_KEY=...`
* `IMAGING_S3_FORCE_PATH_STYLE=true` (true for MinIO)

### NFS backend (Synology)

* `IMAGING_NFS_BASE_DIR=/data/imaging`

---

# 3) Storage layout (single key namespace)

All assets use a single relative `storage_key` that is backend-agnostic.

**Key format:**

```
clinic_<clinicId>/patients/<patientId>/studies/<studyId>/<kind>/<assetId>_<utcTimestamp>.<ext>
```

Where:

* `kind` in: `originals | thumbs | web`
* `assetId` is the DB id (bigint) so filenames are stable

Examples:

* `clinic_12/patients/345/studies/78/originals/9001_20260209T153012Z.png`
* `clinic_12/patients/345/studies/78/thumbs/9001_thumb.webp`

NFS maps key → `/data/imaging/<key>`
S3 maps key → `s3://bucket/<key>`

---

# 4) Database schema (migrations)

## 4.1 `public.imaging_study`

Represents a capture session or logical group (ex: “BWX 2026-02-09”).

Columns:

* `id bigserial pk`
* `clinic_id bigint not null`
* `patient_id bigint not null`
* `kind text not null` (ex: `XRAY_BWX`, `XRAY_PA`, `PHOTO`, `DOCUMENT`)
* `title text null`
* `captured_at timestamptz not null default now()`
* `source text null` (ex: `schick-bridge`, `manual-upload`)
* audit fields: `created_at`, `created_by_id uuid`, `updated_at`, `updated_by_id uuid`
* `is_active boolean not null default true`

Indexes:

* `(clinic_id, patient_id, captured_at desc)`

## 4.2 `public.imaging_asset`

One file.

Columns:

* `id bigserial pk`
* `clinic_id bigint not null`
* `patient_id bigint not null`
* `study_id bigint not null references imaging_study(id) on delete cascade`
* `modality text not null` (`XRAY|PHOTO|DOC`)
* `mime_type text not null`
* `size_bytes bigint not null`
* `sha256 text not null`
* `storage_backend text not null` (`s3|nfs`)
* `storage_key text not null`
* `thumb_key text null`
* `web_key text null`
* `captured_at timestamptz not null default now()`
* `source_device text null` (ex: `Schick 33`)
* `is_active boolean not null default true`
* audit fields: `created_at`, `created_by_id uuid`, `updated_at`, `updated_by_id uuid`

Indexes:

* `(clinic_id, patient_id, captured_at desc)`
* `(study_id)`
* unique `(storage_backend, storage_key)` (optional)

## 4.3 Audit

You already have `audit.event`. Imaging-service must write events there.

Required event types:

* `imaging.study.create`
* `imaging.asset.create`
* `imaging.asset.thumb_generated`
* `imaging.asset.view`
* `imaging.asset.delete` (soft delete)

---

# 5) Auth + permission model

Imaging-service verifies JWT then enforces:

* `clinic_id` comes from JWT claim `x-hasura-clinic-id`
* `user_id` comes from JWT claim `x-hasura-user-id`

Rules:

* user can only access assets where `asset.clinic_id == claim.clinic_id`
* user must have capability:

  * `imaging.read` for GET endpoints
  * `imaging.write` for upload/commit/delete

Capability check v1:

* call Postgres function `public.fn_has_capability(clinic_id, user_id, capability_key)` (you already have something like this)
* if false → 403

Every request writes audit:

* `request_id` (generate UUID)
* `actor_user_id`
* `clinic_id`
* `entity_table`, `entity_id`
* `action`
* `payload` (metadata only)

---

# 6) API endpoints (exact)

## 6.1 Health

### `GET /health`

Returns `{ ok: true, backend: 's3'|'nfs' }`

---

## 6.2 Studies

### `POST /imaging/studies`

Creates a study.

Body:

```json
{
  "patientId": 345,
  "kind": "XRAY_BWX",
  "title": "BWX",
  "capturedAt": "2026-02-09T15:30:12Z",
  "source": "schick-bridge"
}
```

Returns:

```json
{ "studyId": 78 }
```

Audit: `imaging.study.create`

---

## 6.3 Upload init (optional, but recommended for future)

### `POST /imaging/assets/upload-init`

Returns an upload token so bridges can upload large files in chunks later if needed.

Body:

```json
{
  "patientId": 345,
  "studyId": 78,
  "modality": "XRAY",
  "mimeType": "image/png",
  "sourceDevice": "Schick 33"
}
```

Returns:

```json
{
  "uploadId": "uuid",
  "maxBytes": 104857600
}
```

(For v1 you can skip this and just stream upload directly.)

---

## 6.4 Upload (streaming)

### `POST /imaging/assets/upload`

Multipart form-data:

* fields:

  * `patientId`
  * `studyId`
  * `modality`
  * `capturedAt` (optional)
  * `sourceDevice` (optional)
* file:

  * `file`

Flow:

1. Validate JWT + capability `imaging.write`
2. Validate clinic ownership of patient/study
3. Insert `imaging_asset` row first to get `assetId`
4. Compute `storage_key`
5. Stream bytes to storage adapter
6. Compute sha256 while streaming
7. Update `imaging_asset` with `size_bytes`, `sha256`, `storage_backend`, `storage_key`
8. Generate thumbnail + web version (if enabled)
9. Update `thumb_key`, `web_key`
10. Emit audit events

Returns:

```json
{ "assetId": 9001 }
```

Audit:

* `imaging.asset.create`
* `imaging.asset.thumb_generated` (if created)

---

## 6.5 View

### `GET /imaging/assets/:assetId`

Query:

* `variant=original|web|thumb` (default `web`)

Headers:

* `Authorization: Bearer <jwt>`

Flow:

* verify `imaging.read`
* stream file
* set `Cache-Control` (private)
* audit `imaging.asset.view` (optional: sample/rate limit to avoid spam)

---

## 6.6 Delete (soft delete)

### `DELETE /imaging/assets/:assetId`

* verify `imaging.write`
* set `is_active=false`
* optionally enqueue physical deletion later
* audit `imaging.asset.delete`

---

# 7) Thumbnail/web generation

Use `sharp`.

Rules:

* For X-rays: keep PNG original; web version can be webp/jpg for viewing
* Thumb: webp, max 400px wide
* Web: webp, max 2000px wide (or no resize if already small)

Store derived files under same key namespace:

* thumbs: `<assetId>_thumb.webp`
* web: `<assetId>_web.webp`

---

# 8) Observability

* Structured logs (pino) with request_id
* `GET /metrics` optional later
* log slow ops: upload > 2s, thumb gen > 1s

---

# 9) Testing requirements (from day 1)

## Unit

* storage_key generation deterministic
* adapter put/get roundtrip (S3 mocked, NFS temp dir)
* thumbnail generation outputs expected sizes

## Integration

* Upload request writes DB rows + objects exist in MinIO
* GET streams correct bytes

## E2E (Playwright)

* patient page loads gallery thumbs
* click thumb opens web image
* offline: shows proper error

---

# 10) Cursor “Definition of Done”

Imaging-service is complete when:

1. `POST /imaging/studies` works and audits
2. `POST /imaging/assets/upload` stores file in MinIO and creates DB metadata + thumb/web keys
3. `GET /imaging/assets/:id?variant=thumb` streams thumb correctly
4. Switching `IMAGING_STORAGE_BACKEND=nfs` writes files to mounted folder with same key format
5. All actions generate `audit.event` rows
