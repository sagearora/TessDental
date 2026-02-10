# TessDental Launch Roadmap (Visual Milestones)

## 🚀 Launch Deadline: **March 7**

---

# 🟥 Milestone 1: Core Infra + Imaging Storage (Feb 7 → Feb 10)

**Goal:** the platform can store/serve imaging reliably (NAS-backed) with audit logging.

### Deliverables

✅ Linux Docker host stable
✅ Synology NAS mounted via NFS
✅ `imaging-service` in Docker
✅ Upload → Commit → Stream endpoints
✅ Thumbnails generated + cached
✅ Audit events on upload/view/delete
✅ Works over LAN + works over Tailscale

📌 **Milestone Output:**
**“Images can be stored + served securely through backend.”**

---

# 🟥 Milestone 2: Schick TWAIN Direct Capture (Feb 10 → Feb 14)

**Goal:** web app can trigger sensor capture from operatory workstations.

### Deliverables

✅ Windows Imaging Bridge (per workstation)
✅ Detect Schick TWAIN source
✅ Capture flow (Acquire → Upload → Commit)
✅ Web UI button “Acquire X-Ray”
✅ Progress feedback (WebSocket events)
✅ Failure handling: bridge offline, driver missing
✅ Audit events: capture started/completed/error

📌 **Milestone Output:**
**“Operatories can capture Schick x-rays directly into TessDental.”**

---

# 🟥 Milestone 3: ICD + Electronic Claims Submission (Feb 14 → Feb 18)

**Goal:** claims are submitted electronically through ICD with certificates installed.

### Deliverables

✅ ICD installed on Windows host
✅ CDA Digital IDs installed per dentist
✅ ICD runs as Windows service (correct user context)
✅ `icd-bridge` service runs beside ICD
✅ `claims-service` in Docker on Linux
✅ Claim submission pipeline works end-to-end
✅ Claim response parsing + status updates
✅ Retry/idempotency (no double-submit)
✅ Audit events for every claim lifecycle stage

📌 **Milestone Output:**
**“Claims can be submitted electronically and tracked.”**

---

# 🟥 Milestone 4: Billing + Global Payments + Ledger Skeleton (Feb 18 → Feb 21)

**Goal:** clinic can charge and take payments reliably.

### Deliverables

✅ Invoice + invoice lines
✅ Payment posting + allocation
✅ Global Payments integration (Day-1 method)
✅ Receipts stored + printable later
✅ Audit events for invoice/payment actions
✅ Household/responsible party billing grouping works

📌 **Milestone Output:**
**“Payments + billing work in production.”**

---

# 🟥 Milestone 5: Fee Guide Engine (Feb 20 → Feb 22)

**Goal:** procedures automatically price correctly.

### Deliverables

✅ Fee guide tables
✅ Fee item import tool
✅ Clinic default fee guide selection
✅ Override system
✅ `fn_quote_fee()` returns correct price
✅ UI fee lookup + override editing
✅ Audit events on override changes

📌 **Milestone Output:**
**“Procedure fees are accurate + consistent.”**

---

# 🟧 Milestone 6: Tooth Charting (Feb 22 → Feb 25)

**Goal:** dentists can chart clinically meaningful information.

### Deliverables

✅ Tooth chart events table
✅ Condition/procedure entry model
✅ UI tooth chart (click-to-chart workflow)
✅ Planned vs completed
✅ Procedure links to billing + claims later
✅ Audit event per chart modification

📌 **Milestone Output:**
**“Tooth charting is usable chairside.”**

---

# 🟧 Milestone 7: Perio Charting (Feb 24 → Feb 26)

**Goal:** hygienists can record perio exams.

### Deliverables

✅ Perio exam snapshot model
✅ 6-point chart UI
✅ Compare last exam
✅ Audit events on exam create/update

📌 **Milestone Output:**
**“Perio is usable for hygiene appointments.”**

---

# 🟨 Milestone 8: Patient CRUD + Household + Responsible Party (Feb 24 → Feb 28)

**Goal:** front desk can manage families correctly.

### Deliverables

✅ Patient CRUD
✅ Contacts + addresses
✅ Household membership UI
✅ Primary contact selection
✅ Responsible party selection + apply-to-family
✅ Smart constraints (no loops, no broken family trees)
✅ Audit events on patient edits

📌 **Milestone Output:**
**“Patients and families are manageable with confidence.”**

---

# 🟨 Milestone 9: Scheduler MVP (Feb 26 → Feb 29)

**Goal:** booking/rescheduling/canceling works smoothly.

### Deliverables

✅ Day/week scheduler
✅ Appointment CRUD modal
✅ Provider + operatory selection
✅ Drag/drop reschedule
✅ Appointment status flow
✅ Audit events for appointment lifecycle

📌 **Milestone Output:**
**“Clinic can run a day’s schedule.”**

---

# 🟩 Milestone 10: End-to-End Workflow Completion (Mar 1 → Mar 4)

**Goal:** complete real clinic workflows.

### “Day in the life” workflows must pass:

✅ capture x-ray
✅ chart procedure
✅ generate invoice
✅ take payment
✅ submit claim electronically
✅ verify response
✅ patient record reflects everything
✅ audit timeline is complete

📌 **Milestone Output:**
**“The system behaves like a real PMS.”**

---

# 🟦 Milestone 11: Hardening + Clinic Cutover (Mar 4 → Mar 7)

**Goal:** safe launch.

### Deliverables

✅ Backups verified (DB + NAS + offsite S3)
✅ Restore tested
✅ Staff training walkthrough
✅ Permission roles finalized
✅ Monitoring dashboards (claims queue, imaging bridge status)
✅ Final bug bash + performance checks
✅ Launch day playbook

📌 **Milestone Output:**
**“Safe to run Arora Dental on TessDental.”**

---

# 🏁 Final Launch Definition (March 7)

By March 7, the clinic must be able to:

### Clinical

* chart teeth + perio
* capture Schick imaging directly

### Financial

* apply fee guide pricing
* bill and take payments via Global Payments

### Insurance

* submit claims electronically through ICD

### Admin / Ops

* manage users/roles
* audit everything
* recover from backup if needed

---

# 🔥 Critical Path Summary (Must succeed early)

If these 3 aren’t solved by Feb 18, launch risk skyrockets:

1. **Schick TWAIN capture**
2. **ICD electronic claim submission**
3. **Billing + payments skeleton**

Everything else can be built fast after.

---

If you want, I can turn this into a **real Gantt-style ASCII chart** or a **Notion/Jira-style milestone breakdown** with exact deliverables per day.
