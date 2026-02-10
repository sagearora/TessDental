# Patient Search v2 (Instant, clinic-scoped)

## 0) Goal

Implement patient search that is:

* fast typeahead (<100ms for 10–20k)
* supports search by:

  * first name, last name, preferred name
  * phone number (partial digits)
  * chart number (prefix)
  * email (optional)
* instant updates when a patient/person/contact changes
* safe + clinic-scoped
* works cleanly through Hasura as a **tracked SQL function** for ranked results

---

# 1) DB: Normalize contact points

## 1.1 Add `value_norm` to `public.person_contact_point`

Migration:

```sql
alter table public.person_contact_point
add column if not exists value_norm text;
```

## 1.2 Normalize trigger on contact points

Create:

```sql
create or replace function public.fn_normalize_contact_point()
returns trigger
language plpgsql
as $$
begin
  if NEW.kind = 'phone' then
    NEW.value_norm := regexp_replace(coalesce(NEW.value,''), '\D', '', 'g');
    if length(NEW.value_norm) = 11 and left(NEW.value_norm,1) = '1' then
      NEW.value_norm := substr(NEW.value_norm,2);
    end if;
  elsif NEW.kind = 'email' then
    NEW.value_norm := lower(trim(coalesce(NEW.value,'')));
  else
    NEW.value_norm := null;
  end if;
  return NEW;
end;
$$;

drop trigger if exists tr_normalize_contact_point on public.person_contact_point;
create trigger tr_normalize_contact_point
before insert or update on public.person_contact_point
for each row execute function public.fn_normalize_contact_point();
```

## 1.3 Indexes for normalized lookups

```sql
create index if not exists idx_pcp_phone_norm
on public.person_contact_point (clinic_id, value_norm)
where kind='phone' and is_active=true;

create index if not exists idx_pcp_email_norm
on public.person_contact_point (clinic_id, value_norm)
where kind='email' and is_active=true;
```

---

# 2) DB: Incremental search table (instant)

## 2.1 Enable trigram

```sql
create extension if not exists pg_trgm;
```

## 2.2 Create `public.patient_search` (one row per patient)

```sql
create table if not exists public.patient_search (
  clinic_id bigint not null,
  patient_person_id bigint not null,

  first_name text,
  last_name text,
  preferred_name text,
  dob date,
  chart_no text,
  status text,

  phone_norm text,
  email_norm text,

  search_text text not null,

  created_at timestamptz not null default now(),
  created_by uuid null references public.app_user(id),
  updated_at timestamptz not null default now(),
  updated_by uuid null references public.app_user(id),
  is_active boolean not null default true,

  primary key (clinic_id, patient_person_id)
);
```

### Indexes

```sql
create index if not exists idx_ps_phone on public.patient_search (clinic_id, phone_norm);
create index if not exists idx_ps_chart on public.patient_search (clinic_id, chart_no);
create index if not exists idx_ps_trgm on public.patient_search using gin (search_text gin_trgm_ops);
create index if not exists idx_ps_last_first on public.patient_search (clinic_id, last_name, first_name);
```

### Auditing

Attach your standard triggers to `public.patient_search`:

* `tr_stamp_audit_columns`
* `tr_audit_row_change`

(If you’ve standardized those in `audit.fn_stamp_audit_columns` and `audit.fn_row_change_to_event`, Cursor must attach them here too.)

---

# 3) DB: Rebuild one patient row function

## 3.1 `public.fn_rebuild_patient_search_row(patient_person_id)`

This computes the single search row and upserts it.

