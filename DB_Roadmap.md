You are designing TessDental’s production-grade scheduling schema. ONLY define the database schema (tables/columns/types/constraints/indexes/relationships). No API code.

Modules in scope:
- clinics
- users
- patients (+ patient_contacts)
- operatories
- appointment_statuses
- appointment_confirmations
- appointments (overlaps allowed)
- appointment_history (immutable)
- appointment_tags (many-to-many)
- clinic_hours
- provider_availability
- scheduling_communication_events (appointment-scoped outbound/inbound events)

PostgreSQL 16+ conventions:
- Primary keys: `id bigint generated always as identity primary key`
- Every business table is clinic-scoped: `clinic_id bigint not null references clinics(id)`
- Mutable tables include:
  - `created_at timestamptz not null default now()`
  - `updated_at timestamptz not null default now()`
  - `row_version int not null default 1`
  - `created_by_id bigint null references users(id)`
  - `updated_by_id bigint null references users(id)`
- Index every foreign key.
- Use `timestamptz` for all datetimes.
- Appointments are allowed to overlap (NO exclusion constraints).

========================
1) clinics
========================
Purpose: Root config per physical office.

Columns:
- id
- name text not null
- timezone text not null default 'America/Toronto'
- unit_length_minutes int not null default 5
- is_active boolean not null default true
- created_at, updated_at, row_version, created_by_id, updated_by_id

Constraints:
- CHECK (unit_length_minutes > 0 AND unit_length_minutes <= 60)

Indexes:
- UNIQUE (lower(name))
- (is_active)

========================
2) users
========================
Purpose: Staff accounts. Providers are users with provider roles.

Columns:
- id
- clinic_id fk
- email text not null
- first_name text not null
- last_name text not null
- role text not null
  Allowed: 'admin' | 'provider' | 'staff' | 'billing' | 'read_only'
- is_active boolean not null default true
- created_at, updated_at, row_version, created_by_id, updated_by_id

Constraints:
- Optional strictness: CHECK (email = lower(email))
- CHECK (role in ('admin','provider','staff','billing','read_only'))

Indexes:
- UNIQUE (clinic_id, lower(email))
- (clinic_id, last_name, first_name)
- (clinic_id, role)
- (clinic_id, is_active)

========================
3) patients
========================
Purpose: Patient master record for scheduling.

Columns:
- id
- clinic_id fk
- chart_no text null
- first_name text not null
- last_name text not null
- dob date null
- email text null
- preferred_contact_method text null  ('sms'|'email'|'phone'|null)
- default_dentist_id bigint null fk -> users(id)
- default_hygienist_id bigint null fk -> users(id)
- default_assistant_id bigint null fk -> users(id)
- responsible_party_id bigint null fk -> patients(id)
- is_active boolean not null default true
- created_at, updated_at, row_version, created_by_id, updated_by_id

Constraints:
- UNIQUE (clinic_id, chart_no) WHERE chart_no IS NOT NULL
- CHECK (preferred_contact_method in ('sms','email','phone') OR preferred_contact_method IS NULL)

Indexes:
- (clinic_id, last_name, first_name)
- (clinic_id, dob)
- (clinic_id, is_active)
- (clinic_id, email) WHERE email IS NOT NULL
- FK indexes: (default_dentist_id), (default_hygienist_id), (default_assistant_id), (responsible_party_id)

========================
4) patient_contacts
========================
Purpose: Multiple contact points for a patient (phones/emails). Supports search and primary selection.

Columns:
- id
- patient_id bigint not null references patients(id)
- type text not null  ('cell'|'home'|'work'|'email')
- value text not null
- is_primary boolean not null default false
- is_active boolean not null default true
- created_at, updated_at, row_version, created_by_id, updated_by_id

Constraints:
- CHECK (type in ('cell','home','work','email'))
- UNIQUE (patient_id, type, value)

Indexes:
- (patient_id)
- (type, value)
- (patient_id) WHERE is_primary = true

========================
5) operatories
========================
Purpose: Chairs/rooms/schedule columns. Optional provider ownership.

Columns:
- id
- clinic_id fk
- name text not null
- short_name text null
- is_bookable boolean not null default true
- provider_id bigint null references users(id)
- is_active boolean not null default true
- created_at, updated_at, row_version, created_by_id, updated_by_id

Constraints:
- UNIQUE (clinic_id, name)

