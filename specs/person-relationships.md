# Household + Responsible Party as Person-to-Person Links (No Household Table)

## 0) Goal

Remove `household` and `household_member` tables.

Represent family groupings using:

* `person.responsible_party_id` (self -> payer/root)
* `person.household_relationship` (relationship to responsible party)

This enables:

* family navigation
* correct reminders (contact payer/root)
* family billing grouping (group by responsible party root)
* minimal UI complexity

---

# 1) Data Model (Public Schema)

## 1.1 Modify `public.person`

Add these fields:

```sql
alter table public.person
add column if not exists responsible_party_id bigint null references public.person(id) on delete restrict;

alter table public.person
add column if not exists household_relationship text null;
```

### Relationship enum (check constraint)

Allowed values:

* `self`
* `child`
* `spouse`
* `parent`
* `guardian`
* `other`

```sql
alter table public.person
add constraint chk_person_household_relationship
check (
  household_relationship is null
  or household_relationship in ('self','child','spouse','parent','guardian','other')
);
```

---

# 2) Rules (must be enforced by DB)

## Rule A: Responsible party must be the “root”

If a person is a responsible party for someone else, then:

> they must have `responsible_party_id IS NULL`

This ensures the family structure is always a **2-level tree**, not a chain.

Meaning:

* kids point to mom
* spouse can point to mom
* mom points to nobody

No nested chains like:
kid -> mom -> grandma

---

## Rule B: If responsible_party_id is NULL, relationship must be self

If `responsible_party_id IS NULL`, then:

* `household_relationship` must be `'self'` (or null but prefer self)

---

## Rule C: If responsible_party_id IS NOT NULL, relationship must NOT be self

If `responsible_party_id IS NOT NULL`, then:

* `household_relationship` cannot be `'self'`

---

# 3) DB enforcement implementation

## 3.1 Trigger function: validate household structure

Create:

```sql
create or replace function public.fn_validate_person_household()
returns trigger
language plpgsql
as $$
declare
  v_is_responsible_for_others boolean;
begin
  -- Normalize: if responsible_party_id is null, set relationship to self
  if NEW.responsible_party_id is null then
    if NEW.household_relationship is null then
      NEW.household_relationship := 'self';
    end if;
  end if;

  -- Relationship validation rules
  if NEW.responsible_party_id is null then
    if NEW.household_relationship <> 'self' then
      raise exception 'person_with_no_responsible_party_must_have_relationship_self';
    end if;
  else
    if NEW.household_relationship is null then
      raise exception 'relationship_required_when_responsible_party_id_is_set';
    end if;

    if NEW.household_relationship = 'self' then
      raise exception 'relationship_self_not_allowed_when_responsible_party_id_is_set';
    end if;

    if NEW.responsible_party_id = NEW.id then
      raise exception 'responsible_party_id_cannot_reference_self';
    end if;
  end if;

  -- If this person is being assigned a responsible_party_id,
  -- ensure that the responsible party is itself a root node (responsible_party_id must be null)
  if NEW.responsible_party_id is not null then
    if exists (
      select 1
      from public.person rp
      where rp.id = NEW.responsible_party_id
        and rp.responsible_party_id is not null
    ) then
      raise exception 'responsible_party_must_be_root_with_null_responsible_party_id';
    end if;
  end if;

  -- If this person is a responsible party for others, they must have responsible_party_id null
  select exists (
    select 1
    from public.person p
    where p.responsible_party_id = NEW.id
      and p.is_active = true
  ) into v_is_responsible_for_others;

  if v_is_responsible_for_others and NEW.responsible_party_id is not null then
    raise exception 'person_who_is_responsible_party_for_others_must_have_null_responsible_party_id';
  end if;

  return NEW;
end;
$$;
```

Attach trigger:

```sql
drop trigger if exists tr_validate_person_household on public.person;

create trigger tr_validate_person_household
before insert or update on public.person
for each row execute function public.fn_validate_person_household();
```

---

# 4) Query model for Hasura (Views)

Because Hasura struggles with recursive relationships, we provide clean views.

---

## 4.1 View: `public.person_with_responsible_party_v`

Purpose:

* returns each person + their responsible party info
* responsible party is the "household root"

```sql
create or replace view public.person_with_responsible_party_v as
select
  p.id,
  p.clinic_id,
  p.first_name,
  p.last_name,
  p.preferred_name,
  p.dob,
  p.is_active,

  p.responsible_party_id,
  p.household_relationship,

  rp.first_name as responsible_party_first_name,
  rp.last_name as responsible_party_last_name,
  rp.preferred_name as responsible_party_preferred_name

from public.person p
left join public.person rp
  on rp.id = p.responsible_party_id;
```

Track this view in Hasura.

---

## 4.2 View: `public.family_group_v` (the key view)

Purpose:

* returns the resolved "family root" for each person.
* If responsible_party_id is null, root is self.
* If responsible_party_id exists, root is responsible party.

```sql
create or replace view public.family_group_v as
select
  p.id as person_id,
  p.clinic_id,
  coalesce(p.responsible_party_id, p.id) as family_root_person_id
from public.person p;
```

Track this view.

---

## 4.3 View: `public.family_members_v`

Purpose:

* given a person_id, fetch all family members sharing same root.