```sql
create or replace function public.fn_rebuild_patient_search_row(p_patient_person_id bigint)
returns void
language plpgsql
as $$
declare
  v_clinic_id bigint;
  v_first text;
  v_last text;
  v_pref text;
  v_dob date;
  v_chart text;
  v_status text;
  v_phone text;
  v_email text;
  v_search text;
begin
  select pat.clinic_id, p.first_name, p.last_name, p.preferred_name, p.dob, pat.chart_no, pat.status
  into v_clinic_id, v_first, v_last, v_pref, v_dob, v_chart, v_status
  from public.patient pat
  join public.person p on p.id = pat.person_id
  where pat.person_id = p_patient_person_id
    and pat.is_active = true
    and p.is_active = true;

  if v_clinic_id is null then
    delete from public.patient_search
    where patient_person_id = p_patient_person_id;
    return;
  end if;

  select cp.value_norm
  into v_phone
  from public.person_contact_point cp
  where cp.person_id = p_patient_person_id and cp.kind='phone' and cp.is_active=true
  order by cp.is_primary desc, cp.id asc
  limit 1;

  select cp.value_norm
  into v_email
  from public.person_contact_point cp
  where cp.person_id = p_patient_person_id and cp.kind='email' and cp.is_active=true
  order by cp.is_primary desc, cp.id asc
  limit 1;

  select lower(concat_ws(' ',
    v_first, v_last, v_pref, coalesce(v_chart,''),
    coalesce((
      select string_agg(cp2.value_norm, ' ')
      from public.person_contact_point cp2
      where cp2.person_id = p_patient_person_id and cp2.is_active=true
    ), '')
  )) into v_search;

  insert into public.patient_search (
    clinic_id, patient_person_id,
    first_name, last_name, preferred_name, dob,
    chart_no, status, phone_norm, email_norm,
    search_text, is_active
  )
  values (
    v_clinic_id, p_patient_person_id,
    v_first, v_last, v_pref, v_dob,
    v_chart, v_status, v_phone, v_email,
    coalesce(v_search,''), true
  )
  on conflict (clinic_id, patient_person_id) do update set
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    preferred_name = excluded.preferred_name,
    dob = excluded.dob,
    chart_no = excluded.chart_no,
    status = excluded.status,
    phone_norm = excluded.phone_norm,
    email_norm = excluded.email_norm,
    search_text = excluded.search_text,
    updated_at = now();
end;
$$;
```

---

# 4) DB: Triggers to keep search instant

## 4.1 Person changes

```sql
create or replace function public.fn_person_after_change_rebuild_search()
returns trigger language plpgsql
as $$
begin
  if exists (select 1 from public.patient where person_id = new.id) then
    perform public.fn_rebuild_patient_search_row(new.id);
  end if;
  return null;
end;
$$;

drop trigger if exists tr_person_rebuild_search on public.person;
create trigger tr_person_rebuild_search
after insert or update on public.person
for each row execute function public.fn_person_after_change_rebuild_search();
```

## 4.2 Patient changes

```sql
create or replace function public.fn_patient_after_change_rebuild_search()
returns trigger language plpgsql
as $$
begin
  perform public.fn_rebuild_patient_search_row(new.person_id);
  return null;
end;
$$;

drop trigger if exists tr_patient_rebuild_search on public.patient;
create trigger tr_patient_rebuild_search
after insert or update on public.patient
for each row execute function public.fn_patient_after_change_rebuild_search();
```

## 4.3 Contact point changes (insert/update/delete)

```sql
create or replace function public.fn_contact_point_after_change_rebuild_search()
returns trigger language plpgsql
as $$
declare
  v_person_id bigint := coalesce(new.person_id, old.person_id);
begin
  if exists (select 1 from public.patient where person_id = v_person_id) then
    perform public.fn_rebuild_patient_search_row(v_person_id);
  end if;
  return null;
end;
$$;

drop trigger if exists tr_contact_point_rebuild_search on public.person_contact_point;
create trigger tr_contact_point_rebuild_search
after insert or update or delete on public.person_contact_point
for each row execute function public.fn_contact_point_after_change_rebuild_search();
```

---

# 5) Backfill for existing patients (one-time)

Migration must also populate `patient_search` initially:

```sql
insert into public.patient_search (
  clinic_id, patient_person_id,
  first_name, last_name, preferred_name, dob,
  chart_no, status, phone_norm, email_norm, search_text, is_active
)
select
  ps.clinic_id, ps.person_id, p.first_name, p.last_name, p.preferred_name, p.dob,
  pat.chart_no, pat.status,
  -- best phone
  (select cp.value_norm from public.person_contact_point cp
   where cp.person_id=p.id and cp.kind='phone' and cp.is_active=true
   order by cp.is_primary desc, cp.id asc limit 1),
  -- best email
  (select cp.value_norm from public.person_contact_point cp
   where cp.person_id=p.id and cp.kind='email' and cp.is_active=true
   order by cp.is_primary desc, cp.id asc limit 1),
  lower(concat_ws(' ', p.first_name, p.last_name, p.preferred_name, coalesce(pat.chart_no,''))),
  true
from public.patient pat
join public.person p on p.id = pat.person_id
join (select pat2.clinic_id, pat2.person_id from public.patient pat2) ps
  on ps.person_id = pat.person_id
where pat.is_active=true and p.is_active=true
on conflict do nothing;
```

Cursor may simplify this and just loop:

```sql
select public.fn_rebuild_patient_search_row(person_id) from public.patient;
```

(That’s slower but easiest and fine for 20k.)

---

# 6) Hasura: Expose search via SQL function

## 6.1 Function: `public.fn_search_patients(q text, limit int)`

Clinic scoped using session var `x-hasura-clinic-id` (no client-supplied clinic_id).

### Why

Prevents cross-clinic leakage and keeps API simple.