Indexes:
- (clinic_id)
- (clinic_id, is_active)
- (provider_id)
- (clinic_id, is_bookable)

========================
6) appointment_statuses
========================
Purpose: Workflow state (Scheduled, Completed, Cancelled, No-Show...). Clinic-customizable.

Columns:
- id
- clinic_id fk
- name text not null
- workflow_order int not null default 0
- color text null
- is_active boolean not null default true
- created_at, updated_at, row_version, created_by_id, updated_by_id

Constraints:
- UNIQUE (clinic_id, name)
- CHECK (workflow_order >= 0)

Indexes:
- (clinic_id, workflow_order)
- (clinic_id, is_active)

========================
7) appointment_confirmations
========================
Purpose: Confirmation state separate from status (Unconfirmed, Left Message, Confirmed...).

Columns:
- id
- clinic_id fk
- name text not null
- workflow_order int not null default 0
- is_active boolean not null default true
- created_at, updated_at, row_version, created_by_id, updated_by_id

Constraints:
- UNIQUE (clinic_id, name)
- CHECK (workflow_order >= 0)

Indexes:
- (clinic_id, workflow_order)
- (clinic_id, is_active)

========================
8) appointment_tags
========================
Purpose: Tag dictionary used to label appointments with multiple reasons (e.g. "New Patient", "Crown Prep", "Emergency").

Columns:
- id
- clinic_id fk
- name text not null
- color text null
- is_active boolean not null default true
- created_at, updated_at, row_version, created_by_id, updated_by_id

Constraints:
- UNIQUE (clinic_id, name)

Indexes:
- (clinic_id, is_active)

========================
9) appointments
========================
Purpose: Schedule events. Overlaps allowed. Supports blocks and appointments.

Core columns:
- id
- clinic_id fk
- type text not null default 'appointment'  ('appointment'|'block')
- start_at timestamptz not null
- length_minutes int not null
- end_at timestamptz GENERATED ALWAYS AS (start_at + make_interval(mins => length_minutes)) STORED
- operatory_id bigint not null references operatories(id)
- provider_id bigint null references users(id)
- patient_id bigint null references patients(id)   -- required when type='appointment'
- status_id bigint not null references appointment_statuses(id)
- confirmation_id bigint null references appointment_confirmations(id)

Display/metadata:
- title text null
- notes text null
- show_on_calendar boolean not null default true
- is_online_booking boolean not null default false
- is_self_bookable boolean not null default false

Lifecycle + accountability (WHO TOUCHED IT):
- booked_at timestamptz not null default now()
- booked_by_id bigint null references users(id)
- source text not null default 'front_desk'
  Allowed: 'front_desk'|'online'|'automation'|'import'
- last_modified_at timestamptz not null default now()
- last_modified_by_id bigint null references users(id)

Cancellation fields:
- cancelled_at timestamptz null
- cancelled_by_id bigint null references users(id)
- cancel_reason text null

Check-in/out optional fields (for future but useful now):
- arrived_at timestamptz null
- seated_at timestamptz null
- completed_at timestamptz null

Audit columns:
- created_at, updated_at, row_version, created_by_id, updated_by_id

Constraints:
- CHECK (length_minutes > 0 AND length_minutes <= 1440)
- CHECK (type in ('appointment','block'))
- CHECK (source in ('front_desk','online','automation','import'))
- CHECK (type <> 'appointment' OR patient_id IS NOT NULL)

Indexes (schedule query performance):
- (clinic_id, start_at)
- (clinic_id, end_at)
- (operatory_id, start_at)
- (provider_id, start_at)
- (patient_id, start_at)
- (status_id)
- (confirmation_id)
- Partial index for active (not cancelled):
  - (clinic_id, start_at) WHERE cancelled_at IS NULL
Window query logic:
- start_at < window_end AND end_at > window_start

========================
10) appointment_tag_links (many-to-many)
========================
Purpose: Attach multiple tags to an appointment.

Columns:
- appointment_id bigint not null references appointments(id) on delete cascade
- appointment_tag_id bigint not null references appointment_tags(id)
- created_at timestamptz not null default now()
- created_by_id bigint null references users(id)

Constraints:
- PRIMARY KEY (appointment_id, appointment_tag_id)

Indexes:
- (appointment_tag_id, appointment_id)

