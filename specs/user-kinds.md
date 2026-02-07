Users v1 (Middle Ground)

## 0) Goals

1. Model user “what they are” separately from permissions:

   * `user_profile.user_kind` for UI and domain behavior (dentist/hygienist/staff/etc)
2. Model clinic-specific job/provider behavior on membership:

   * store scheduling and job attributes on `clinic_user`
3. Ensure every change is auditable:

   * row audit fields (`created_by`, `updated_by`, timestamps)
   * row-change events in `audit.event`

---

# 1) Data Model

## 1.1 `public.app_user` (identity + credentials)

**Not tracked in Hasura.** Auth service only writes.

Minimum columns (example):

* `id uuid primary key`
* `email text unique not null`
* `password_hash text not null`
* `display_name text null`
* `phone text null`
* `dob date null`
* `is_active boolean not null default true`
* plus audit columns + triggers (recommended even if untracked)

> Note: Even if untracked, audit triggers still work and protect you.

---

## 1.2 `public.user_profile` (global person profile, 1:1)

This is the “what they are” layer.

### Columns

* `user_id uuid primary key references public.app_user(id) on delete cascade`
* `user_kind text not null` (controlled values)
* `license_no text null` (RCSDO/CNO/etc)
* `scheduler_color text null` (global default)
* `is_active boolean not null default true`
* **audit columns**:

  * `created_at, created_by, updated_at, updated_by, is_active`

### Constraints

* `user_kind` must be one of allowed kinds

### Indexes

* `idx_user_profile_kind (user_kind)`
* `idx_user_profile_active (is_active)`

**Allowed `user_kind` values v1**

* `staff`
* `dentist`
* `hygienist`
* `assistant`
* `manager`

Keep it small; you can expand later.

---

## 1.3 `public.clinic_user` (membership + clinic-variant fields)

This is “their job at this clinic”.

### Existing columns (typical)

* `id bigserial primary key`
* `clinic_id bigint not null references public.clinic(id) on delete cascade`
* `user_id uuid not null references public.app_user(id) on delete cascade`
* `joined_at timestamptz null`
* `is_active boolean not null default true`
* audit columns...

### Add these clinic-variant columns (v1)

**Job details**

* `job_title text null` (e.g. “Front Desk”, “Office Manager”)

**Provider modeling (scheduling)**

* `is_schedulable boolean not null default false`
  Whether they can appear as a provider in the scheduler.
* `provider_kind text null` with check constraint:
    * `provider_kind in ('dentist','hygienist','assistant')` or null
* `default_operatory_id bigint null references public.operatory(id) on delete set null`
* `scheduler_color text null` (clinic-specific override)

### Indexes

* `idx_clinic_user_clinic_active (clinic_id, is_active)`
* `idx_clinic_user_user (user_id)`
* `idx_clinic_user_schedulable (clinic_id, is_schedulable)` (partial if you want)
* `idx_clinic_user_provider_kind (clinic_id, provider_kind)` (optional)

### Invariants

* if `is_schedulable = true` then `provider_kind is not null`
* (optional) if provider_kind is not null then it must align with user_profile.user_kind for sanity:

  * enforce in app logic v1, or add a trigger later

---

# 2) Auditing Rules (MUST APPLY)

## 2.1 Audit columns required on:

* `public.app_user`
* `public.user_profile`
* `public.clinic_user`
* `public.operatory` (you already fixed this)

Audit columns standard:

* `created_at timestamptz not null default now()`
* `created_by uuid null references public.app_user(id)`
* `updated_at timestamptz not null default now()`
* `updated_by uuid null references public.app_user(id)`
* `is_active boolean not null default true`

## 2.2 Triggers required on each table

* `tr_stamp_audit_columns` (BEFORE INSERT/UPDATE)
* `tr_audit_row_change` (AFTER INSERT/UPDATE/DELETE → inserts into `audit.event`)

Definition of Done for any new table:

* columns exist
* both triggers exist
* insert/update/delete produces an `audit.event` row

---

# 3) Migrations

Create one migration for the whole “Users v1” change:

`infra/hasura/migrations/default/0000000000100_users_v1_middle_ground/up.sql`

### 3.1 Up migration (Cursor must implement)