```sql
create or replace view public.family_members_v as
select
  p2.clinic_id,
  p2.id as person_id,
  fg.family_root_person_id,

  p2.first_name,
  p2.last_name,
  p2.preferred_name,
  p2.dob,

  p2.responsible_party_id,
  p2.household_relationship,

  exists(select 1 from public.patient pat where pat.person_id = p2.id) as is_patient

from public.person p2
join public.family_group_v fg
  on fg.person_id = p2.id;
```

Then in GraphQL you query:

* find family_root_person_id for patient
* query all people where family_root_person_id = X

---

# 5) Hasura function for family search (optional but recommended)

## 5.1 Function: `fn_get_family_members(p_person_id bigint)`

Hasura-friendly composite return.

### Composite type

```sql
create type public.family_member_result as (
  person_id bigint,
  family_root_person_id bigint,
  first_name text,
  last_name text,
  preferred_name text,
  dob date,
  is_patient boolean,
  responsible_party_id bigint,
  household_relationship text
);
```

### Function

```sql
create or replace function public.fn_get_family_members(
  p_person_id bigint
)
returns setof public.family_member_result
language sql
stable
as $$
  with root as (
    select coalesce(responsible_party_id, id) as family_root_person_id
    from public.person
    where id = p_person_id
  )
  select
    p.id,
    (select family_root_person_id from root),
    p.first_name,
    p.last_name,
    p.preferred_name,
    p.dob,
    exists(select 1 from public.patient pat where pat.person_id = p.id) as is_patient,
    p.responsible_party_id,
    p.household_relationship
  from public.person p
  where coalesce(p.responsible_party_id, p.id) = (select family_root_person_id from root)
  order by
    case when p.id = (select family_root_person_id from root) then 0 else 1 end,
    p.last_name asc,
    p.first_name asc;
$$;
```

Track function in Hasura.

---

# 6) How reminders work

When sending reminder for any patient:

### Find contact person

* contact person is the **family root**
* root = `coalesce(patient_person.responsible_party_id, patient_person.id)`

So:

* kids point to mom
* reminders go to mom
* adult patients point to self
* reminders go to them

---

# 7) How billing works

All billing is grouped by:

### `family_root_person_id`

Which is:

* `coalesce(person.responsible_party_id, person.id)`

So all family statements go to the root.

---

# 8) UI Spec: Patient Profile page `/patients/:personId`

## 8.1 Family Panel (must exist)

On the profile page show a card:

### **Family & Billing**

Fields:

**Responsible Party (Primary Contact / Payer)**

* Show resolved responsible party person:

  * if responsible_party_id is null → “Self”
  * else show responsible party name

**Relationship**

* Show dropdown (only enabled if responsible_party_id is not null)
* Values: child/spouse/parent/guardian/other

Buttons:

* `Change Responsible Party`
* `Add Family Member`

---

## 8.2 Family Members list

Under the card show:

### **Family Members**

List all persons in same family group:

* Root first (responsible party)
* Then all dependents

Each row shows:

* Name
* Tag: Patient / Contact
* Relationship label
* Quick open profile button

---

## 8.3 Change Responsible Party modal (key UX)

Modal fields:

**Who is the responsible party for this person?**

* (•) Self (default for adults)
* ( ) Someone else

If “Someone else”:

* searchable dropdown of people in clinic (person search)
* allow “Create new person as responsible party” inline

If responsible party selected:

* relationship dropdown required

Validation rules:

* cannot set responsible party to a person who already has a responsible party
* cannot set responsible party to self

---

## 8.4 Add Family Member flow

Button: “Add Family Member”
Flow:

1. Create person form
2. Ask: is this person a patient?
3. If yes → create patient record
4. Auto set their `responsible_party_id` = current family root
5. Ask relationship dropdown (child/spouse/etc)

---

# 9) Admin safety rule

When changing a responsible party for a person who is already root of others:

If person currently has others pointing to them, you must force staff to decide:

### Option A: Move entire family

* update all dependents to point to the new responsible party
* set current person to also point to new responsible party

### Option B: Block it

* simplest v1: disallow changing responsible_party_id if others depend on them
* show error: “This person is responsible for others. Transfer dependents first.”

Recommendation v1: **block it**, unless explicitly transferring.

---

# 10) Audit requirements

Every change to:

* `person.responsible_party_id`
* `person.household_relationship`

must create `audit.event`:

* `person.household.update`
  payload includes:
* old responsible_party_id
* new responsible_party_id
* old relationship
* new relationship

This will happen automatically via your audit triggers, but Cursor should also add semantic events if you want.

---

# 11) Migration rules (Hasura safe)

Cursor must:

* create new migration version
* never modify applied migrations
* verify applied migrations using:

```bash
pnpm hasura:migrate:status
```

---

# 12) Testing Spec

## DB tests

* cannot assign responsible_party_id to self
* cannot assign responsible_party_id to a person who has responsible_party_id not null
* cannot set responsible_party_id on a person who has dependents
* relationship must be self if responsible_party_id null

## UI tests

* child patient shows responsible party name and relationship dropdown
* adult patient defaults to self
* change responsible party updates family list instantly
* family list renders correct root and dependents

---

# Summary of the final model

### You will store:

* `person.responsible_party_id`
* `person.household_relationship`

### You will NOT store:

* household table
* household_member table

### Grouping key:

`family_root = coalesce(responsible_party_id, id)`

This gives you the simplest possible PMS family model that still supports real-world reminders and billing.
