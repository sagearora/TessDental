# TessDental API

NestJS API for TessDental scheduling system.

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables (create `.env` file):
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tessdental
DB_USER=tess
DB_PASSWORD=tess_password_change_me
PORT=3001
```

3. Make sure the database is running:
```bash
# From root directory
pnpm db:up
pnpm db:migrate
```

4. Start the API:
```bash
pnpm dev
```

The API will be available at http://localhost:3001

## API Endpoints

### Health
- `GET /healthz` - Health check

### Operatories
- `GET /v1/operatories?clinic_id=:id` - Get all operatories for a clinic

### Patients
- `GET /v1/patients?clinic_id=:id&query=:query` - Search patients
- `POST /v1/patients` - Create a new patient

### Appointments
- `GET /v1/appointments?clinic_id=:id&start=:iso&end=:iso` - Get appointments in date range
- `POST /v1/appointments` - Create a new appointment
- `PATCH /v1/appointments/:id` - Update an appointment
- `POST /v1/appointments/:id/cancel` - Cancel an appointment

### Reference Data
- `GET /v1/appointment-statuses?clinic_id=:id` - Get appointment statuses
- `GET /v1/appointment-confirmations?clinic_id=:id` - Get appointment confirmations
- `GET /v1/appointment-tags?clinic_id=:id` - Get appointment tags

## Database

The API uses PostgreSQL with raw SQL queries (no ORM). Database connection is managed through the `DatabaseService`.

## CORS

CORS is enabled for all origins in development. Update `main.ts` for production settings.