========================
11) appointment_history (immutable audit)
========================
Purpose: Append-only log of every appointment change: what happened, who did it, when, and a payload (before/after or diff).
Must be insert-only.

Columns:
- id
- clinic_id bigint not null references clinics(id)
- appointment_id bigint not null references appointments(id)
- action text not null
  Suggested values:
  'create'|'update'|'move'|'cancel'|'restore'|'status_change'|'confirmation_change'|
  'tag_add'|'tag_remove'|'checkin'|'seat'|'complete'
- occurred_at timestamptz not null default now()
- actor_user_id bigint null references users(id)
- source text not null default 'front_desk'  (same enum as appointments.source)
- payload jsonb not null   (store diff + key fields)
- request_id text null     (trace across services)
- ip inet null
- user_agent text null

Constraints:
- CHECK (action <> '')
- CHECK (source in ('front_desk','online','automation','import'))

Indexes:
- (appointment_id, occurred_at desc)
- (clinic_id, occurred_at desc)
- (actor_user_id, occurred_at desc)

Immutability:
- No updated_at, no row_version.

========================
12) clinic_hours
========================
Purpose: Define default weekly open/close hours per clinic. Used for schedule UI shading + online booking validation.

Columns:
- id
- clinic_id fk
- weekday smallint not null   (0=Sunday ... 6=Saturday)
- is_closed boolean not null default false
- open_time time null         (required if not closed)
- close_time time null        (required if not closed)
- effective_from date null    (optional: future schedule changes)
- effective_to date null
- created_at, updated_at, row_version, created_by_id, updated_by_id

Constraints:
- CHECK (weekday between 0 and 6)
- CHECK (
    (is_closed = true AND open_time IS NULL AND close_time IS NULL)
    OR
    (is_closed = false AND open_time IS NOT NULL AND close_time IS NOT NULL AND close_time > open_time)
  )
- If using effective ranges:
  - CHECK (effective_to IS NULL OR effective_from IS NULL OR effective_to >= effective_from)

Indexes:
- UNIQUE (clinic_id, weekday, coalesce(effective_from, date '1900-01-01'))  (allows multiple periods)
- (clinic_id, weekday)

========================
13) provider_availability
========================
Purpose: Weekly availability rules for providers (and optionally per operatory). Supports available/unavailable blocks (e.g., dentist works Mon 9-5, unavailable Tue afternoons).

Columns:
- id
- clinic_id fk
- user_id bigint not null references users(id)
- weekday smallint not null (0..6)
- start_time time not null
- end_time time not null
- rule_type text not null default 'available'
  Allowed: 'available'|'unavailable'
- operatory_id bigint null references operatories(id)  (optional: only in this operatory)
- notes text null
- effective_from date null
- effective_to date null
- created_at, updated_at, row_version, created_by_id, updated_by_id

Constraints:
- CHECK (weekday between 0 and 6)
- CHECK (end_time > start_time)
- CHECK (rule_type in ('available','unavailable'))
- CHECK (effective_to IS NULL OR effective_from IS NULL OR effective_to >= effective_from)

Indexes:
- (clinic_id, user_id, weekday)
- (user_id, weekday)
- (operatory_id)
- (clinic_id, weekday)

Note:
- Overlaps between availability rows are allowed; application can resolve by priority:
  - rule_type='unavailable' overrides 'available' when overlapping.

========================
Cross-clinic integrity note (important)
========================
In v1, enforce "same clinic" references in application logic:
- appointments.operatory_id must belong to appointments.clinic_id
- appointments.provider_id/patient_id/status_id/confirmation_id must belong to same clinic
- appointment_tag_links must only link within clinic
Later you may enforce with composite keys (clinic_id,id) pairs, but it is optional for v1.

========================
Seed data (structure expectation)
========================
Create a separate Flyway seed migration that inserts:
- Demo clinic
- Default appointment_statuses: Scheduled, Confirmed, Completed, Cancelled, No-Show
- Default appointment_confirmations: Unconfirmed, Left Message, Confirmed
- A few appointment_tags: New Patient, Cleaning, Emergency, Crown, Filling
- One operatory: Op 1

Output requirement for Cursor:
- Implement this schema as Flyway migrations (SQL DDL) with the exact columns, constraints, and indexes.
- Do NOT implement overlap prevention.
- Ensure all FK columns are indexed.
- Ensure updated_at and row_version are intended to be maintained by application updates (no triggers required in v1).
