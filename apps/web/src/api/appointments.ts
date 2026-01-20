import { api } from "./client";
import type {
  Appointment,
  AppointmentWithRelations,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
} from "./types";

export async function getAppointments(
  clinicId: number,
  start: string,
  end: string
): Promise<AppointmentWithRelations[]> {
  if (import.meta.env.VITE_USE_MOCK_API === "true") {
    return mockGetAppointments(clinicId, start, end);
  }
  const params = new URLSearchParams({
    clinic_id: String(clinicId),
    start,
    end,
  });
  return api.get<AppointmentWithRelations[]>(
    `/v1/appointments?${params}`
  );
}

export async function createAppointment(
  data: CreateAppointmentRequest
): Promise<Appointment> {
  if (import.meta.env.VITE_USE_MOCK_API === "true") {
    return mockCreateAppointment(data);
  }
  return api.post<Appointment>("/v1/appointments", data);
}

export async function updateAppointment(
  id: number,
  data: UpdateAppointmentRequest
): Promise<Appointment> {
  if (import.meta.env.VITE_USE_MOCK_API === "true") {
    return mockUpdateAppointment(id, data);
  }
  return api.patch<Appointment>(`/v1/appointments/${id}`, data);
}

export async function cancelAppointment(id: number): Promise<Appointment> {
  if (import.meta.env.VITE_USE_MOCK_API === "true") {
    return mockCancelAppointment(id);
  }
  return api.post<Appointment>(`/v1/appointments/${id}/cancel`);
}

// Mock implementation
const mockAppointments: Appointment[] = [];

function mockGetAppointments(
  clinicId: number,
  start: string,
  end: string
): AppointmentWithRelations[] {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return mockAppointments
    .filter(
      (a) =>
        a.clinic_id === clinicId &&
        new Date(a.start_at) >= startDate &&
        new Date(a.start_at) < endDate &&
        !a.cancelled_at
    )
    .map((a) => ({ ...a })) as AppointmentWithRelations[];
}

function mockCreateAppointment(
  data: CreateAppointmentRequest
): Appointment {
  const start = new Date(data.start_at);
  const end = new Date(start.getTime() + data.length_minutes * 60 * 1000);
  const appointment: Appointment = {
    id: mockAppointments.length + 1,
    clinic_id: data.clinic_id,
    type: data.type ?? "appointment",
    start_at: data.start_at,
    length_minutes: data.length_minutes,
    end_at: end.toISOString(),
    operatory_id: data.operatory_id,
    provider_id: data.provider_id ?? null,
    patient_id: data.patient_id ?? null,
    status_id: data.status_id,
    confirmation_id: data.confirmation_id ?? null,
    title: data.title ?? null,
    notes: data.notes ?? null,
    show_on_calendar: true,
    is_online_booking: false,
    is_self_bookable: false,
    booked_at: new Date().toISOString(),
    booked_by_id: null,
    source: data.source ?? "front_desk",
    last_modified_at: new Date().toISOString(),
    last_modified_by_id: null,
    cancelled_at: null,
    cancelled_by_id: null,
    cancel_reason: null,
    arrived_at: null,
    seated_at: null,
    completed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    row_version: 1,
  };
  mockAppointments.push(appointment);
  return appointment;
}

function mockUpdateAppointment(
  id: number,
  data: UpdateAppointmentRequest
): Appointment {
  const appointment = mockAppointments.find((a) => a.id === id);
  if (!appointment) throw new Error("Appointment not found");

  if (data.start_at !== undefined) {
    appointment.start_at = data.start_at;
    const start = new Date(data.start_at);
    const length = data.length_minutes ?? appointment.length_minutes;
    appointment.end_at = new Date(
      start.getTime() + length * 60 * 1000
    ).toISOString();
  }
  if (data.length_minutes !== undefined) {
    appointment.length_minutes = data.length_minutes;
    const start = new Date(appointment.start_at);
    appointment.end_at = new Date(
      start.getTime() + data.length_minutes * 60 * 1000
    ).toISOString();
  }
  if (data.operatory_id !== undefined) appointment.operatory_id = data.operatory_id;
  if (data.provider_id !== undefined) appointment.provider_id = data.provider_id;
  if (data.patient_id !== undefined) appointment.patient_id = data.patient_id;
  if (data.status_id !== undefined) appointment.status_id = data.status_id;
  if (data.confirmation_id !== undefined)
    appointment.confirmation_id = data.confirmation_id;
  if (data.title !== undefined) appointment.title = data.title;
  if (data.notes !== undefined) appointment.notes = data.notes;

  appointment.updated_at = new Date().toISOString();
  appointment.row_version = data.row_version + 1;
  appointment.last_modified_at = new Date().toISOString();

  return appointment;
}

function mockCancelAppointment(id: number): Appointment {
  const appointment = mockAppointments.find((a) => a.id === id);
  if (!appointment) throw new Error("Appointment not found");
  appointment.cancelled_at = new Date().toISOString();
  appointment.updated_at = new Date().toISOString();
  return appointment;
}
