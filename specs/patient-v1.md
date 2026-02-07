## Core idea

### 1) `public.person` is the universal “contact”

Everyone is a person:

* patients
* parents/guardians
* insurance subscribers who aren’t patients
* emergency contacts
* spouses, etc.

### 2) `public.patient` is an extension of person

Only people who receive care are patients.

This makes “contacts who are patients” and “contacts who are not patients” trivial.

---

# Proposed schema (Cursor spec)

## A) People

### `public.person`

One row per real-world person/contact.

**Columns**

* `id bigserial primary key`
* `clinic_id bigint not null references public.clinic(id) on delete cascade`
* `first_name text not null`
* `last_name text not null`
* `preferred_name text null`
* `dob date null`
* `gender text null` (optional)
* `preferred_language text null`
* `is_active boolean not null default true`
* audit columns + triggers + `audit.event` row-change trigger

**Indexes**

* `(clinic_id, last_name, first_name)`
* `(clinic_id, dob)` optional

> This table is safe to track in Hasura.

---

### `public.patient`

Extension table. Only exists if the person is a patient.

**Columns**

* `person_id bigint primary key references public.person(id) on delete cascade`
* `clinic_id bigint not null references public.clinic(id) on delete cascade`
* `chart_no text null`
* `status text not null default 'active'` (active/inactive/etc)
* `family_doctor_name text null` (optional)
* `family_doctor_phone text null` (optional)
* `imaging_id text null` (optional)
* `is_active boolean not null default true`
* audit columns + triggers + audit-event trigger

**Constraints**

* `patient.clinic_id` must match person.clinic_id (enforce via trigger v1, or store only on person and omit clinic_id here)

**Indexes**

* unique `(clinic_id, chart_no)` where chart_no is not null

> Track in Hasura.

---

## B) Contact Methods (phone/email)

### `public.person_contact_point`

Stores phone/email etc. (supports multiple, primary flags)

**Columns**

* `id bigserial primary key`
* `clinic_id bigint not null`
* `person_id bigint not null references public.person(id) on delete cascade`
* `kind text not null`  (`phone` | `email`)
* `label text null`  (`home` | `work` | `mobile` | `other`)
* `value text not null` (normalized as needed)
* `is_primary boolean not null default false`
* `is_active boolean not null default true`
* audit columns + triggers + audit-event trigger

**Constraints**

* check `kind in ('phone','email')`
* optional: ensure at most one primary per person+kind:

  * unique `(person_id, kind)` where `is_primary = true and is_active = true`

**Indexes**

* `(clinic_id, person_id, kind, is_active)`
* `(clinic_id, value)` optional for lookup

---

## C) Addresses

### Option 1 (recommended v1): address belongs to a person

Keeps it simple and matches your screenshot (mailing + billing per family).

### `public.person_address`

**Columns**

* `id bigserial primary key`
* `clinic_id bigint not null`
* `person_id bigint not null references public.person(id) on delete cascade`
* `kind text not null` (`mailing` | `billing`)
* `line1 text not null`
* `line2 text null`
* `city text not null`
* `region text not null` (province/state)
* `postal_code text not null`
* `country text not null default 'Canada'`
* `is_primary boolean not null default true`
* `is_active boolean not null default true`
* audit columns + triggers + audit-event trigger

**Constraints**

* one active primary per person+kind:

  * unique `(person_id, kind)` where `is_primary=true and is_active=true`

---

## D) Households + relationships + responsible party

This is where the “smart checks” live.

### `public.household`

Represents a family unit for contact/billing/relationships.

**Columns**

* `id bigserial primary key`
* `clinic_id bigint not null references public.clinic(id) on delete cascade`
* `name text null` (optional “Sharma Household”)
* `is_active boolean not null default true`
* audit columns + triggers + audit-event trigger

---

### `public.household_member`

Links people to households and defines exactly one Head.

**Columns**

* `id bigserial primary key`
* `clinic_id bigint not null`
* `household_id bigint not null references public.household(id) on delete cascade`
* `person_id bigint not null references public.person(id) on delete cascade`
* `role text not null` (`head` | `member`)
* `relationship_to_head text null` (`self` | `child` | `spouse` | `other`)
* `is_active boolean not null default true`
* audit columns + triggers + audit-event trigger

**Constraints (the “smart checks”)**

1. A person cannot be in 2 households at once (optional but recommended for dental PMS):

   * unique `(person_id)` where `is_active=true`
2. Exactly one head per household:

   * unique `(household_id)` where `role='head' and is_active=true`
3. Relationship required for non-head:

   * check `(role = 'head') OR (relationship_to_head is not null)`
4. Head should be relationship self:

   * check `(role != 'head') OR (relationship_to_head in ('self') OR relationship_to_head is null)`
     (or just set it to `self` in app logic)

This structure automatically guarantees:

* “head of household cannot have a head of household themselves” because **the household has one head** and membership is not nested.

---

### Responsible party

Responsible party can be:

* self
* another person in the household (patient or non-patient)
* someone outside household (rare but allowed)

Store it on the patient record (simple) or as a separate table if you want history.

#### `public.patient_financial`

(1:1 with patient, keeps patient table cleaner)

**Columns**

* `patient_person_id bigint primary key references public.patient(person_id) on delete cascade`
* `clinic_id bigint not null`
* `responsible_party_person_id bigint not null references public.person(id) on delete restrict`
* `billing_address_source text not null default 'responsible_party'`

  * values: `responsible_party` | `patient` | `custom`
* `custom_billing_address_id bigint null references public.person_address(id)`
* audit columns + triggers + audit-event trigger

**Constraints**

* Responsible party must be active person
* if `billing_address_source='custom'` then `custom_billing_address_id is not null`

**App rule (recommended)**

* default responsible party to household head if patient is a child
* allow override

---

## E) Insurance contacts (non-patients)

Because insurance subscribers can be non-patients, you just create a `public.person` without a `public.patient` row.

If you want to distinguish them:

* add `public.person.kind text not null default 'contact'`

  * `contact` | `patient`
    …but you don’t actually need it because existence of `patient` row already tells you patient vs not.

For insurance you’ll eventually want:

### `public.insurance_subscriber`

* `id bigserial primary key`
* `clinic_id bigint not null`
* `subscriber_person_id bigint not null references public.person(id)`
* `carrier text null`
* `policy_no text null`
* etc
* audit columns + triggers

…and link it from patient coverage tables later.

---

# Hasura tracking strategy (clean + safe)

Track these:

* `person`
* `patient`
* `person_contact_point`
* `person_address`
* `household`
* `household_member`
* `patient_financial`
* plus views for convenience (below)

Don’t track:

* any auth tables with password hashes (you already follow this)

---

# “Ready-to-render” views (worth doing)

### `public.patient_profile_v`

Join for UI:

* patient + person
* contact points (aggregate phones/emails)
* household head + relationship
* responsible party person
* mailing/billing address resolution

This makes the UI fast and avoids a ton of frontend joins.

---

# Why this is the best structure for your requirements

* Supports “contacts who are patients” and “contacts who aren’t patients” naturally
* Household rules are enforced by constraints (one head, no nested heads)
* Responsible party can be anyone (patient or non-patient)
* Phone/email/address are modeled once on `person` and reused everywhere
* Works nicely with Hasura relationships + views
