# Database Table Statistics and Sample Data

Generated: 2026-02-09T19:47:14Z

---


## audit.event

**Row Count:** 522

### Sample Rows

| id | occurred_at | actor_user_id | clinic_id | request_id | ip | user_agent | action | entity_type | entity_id | success | payload |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2026-02-06 07:22:08.283817+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | 1 | 403fc54d-8c33-4510-8567-d4174e69b252 | ::ffff:172.19.0.1 | Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.... | user.create | app_user | 3897b350-5b17-43ff-bf70-a06abd4fcca3 | t | {"email": "sanya@aroradental.com", "role_ids": [], "clinic_id": 1, "clinic_user_id": "2"} |
| 2 | 2026-02-06 15:12:15.755663+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | 1 | f0f44be1-b42d-42f3-8712-0c80363e6989 | ::ffff:172.19.0.1 | Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.... | role.create | role | 2 | t | {"name": "Front Desk", "clinic_id": 1, "capability_keys": []} |
| 3 | 2026-02-06 16:32:45.233155+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | 1 | 09a7477e-de6d-492b-bc62-f51bfc7a0d94 | ::ffff:172.19.0.1 | Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.... | user.update | app_user | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | t | {"after": {"is_active": true, "last_name": "Arora", "first_name": "Sajal", "password_changed": false... |


## public.address

**Row Count:** 1

### Sample Rows

| id | line1 | line2 | city | region | postal_code | country | created_at | created_by | updated_at | updated_by | is_active |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 34 Cipriano Cr.t | NULL | Brampton | ON | L7A 2M8 | Canada | 2026-02-09 18:44:41.118675+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | 2026-02-09 18:44:41.118675+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | t |


## public.app_user

**Row Count:** 2

### Sample Rows

| id | email | password_hash | first_name | last_name | is_active | created_at | updated_at | current_clinic_id | created_by | updated_by |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 3897b350-5b17-43ff-bf70-a06abd4fcca3 | sanya@aroradental.com | $2a$10$2xGtijWYZbg0IvbS168b8efHY4Ullm/3yhTvkVYBrlqXsLdlWlOLG | Sanya | Arora | t | 2026-02-06 07:22:08.283817+00 | 2026-02-07 03:46:04.591268+00 | 1 | NULL | NULL |
| 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | saj@aroradental.com | $2a$12$A6kRjn9UQQNVGrDsCigbzeU/YBCZeIgfF7bk.HS/QjLtE1ajjx.8W | Saj | Arora | t | 2026-02-06 04:44:57.411957+00 | 2026-02-09 18:09:13.450798+00 | 1 | NULL | NULL |


## public.auth_refresh_token

**Row Count:** 62

### Sample Rows

| id | user_id | token_hash | revoked_at | expires_at | created_at |
| --- | --- | --- | --- | --- | --- |
| 1 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | 086b2d72a37cc76a73ab4cf54d26bda474244d3f462d53baed096175ced80da7 | 2026-02-06 05:45:32.161995+00 | 2026-02-13 05:25:15.757+00 | 2026-02-06 05:25:15.757476+00 |
| 2 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | b8e3a7b2dd696a623f00358bafd51ee286017594bf92a16d1426265c88f4c009 | 2026-02-06 06:05:56.135278+00 | 2026-02-13 05:45:48.802+00 | 2026-02-06 05:45:48.802631+00 |
| 3 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | 765928b1de54054aa2c3866d247736e7af9571422f2322b809570fc91704362e | NULL | 2026-02-13 06:05:56.136+00 | 2026-02-06 06:05:56.136269+00 |


## public.capability

**Row Count:** 7

### Sample Rows

| key | description | module | is_deprecated | created_at |
| --- | --- | --- | --- | --- |
| system.admin | Full administrative access | system | f | 2026-02-06 04:44:57.411957+00 |
| clinic.manage | Manage clinic settings | clinic | f | 2026-02-06 04:44:57.411957+00 |
| users.manage | Manage users, roles, permissions | users | f | 2026-02-06 04:44:57.411957+00 |


## public.clinic

**Row Count:** 1

### Sample Rows

| id | name | timezone | is_active | created_at | updated_at | phone | fax | website | email | address_street | address_unit | address_city | address_province | address_postal | billing_number |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Arora Dental | America/Toronto | t | 2026-02-06 04:44:57.411957+00 | 2026-02-06 04:44:57.411957+00 | 5193402222 | NULL | http://aroradental.com | smile@aroradental.com | 79 Charing Cross St. | NULL | Brantford | ON | N3R 2H5 | NULL |


## public.clinic_hours

**Row Count:** 7

### Sample Rows

| id | clinic_id | day_of_week | is_closed | open_time | close_time | created_at | created_by | updated_at | updated_by | is_active | appointment_start | appointment_end |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 1 | 0 | t | NULL | NULL | 2026-02-07 02:29:54.803128+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | 2026-02-07 04:10:53.167767+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | t | NULL | NULL |
| 2 | 1 | 1 | f | 09:00:00 | 17:00:00 | 2026-02-07 02:29:54.803128+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | 2026-02-07 04:10:53.167767+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | t | 09:00:00 | 15:00:00 |
| 3 | 1 | 2 | f | 09:00:00 | 20:00:00 | 2026-02-07 02:29:54.803128+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | 2026-02-07 04:10:53.167767+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | t | 09:00:00 | 20:00:00 |


## public.clinic_user

**Row Count:** 2

### Sample Rows

| id | clinic_id | user_id | is_active | joined_at | created_at | updated_at | job_title | is_schedulable | provider_kind | default_operatory_id | scheduler_color | created_by | updated_by |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 1 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | t | 2026-02-06 04:44:57.411957+00 | 2026-02-06 04:44:57.411957+00 | 2026-02-07 03:19:38.933215+00 | Owner & Principal Dentist | t | dentist | NULL | NULL | NULL | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 |
| 2 | 1 | 3897b350-5b17-43ff-bf70-a06abd4fcca3 | t | 2026-02-06 07:22:08.283817+00 | 2026-02-06 07:22:08.283817+00 | 2026-02-07 03:31:21.14029+00 | NULL | t | dentist | NULL | NULL | NULL | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 |


## public.clinic_user_role

**Row Count:** 1

### Sample Rows

| clinic_user_id | role_id | created_at |
| --- | --- | --- |
| 1 | 1 | 2026-02-06 04:44:57.411957+00 |


## public.gender_enum

**Row Count:** 3

### Sample Rows

| value | display_name | display_order | is_active | created_at |
| --- | --- | --- | --- | --- |
| male | Male | 1 | t | 2026-02-07 17:45:13.888783+00 |
| female | Female | 2 | t | 2026-02-07 17:45:13.888783+00 |
| other | Other | 3 | t | 2026-02-07 17:45:13.888783+00 |


## public.imaging_asset

**Row Count:** 3

### Sample Rows

| id | study_id | modality | mime_type | size_bytes | sha256 | storage_backend | storage_key | thumb_key | web_key | captured_at | source_device | created_at | created_by | updated_at | updated_by | is_active |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 3 | 4 | PHOTO | image/jpeg | 179673 | 2aa87fb2d8168ecc8845e8dc2e1d73588d1497a73f4f1f566b4004a40117efa0 | s3 | clinic_1/patients/1/studies/4/originals/3_2026-02-09T125714647Z.jpeg | clinic_1/patients/1/studies/4/thumbs/3_thumb.webp | clinic_1/patients/1/studies/4/web/3_2026-02-09T125714647Z_web.webp | 2026-02-09 12:57:14.647+00 | NULL | 2026-02-09 12:57:14.651664+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | 2026-02-09 12:57:14.651664+00 | NULL | t |
| 4 | 5 | PHOTO | image/png | 5644873 | e03820dbd923685b706cbafa9a73abfeb86b020efb4fa88ad5519b116a30e232 | s3 | clinic_1/patients/1/studies/5/originals/4_2026-02-09T125851011Z.png | clinic_1/patients/1/studies/5/thumbs/4_thumb.webp | clinic_1/patients/1/studies/5/web/4_2026-02-09T125851011Z_web.webp | 2026-02-09 12:58:51.011+00 | NULL | 2026-02-09 12:58:51.059465+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | 2026-02-09 12:58:51.059465+00 | NULL | t |
| 5 | 6 | PHOTO | image/jpeg | 1694340 | 341aa77f35fae6333a37a8b2bf2a63c8e3f40a0ae504382444fc9722292785c5 | s3 | clinic_1/patients/1/studies/6/originals/5_2026-02-09T130033149Z.jpeg | clinic_1/patients/1/studies/6/thumbs/5_thumb.webp | clinic_1/patients/1/studies/6/web/5_2026-02-09T130033149Z_web.webp | 2026-02-09 13:00:33.149+00 | NULL | 2026-02-09 13:00:33.164785+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | 2026-02-09 13:06:38.976361+00 | NULL | f |


## public.imaging_study

**Row Count:** 5

### Sample Rows

| id | clinic_id | patient_id | kind | title | captured_at | source | created_at | created_by | updated_at | updated_by | is_active |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2 | 1 | 1 | PHOTO | PHOTO | 2026-02-09 12:53:31.218+00 | manual-upload | 2026-02-09 12:53:31.218421+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | 2026-02-09 12:53:31.218421+00 | NULL | t |
| 3 | 1 | 1 | PHOTO | PHOTO | 2026-02-09 12:53:43.825+00 | manual-upload | 2026-02-09 12:53:43.825372+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | 2026-02-09 12:53:43.825372+00 | NULL | t |
| 4 | 1 | 1 | PHOTO | PHOTO | 2026-02-09 12:57:14.619+00 | manual-upload | 2026-02-09 12:57:14.618919+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | 2026-02-09 12:57:14.618919+00 | NULL | t |


## public.insurance_subscriber

**Row Count:** 0

_No rows in table_


## public.operatory

**Row Count:** 3

### Sample Rows

| id | clinic_id | name | is_bookable | is_active | color | created_at | updated_at | created_by | updated_by |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 1 | OP 1 | t | t | (31,142,100,1) | 2026-02-06 18:59:51.312408+00 | 2026-02-07 02:00:58.409287+00 | NULL | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 |
| 2 | 1 | OP 2 | t | t | (201,19,19,1) | 2026-02-07 02:01:22.543094+00 | 2026-02-07 02:01:22.543094+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 |
| 16 | 1 | OP 3 | t | t | (29,170,83,1) | 2026-02-07 04:12:30.708162+00 | 2026-02-07 04:12:54.822534+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 |


## public.patient

**Row Count:** 6

### Sample Rows

| person_id | chart_no | status | family_doctor_name | family_doctor_phone | imaging_id | is_active | created_at | created_by | updated_at | updated_by |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2 | NULL | archived | NULL | NULL | NULL | t | 2026-02-07 21:21:22.302166+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | 2026-02-07 22:46:51.510645+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 |
| 1 | NULL | active | NULL | NULL | NULL | t | 2026-02-07 06:19:53.853545+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | 2026-02-08 01:14:53.408567+00 | NULL |
| 3 | NULL | active | NULL | NULL | NULL | t | 2026-02-08 02:40:18.544119+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | 2026-02-08 02:40:18.544119+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 |


## public.patient_field_config

**Row Count:** 27

### Sample Rows

| id | clinic_id | field_key | field_label | display_order | is_displayed | is_required | is_active | created_at | created_by | updated_at | updated_by |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2 | 1 | last_name | Last Name | 10 | t | t | t | 2026-02-07 05:01:24.859564+00 | NULL | 2026-02-07 05:57:13.511223+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 |
| 1 | 1 | first_name | First Name | 0 | t | t | t | 2026-02-07 05:01:24.859564+00 | NULL | 2026-02-07 05:57:13.512515+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 |
| 5 | 1 | dob | Date of Birth | 40 | t | f | t | 2026-02-07 05:01:24.859564+00 | NULL | 2026-02-07 05:57:13.515758+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 |


## public.patient_financial

**Row Count:** 2

### Sample Rows

| patient_person_id | created_at | created_by | updated_at | updated_by | is_active |
| --- | --- | --- | --- | --- | --- |
| 2 | 2026-02-07 22:46:51.539551+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | 2026-02-07 22:46:51.539551+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | t |
| 6 | 2026-02-08 03:22:37.425437+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | 2026-02-08 03:23:38.436419+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | t |


## public.patient_referral

**Row Count:** 3

### Sample Rows

| patient_person_id | referral_kind | referral_source_id | referral_contact_person_id | referral_other_text | is_active | created_at | created_by | updated_at | updated_by |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2 | source | 2 | NULL | NULL | t | 2026-02-07 21:21:22.316446+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | 2026-02-07 21:21:22.316446+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 |
| 3 | source | 1 | NULL | NULL | t | 2026-02-08 02:40:18.567959+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | 2026-02-08 02:40:18.567959+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 |
| 4 | source | 1 | NULL | NULL | t | 2026-02-08 02:46:22.587472+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | 2026-02-08 02:46:22.587472+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 |


## public.patient_status_enum

**Row Count:** 5

### Sample Rows

| value | display_name | display_order | is_active | created_at | created_by | updated_at | updated_by |
| --- | --- | --- | --- | --- | --- | --- | --- |
| active | Active | 1 | t | 2026-02-07 22:00:04.235368+00 | NULL | 2026-02-07 22:00:04.235368+00 | NULL |
| inactive | Inactive | 2 | t | 2026-02-07 22:00:04.235368+00 | NULL | 2026-02-07 22:00:04.235368+00 | NULL |
| archived | Archived | 3 | t | 2026-02-07 22:00:04.235368+00 | NULL | 2026-02-07 22:00:04.235368+00 | NULL |


## public.person

**Row Count:** 6

### Sample Rows

| id | clinic_id | first_name | last_name | preferred_name | dob | gender | preferred_language | is_active | created_at | created_by | updated_at | updated_by | responsible_party_id | household_relationship | household_head_id | middle_name | mailing_address_id | billing_address_id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2 | 1 | Saj | Arora | Do not book | 1991-01-04 | male | NULL | t | 2026-02-07 21:21:22.275872+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | 2026-02-09 19:40:42.329003+00 | NULL | 1 | spouse | 1 | NULL | 1 | NULL |
| 1 | 1 | Rebecca | Leitch | NULL | 1991-03-11 | NULL | NULL | t | 2026-02-07 06:19:53.832616+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | 2026-02-09 18:31:38.21215+00 | NULL | NULL | self | NULL | NULL | NULL | NULL |
| 3 | 1 | Tessa | Arora | NULL | 2025-09-18 | female | NULL | t | 2026-02-08 02:40:18.515373+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | 2026-02-09 18:31:38.21215+00 | NULL | NULL | child | 1 | NULL | NULL | NULL |


## public.person_contact_point

**Row Count:** 1

### Sample Rows

| id | person_id | kind | label | value | is_primary | is_active | created_at | created_by | updated_at | updated_by | phone_e164 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2 | phone | Home | 6475372250 | t | t | 2026-02-09 18:44:24.855262+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | 2026-02-09 18:44:24.855262+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | NULL |


## public.person_search

**Row Count:** 6

### Sample Rows

| clinic_id | person_id | dob | chart_no | status | search_text | created_at | created_by | updated_at | updated_by | is_active | display_name |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2 | 1991-01-04 | NULL | archived | saj arora do not book  archived | 2026-02-07 21:21:22.302166+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | 2026-02-09 19:40:42.329003+00 | NULL | t | Saj Do not book Arora |
| 1 | 1 | 1991-03-11 | NULL | active | rebecca leitch  active | 2026-02-07 20:40:03.87251+00 | NULL | 2026-02-09 19:40:42.329003+00 | NULL | t | Rebecca Leitch |
| 1 | 3 | 2025-09-18 | NULL | active | tessa arora  active | 2026-02-08 02:40:18.544119+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | 2026-02-09 19:40:42.329003+00 | NULL | t | Tessa Arora |


## public.referral_kind_enum

**Row Count:** 3

### Sample Rows

| value | display_name | display_order | is_active | created_at |
| --- | --- | --- | --- | --- |
| contact | Contact | 1 | t | 2026-02-07 17:53:37.082328+00 |
| source | Source | 2 | t | 2026-02-07 17:53:37.082328+00 |
| other | Other | 3 | t | 2026-02-07 17:53:37.082328+00 |


## public.referral_source

**Row Count:** 2

### Sample Rows

| id | clinic_id | name | is_active | created_at | created_by | updated_at | updated_by |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 1 | Facebook Ad | t | 2026-02-07 17:57:11.377958+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | 2026-02-07 17:57:11.377958+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 |
| 2 | 1 | Google Search | t | 2026-02-07 17:57:16.746426+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | 2026-02-07 17:57:16.746426+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 |


## public.role

**Row Count:** 3

### Sample Rows

| id | clinic_id | name | description | is_active | created_at | updated_at |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 1 | Owner | Clinic owner / full access | t | 2026-02-06 04:44:57.411957+00 | 2026-02-06 04:44:57.411957+00 |
| 2 | 1 | Front Desk | NULL | t | 2026-02-06 15:12:15.755663+00 | 2026-02-06 15:12:15.755663+00 |
| 3 | 1 | Dentist | NULL | t | 2026-02-07 04:17:51.615117+00 | 2026-02-07 04:17:51.615117+00 |


## public.role_capability

**Row Count:** 9

### Sample Rows

| role_id | capability_key | created_at |
| --- | --- | --- |
| 1 | system.admin | 2026-02-06 04:44:57.411957+00 |
| 1 | clinic.manage | 2026-02-06 04:44:57.411957+00 |
| 1 | users.manage | 2026-02-06 04:44:57.411957+00 |


## public.user_profile

**Row Count:** 2

### Sample Rows

| user_id | user_kind | license_no | scheduler_color | is_active | created_at | created_by | updated_at | updated_by |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | dentist | 114861 | NULL | t | 2026-02-07 03:16:13.865412+00 | NULL | 2026-02-07 03:19:12.207864+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 |
| 3897b350-5b17-43ff-bf70-a06abd4fcca3 | dentist | NULL | NULL | t | 2026-02-07 03:16:13.865412+00 | NULL | 2026-02-07 03:31:31.282063+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 |


## public.user_provider_identifier

**Row Count:** 1

### Sample Rows

| id | user_id | identifier_kind | province_code | license_type | identifier_value | effective_from | effective_to | is_active | created_at | created_by | updated_at | updated_by |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 3897b350-5b17-43ff-bf70-a06abd4fcca3 | cda_uin | ON | general | 361486100 | NULL | NULL | t | 2026-02-07 03:35:50.083022+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 | 2026-02-07 03:44:36.689917+00 | 7f38a509-8afb-45b8-95c1-7ddf0f0f3d79 |

