# TessDental Web - Day Scheduler

Production-quality day scheduler UI for TessDental.

## Features

- **Day Scheduler**: Full-day grid view with all operatories as columns
- **Date Navigation**: Today, prev/next day, date picker
- **Create Appointments**: Click-drag to select time range in an operatory
- **Move Appointments**: Drag-and-drop to change time/operatory
- **Resize Appointments**: Drag top/bottom edge to adjust duration
- **Edit Appointments**: Click to edit patient, provider, status, confirmation, tags, notes
- **Create Patients**: Quick add modal
- **Overlap Handling**: Visual stacking when appointments overlap
- **Timezone Aware**: All times respect clinic timezone

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Start development server:
```bash
pnpm dev
```

The app will be available at http://localhost:3000

## Configuration

### Mock API Mode

By default, the app uses mock API data. To use a real backend:

1. Set `VITE_API_BASE_URL` in `.env`:
```
VITE_API_BASE_URL=http://localhost:3001
```

2. Or disable mock mode:
```
VITE_USE_MOCK_API=false
```

### Environment Variables

- `VITE_API_BASE_URL`: Backend API URL (default: http://localhost:3001)
- `VITE_USE_MOCK_API`: Use mock API (default: true)

## Usage

### Creating an Appointment

1. Click and drag in an empty time slot within an operatory column
2. Release to open the "Create Appointment" modal
3. Fill in patient, provider, status, and other details
4. Click "Create Appointment"

### Moving an Appointment

1. Click and drag an appointment card
2. Drop it in a new time slot or different operatory
3. The appointment will be updated automatically

### Editing an Appointment

1. Click on an appointment card
2. The edit modal will open with all appointment details
3. Make changes and click "Save Changes"

### Creating a Patient

1. Click the "+ Patient" button in the top bar
2. Fill in patient details
3. Click "Create Patient"

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** for build tooling
- **TailwindCSS** for styling
- **shadcn/ui** components
- **@dnd-kit** for drag-and-drop
- **React Query** for server state
- **Zod** + **react-hook-form** for forms
- **date-fns** + **date-fns-tz** for timezone handling
- **React Router** for routing

## Project Structure

```
src/
  api/              # API client and endpoints
  components/
    modals/         # Patient and appointment modals
    scheduler/      # Scheduler components
    ui/             # shadcn/ui components
  lib/              # Utilities (time, toast, etc.)
  pages/            # Page components
```

## API Endpoints

The app expects these endpoints (or uses mocks):

- `GET /v1/operatories?clinic_id=:id`
- `GET /v1/appointments?clinic_id=:id&start=:iso&end=:iso`
- `POST /v1/patients`
- `GET /v1/patients?clinic_id=:id&query=:query`
- `POST /v1/appointments`
- `PATCH /v1/appointments/:id`
- `POST /v1/appointments/:id/cancel`
- `GET /v1/appointment-statuses?clinic_id=:id`
- `GET /v1/appointment-confirmations?clinic_id=:id`
- `GET /v1/appointment-tags?clinic_id=:id`
