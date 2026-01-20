Implement the TessDental Scheduler UI using Syncfusion EJ2 React Schedule, matching the “Group by Date” demo behavior.

Target behavior:
- Day / Week / WorkWeek views:
  - Group resources (Operatories) by DATE, so each day header appears with all operatories beneath it.
  - This is Syncfusion “Date-wise grouping” using `group.byDate = true`.
- Support drag/drop, resize, and click/drag to create appointments.
- Allow overlapping appointments (Syncfusion supports this by default).
- Use clinic timezone and 12-hour time formatting (configurable).
- Render a right sidebar separately (patient panel + calendar) and keep scheduler in the main panel.

========================
A) Packages + licensing
========================
1) Install npm packages:
- @syncfusion/ej2-base
- @syncfusion/ej2-react-schedule
- @syncfusion/ej2-react-buttons (optional)
- @syncfusion/ej2-react-calendars (optional for sidebar date picker)
- @syncfusion/ej2-react-dropdowns (for patient/tag selects)
- @syncfusion/ej2-react-popups (dialog/editor)

2) Register license key ONCE at app startup:
- import { registerLicense } from '@syncfusion/ej2-base'
- registerLicense(process.env.VITE_SYNCFUSION_LICENSE_KEY)

3) Theme:
- Import Syncfusion CSS (Bootstrap 5 theme if you want to match the demo):
  - @syncfusion/ej2-base/styles/bootstrap5.css
  - @syncfusion/ej2-buttons/styles/bootstrap5.css
  - @syncfusion/ej2-calendars/styles/bootstrap5.css
  - @syncfusion/ej2-dropdowns/styles/bootstrap5.css
  - @syncfusion/ej2-inputs/styles/bootstrap5.css
  - @syncfusion/ej2-navigations/styles/bootstrap5.css
  - @syncfusion/ej2-popups/styles/bootstrap5.css
  - @syncfusion/ej2-react-schedule/styles/bootstrap5.css

========================
B) Layout (match your PMS)
========================
Create a two-panel page:
- Left: Scheduler (flex: 1, min-width 0)
- Right: Sidebar (fixed width ~380–420px)

Scheduler panel:
- Contains a top header row (date nav, view selector)
- Then the Syncfusion ScheduleComponent fills remaining height.

Sidebar:
- Patient panel + mini calendar for date jump
- When user picks a date in sidebar calendar, update scheduler selectedDate.

========================
C) Data modeling (frontend types)
========================
Resource: Operatory
- id: number
- name: string
- color?: string (optional)

Event: Appointment
Map your DB fields to Syncfusion fields:
- Id: appointment.id
- Subject: derived (patient name or title)
- StartTime: start_at (Date)
- EndTime: end_at (Date) OR compute from length_minutes
- IsAllDay: false
- OperatoryId: operatory_id (number)   <-- resource field mapping
- ProviderId: provider_id (optional second resource later)
- PatientId: patient_id (custom field)
- Notes: notes/title, etc
- StatusId: status_id (custom)
- ConfirmationId: confirmation_id (custom)
- Tags: array of tag ids (custom)

========================
D) Scheduler configuration (core requirement)
========================
Implement <ScheduleComponent> with:
- currentView: Day / Week / WorkWeek (and optionally Month)
- selectedDate: controlled state from your page (date navigator + sidebar calendar)
- workHours: start/end based on clinic_hours (optional now, but wire it)
- timeScale:
  - interval: 60 (hour)
  - slotCount: 4 to represent 15-min lines (slotCount = 60 / unitMinutes)
  Example:
    unitMinutes = 15 => interval=60, slotCount=4
    unitMinutes = 10 => interval=60, slotCount=6
    unitMinutes = 5  => interval=60, slotCount=12

Critical: Date-wise resource grouping:
- group={{ byDate: true, resources: ['Operatories'] }}
This is exactly how Syncfusion enables “group by date”. :contentReference[oaicite:1]{index=1}

Resources binding:
- <ResourcesDirective>
    <ResourceDirective
      field="OperatoryId"
      title="Operatory"
      name="Operatories"
      allowMultiple={false}
      dataSource={operatoriesData}
      textField="name"
      idField="id"
      colorField="color"
    />
  </ResourcesDirective>

This gives: per day, show all operatories as sub-columns (the demo behavior). :contentReference[oaicite:2]{index=2}

Views:
- Provide Day, Week, WorkWeek (and Month optionally)
- Inject these services:
  <Inject services={[Day, Week, WorkWeek, Month, Resize, DragAndDrop]} />

========================
E) Creating + editing appointments (UX)
========================
Use Syncfusion built-in interactions:
- Allow cell selection and event creation:
  - allowDragAndDrop={true}
  - allowResizing={true}
  - allowMultiCellSelection={true}

Implement event lifecycle hooks:
- eventCreate: POST /v1/appointments
- eventChange: PATCH /v1/appointments/:id (move/resize/edit)
- eventRemove: POST /v1/appointments/:id/cancel OR PATCH cancelled_at

Key hooks to implement:
- onActionBegin(args):
  - intercept args.requestType:
    - 'eventCreate'
    - 'eventChange'
    - 'eventRemove'
  - call your API and update local state or React Query cache
- onActionFailure(args): show toast, refetch

Override default editor:
- disable built-in editor popup and open your own modal OR customize editor template.
- Minimum viable: use Syncfusion editor, but inject custom fields:
  - patient search
  - confirmation/status dropdown
  - tags multiselect

If you choose to fully own the modal:
- Use eventClick to open a custom dialog with current event data.
- Use cellDoubleClick (or cellClick) to open a create dialog with start/end + operatory prefilled.

========================
F) Pulling data for a date range (performance)
========================
For Week/WorkWeek:
- Compute start/end range of the view
- Fetch appointments for [rangeStart, rangeEnd]
- Feed to Scheduler eventSettings.dataSource

Syncfusion expects Date objects for StartTime/EndTime.

========================
G) Implementation files (Cursor tasks)
========================
Create these files:

1) src/pages/SchedulerPage.tsx
- Two-panel layout
- Holds selectedDate, currentView, clinicId
- Renders <SchedulerMain/> and <SchedulerSidebar/>

2) src/components/scheduler/SchedulerMain.tsx
- Wraps <ScheduleComponent>
- Provides group.byDate + ResourcesDirective
- Implements action hooks to call API

3) src/components/scheduler/syncfusionAdapters.ts
- map DB appointment rows -> Syncfusion event objects
- map Syncfusion event objects -> DB payload for create/update

4) src/components/sidebar/Sidebar.tsx
- Patient selection panel
- Month calendar date picker
- Calls setSelectedDate(date)

5) src/api/*.ts
- operatories, appointments, patients, reference data

========================
H) Acceptance criteria (must match the demo)
========================
- Day view shows: Date header then operatory columns beneath that date.
- Week view shows: each day header with all operatories repeated under it (date-wise grouping).
- Drag appointment to different operatory under same date works.
- Drag appointment to different date (in Week view) works.
- Resize works.
- Overlaps render correctly (no custom overlap algorithm required; scheduler handles).
- Unit grid lines match clinic setting (15 min default, configurable).
- Sidebar calendar changes selected day instantly.

Notes:
- Date-wise grouping is enabled ONLY by `group.byDate = true`. :contentReference[oaicite:3]{index=3}
- Use the Syncfusion “Group by Date” demo as visual reference. :contentReference[oaicite:4]{index=4}