```sql
create or replace function public.fn_search_patients(
  p_query text,
  p_limit int default 25
)
returns table (
  patient_person_id bigint,
  first_name text,
  last_name text,
  preferred_name text,
  dob date,
  chart_no text,
  status text,
  phone_norm text,
  email_norm text
)
language plpgsql
stable
as $$
declare
  v_clinic_id bigint := nullif(current_setting('hasura.user', true), '')::jsonb->>'x-hasura-clinic-id';
  q text := lower(trim(coalesce(p_query,'')));
  digits text := regexp_replace(coalesce(p_query,''), '\D', '', 'g');
begin
  if v_clinic_id is null then
    raise exception 'missing_clinic_context';
  end if;

  if q = '' then
    return;
  end if;

  -- phone-like query: digits >= 7
  if length(digits) >= 7 then
    return query
    select
      ps.patient_person_id, ps.first_name, ps.last_name, ps.preferred_name, ps.dob,
      ps.chart_no, ps.status, ps.phone_norm, ps.email_norm
    from public.patient_search ps
    where ps.clinic_id = v_clinic_id
      and ps.phone_norm like digits || '%'
    order by ps.phone_norm
    limit p_limit;
    return;
  end if;

  return query
  select
    ps.patient_person_id, ps.first_name, ps.last_name, ps.preferred_name, ps.dob,
    ps.chart_no, ps.status, ps.phone_norm, ps.email_norm
  from public.patient_search ps
  where ps.clinic_id = v_clinic_id
    and (ps.search_text % q or (ps.chart_no is not null and ps.chart_no ilike q || '%'))
  order by
    case when ps.chart_no ilike q || '%' then 0 else 1 end,
    similarity(ps.search_text, q) desc,
    ps.last_name asc,
    ps.first_name asc
  limit p_limit;
end;
$$;
```

**IMPORTANT for Hasura:** Track this function as a Query and allow role `clinic_user` to execute it.

---

# 7) Frontend Search UI spec (React)

## 7.1 Component: `PatientSearchBox`

Location:

* top nav bar
* also used in scheduler sidebar (“Find patient…”)

Behavior:

* input with keyboard navigation
* debounced search (150ms)
* shows dropdown with results
* Enter selects first result
* arrow keys navigate results
* Esc closes dropdown

Result row format:

* `Last, First (Preferred)`
* `DOB` (if exists) + `Chart #` (if exists)
* `Phone` (format from digits)

On select:

* navigate to `/patients/:patient_person_id`
* optionally set global “selected patient”

## 7.2 GraphQL operation file

Create: `apps/web/src/graphql/patientSearch.graphql`

```graphql
query SearchPatients($q: String!, $limit: Int!) {
  fn_search_patients(args: { p_query: $q, p_limit: $limit }) {
    patient_person_id
    first_name
    last_name
    preferred_name
    dob
    chart_no
    status
    phone_norm
    email_norm
  }
}
```

(Adjust Hasura arg naming if it uses `p_query`/`p_limit` directly.)

## 7.3 React Query + Apollo

If you’re using Apollo v4 + codegen:

* generate typed hooks for this query
* implement with `useQuery` and `fetchPolicy: 'network-only'` (optional, but function is fast)

Debounce:

* only query if `q.length >= 2` OR `digits.length >= 4`

---

# 8) Testing (must add now)

## 8.1 DB tests (integration)

Cases:

1. Create person+patient → patient_search row exists immediately
2. Update person last_name → patient_search updates instantly
3. Add phone contact point → phone_norm updates in patient_search instantly
4. Delete phone contact point → patient_search phone_norm changes
5. Search returns expected results:

   * by name partial
   * by phone digits
   * by chart prefix

## 8.2 UI tests (Playwright)

* type “sha” → dropdown shows Sharma
* arrow down + enter selects
* type digits “416500” → phone match works
* fast typing doesn’t spam backend (debounce)

---

# 9) Definition of Done

1. `patient_search` table exists + indexes
2. Triggers keep it in sync on person/patient/contact changes
3. `fn_search_patients` tracked in Hasura and callable for clinic_user
4. Search UI works and navigates to patient profile
5. Auditing:

   * changes to person/patient/contact still log to `audit.event`
   * optional: patient_search changes can be excluded from audit triggers if too noisy (Cursor should ask; default: DO NOT audit patient_search)

---

## One important call: should we audit `patient_search`?

It’s derived data and can spam `audit.event`. Recommendation:

* **do not attach audit-event trigger** to `patient_search`
* do keep stamp trigger optional
* audit should come from the source tables (person/patient/contact_point)

If you agree, tell Cursor:

> “patient_search is derived read model: do NOT log audit.event for it.”