**A) Ensure `user_profile` exists**

* create table if not exists `public.user_profile`
* add constraints/checks
* add audit triggers

**B) Add clinic fields onto `public.clinic_user`**

* `alter table ... add column if not exists job_title ...`
* `department`, `is_schedulable`, `provider_kind`, `default_operatory_id`, `scheduler_color`
* add constraints (department/provider_kind checks, schedulable implies provider_kind)
* add indexes
* ensure audit triggers exist on `clinic_user`

**C) Optional: Backfill defaults**

* for existing users, set `user_profile.user_kind = 'staff'` if missing (only if safe)

### 3.2 Down migration

* drop columns from `clinic_user` (only if you truly want reversible; otherwise skip)
* drop `user_profile`

(You can mark down as no-op if you don’t care about reversing, but Cursor should still create it.)

---

# 4) Hasura Tracking Plan

## 4.1 Tables / views

* Do NOT track: `public.app_user`
* Track:

  * `public.user_profile`
  * `public.clinic_user`
  * `public.role`, `public.clinic_user_role`, etc (already in your RBAC)

## 4.2 Create safe views for UI reads (recommended)

Because `app_user` is untracked, create a safe view for user identity:

### `public.app_user_v`

Columns:

* `id`
* `email`
* `display_name`
* `phone`
* `dob`
* `is_active`
* `created_at`, `updated_at`

No password fields ever.

Then another view that is “ready for User Management UI”:

### `public.clinic_user_with_profile_v`

Join:

* `clinic_user` → `app_user_v` → `user_profile`

Return fields:

* clinic_user: `id, clinic_id, user_id, job_title, department, is_schedulable, provider_kind, default_operatory_id, scheduler_color, joined_at, is_active`
* app_user_v: `email, display_name, phone`
* user_profile: `user_kind, license_no, scheduler_color (global)`

Track these views in Hasura for read operations.

---

# 5) Auth Service Responsibilities

## 5.1 Create user endpoint (already planned)

`POST /auth/users`
Transaction does:

1. insert into `public.app_user` (with password_hash)
2. insert into `public.user_profile` (user_kind, license if provided)
3. insert into `public.clinic_user` (job/provider fields, join clinic)
4. assign roles
5. write `audit.event` semantic log: `user.create`

Even though triggers will also produce row-change events, semantic event is valuable for humans.

## 5.2 Update user profile endpoint

`PATCH /auth/users/:userId/profile`
Updates `public.user_profile` and (optionally) related membership fields.

`PATCH /auth/clinics/:clinicId/users/:userId/membership`
Updates clinic-specific fields on `clinic_user`:

* job_title, department
* is_schedulable/provider_kind
* default_operatory_id
* scheduler_color

Every update should:

* pass capability checks (`users.manage`)
* emit semantic audit events (`user.profile.update`, `clinic_user.update`) in addition to trigger-based row-change logs

---

# 6) UI Expectations (User Management)

User Management screen needs:

* list users for clinic (query `clinic_user_with_profile_v`)
* create user flow (calls auth service)
* edit user kind/license (auth service)
* edit membership details:

  * job title, department
  * toggles schedulable + provider_kind
  * default operatory dropdown
  * clinic scheduler color override

---

# 7) Testing Spec (must exist from day one)

## 7.1 DB-level integration tests (recommended)

For each table:

1. Insert via Hasura mutation as an authenticated user
2. Confirm:

   * row has `created_by`/`updated_by` set to the actor
   * `audit.event` has a corresponding row for the insert
3. Update via Hasura mutation
4. Confirm:

   * `updated_by` changes
   * `audit.event` includes update row-change payload

Minimum tests:

* `public.operatory`
* `public.clinic_user`
* `public.user_profile`

## 7.2 Auth service tests

* Create user -> verify:

  * `app_user`, `user_profile`, `clinic_user` rows exist
  * `audit.event` contains semantic `user.create`
  * triggers also created row-change events

---

# 8) Cursor Definition of Done

Cursor must not consider implementation complete until:

1. New tables/columns exist
2. Audit columns are present
3. Audit triggers are attached
4. Creating operatories via Hasura results in `audit.event` entries
5. User list page can query `clinic_user_with_profile_v`
6. Auth service can create a user and assign roles