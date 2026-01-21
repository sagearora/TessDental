import { api } from "./client";
import type {
  Appointment,
  AppointmentWithRelations,
  AppointmentTag,
  AppointmentConfirmation,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
} from "./types";
import { getAppointmentTags, getAppointmentConfirmations } from "./reference";

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
// Map of appointment_id -> tag_ids (simulating appointment_tag_links table)
const mockAppointmentTags: Map<number, number[]> = new Map();

// Initialize mock appointments on first load
function initializeMockAppointments(clinicId: number) {
  // Only initialize if array is empty (first load)
  // This preserves updates made to appointments
  if (mockAppointments.length > 0) {
    console.log("Mock appointments already exist, preserving updates. Count:", mockAppointments.length);
    return;
  }
  
  console.log("Initializing mock appointments for clinic:", clinicId);
  
  // Create appointments for today and the next few days to ensure they show up
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  console.log("Today's date:", today.toISOString());
  
  // Create appointments for today, tomorrow, and day after
  const dates = [
    today,
    new Date(today.getTime() + 24 * 60 * 60 * 1000), // tomorrow
    new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), // day after
  ];
  
  console.log("Creating appointments for dates:", dates.map(d => d.toISOString()));
  
  // Create appointments for today and next few days across all operatories
  // Using local time to avoid timezone issues, then converting to ISO strings
  const appointments: Appointment[] = [];
  
  dates.forEach((date, dateIndex) => {
    const baseId = dateIndex * 6;
    // Op 1 appointments
    appointments.push({
      id: baseId + 1,
      clinic_id: clinicId,
      type: "appointment",
      start_at: new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString(), // 9:00 AM
      length_minutes: 60,
      end_at: new Date(date.getTime() + 10 * 60 * 60 * 1000).toISOString(), // 10:00 AM
      operatory_id: 1,
      provider_id: null,
      patient_id: 1,
      status_id: 1,
      confirmation_id: 1,
      title: null,
      notes: "Mock appointment 1",
      show_on_calendar: true,
      is_online_booking: false,
      is_self_bookable: false,
      booked_at: new Date().toISOString(),
      booked_by_id: null,
      source: "front_desk",
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
    });
    
    appointments.push({
      id: baseId + 2,
      clinic_id: clinicId,
      type: "appointment",
      start_at: new Date(date.getTime() + 11 * 60 * 60 * 1000).toISOString(), // 11:00 AM
      length_minutes: 30,
      end_at: new Date(date.getTime() + 11.5 * 60 * 60 * 1000).toISOString(), // 11:30 AM
      operatory_id: 1,
      provider_id: null,
      patient_id: 2,
      status_id: 2,
      confirmation_id: 3,
      title: null,
      notes: `Mock appointment 2 - Day ${dateIndex + 1}`,
      show_on_calendar: true,
      is_online_booking: false,
      is_self_bookable: false,
      booked_at: new Date().toISOString(),
      booked_by_id: null,
      source: "front_desk",
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
    });
    
    // Op 2 appointments
    appointments.push({
      id: baseId + 3,
      clinic_id: clinicId,
      type: "appointment",
      start_at: new Date(date.getTime() + 10 * 60 * 60 * 1000).toISOString(), // 10:00 AM
      length_minutes: 45,
      end_at: new Date(date.getTime() + 10.75 * 60 * 60 * 1000).toISOString(), // 10:45 AM
      operatory_id: 2,
      provider_id: null,
      patient_id: 3,
      status_id: 1,
      confirmation_id: 1,
      title: null,
      notes: `Mock appointment 3 - Day ${dateIndex + 1}`,
      show_on_calendar: true,
      is_online_booking: false,
      is_self_bookable: false,
      booked_at: new Date().toISOString(),
      booked_by_id: null,
      source: "front_desk",
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
    });
    
    appointments.push({
      id: baseId + 4,
      clinic_id: clinicId,
      type: "appointment",
      start_at: new Date(date.getTime() + 14 * 60 * 60 * 1000).toISOString(), // 2:00 PM
      length_minutes: 60,
      end_at: new Date(date.getTime() + 15 * 60 * 60 * 1000).toISOString(), // 3:00 PM
      operatory_id: 2,
      provider_id: null,
      patient_id: 4,
      status_id: 2,
      confirmation_id: 2, // Left Message
      title: null,
      notes: `Mock appointment 4 - Day ${dateIndex + 1}`,
      show_on_calendar: true,
      is_online_booking: false,
      is_self_bookable: false,
      booked_at: new Date().toISOString(),
      booked_by_id: null,
      source: "front_desk",
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
    });
    
    // Op 3 appointments
    appointments.push({
      id: baseId + 5,
      clinic_id: clinicId,
      type: "block",
      start_at: new Date(date.getTime() + 8 * 60 * 60 * 1000).toISOString(), // 8:00 AM
      length_minutes: 120,
      end_at: new Date(date.getTime() + 10 * 60 * 60 * 1000).toISOString(), // 10:00 AM
      operatory_id: 3,
      provider_id: null,
      patient_id: null,
      status_id: 1,
      confirmation_id: null,
      title: `Block - Maintenance Day ${dateIndex + 1}`,
      notes: "Operatory maintenance",
      show_on_calendar: true,
      is_online_booking: false,
      is_self_bookable: false,
      booked_at: new Date().toISOString(),
      booked_by_id: null,
      source: "front_desk",
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
    });
    
    appointments.push({
      id: baseId + 6,
      clinic_id: clinicId,
      type: "appointment",
      start_at: new Date(date.getTime() + 13 * 60 * 60 * 1000).toISOString(), // 1:00 PM
      length_minutes: 90,
      end_at: new Date(date.getTime() + 14.5 * 60 * 60 * 1000).toISOString(), // 2:30 PM
      operatory_id: 3,
      provider_id: null,
      patient_id: 5,
      status_id: 1,
      confirmation_id: 1,
      title: null,
      notes: `Mock appointment 6 - Day ${dateIndex + 1}`,
      show_on_calendar: true,
      is_online_booking: false,
      is_self_bookable: false,
      booked_at: new Date().toISOString(),
      booked_by_id: null,
      source: "front_desk",
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
    });
  });

  mockAppointments.push(...appointments);
  
  // Assign tags to some appointments (simulating appointment_tag_links)
  // Appointment 1 (baseId + 1): Perio scale, Audited
  appointments.forEach((apt, idx) => {
    const appointmentId = apt.id;
    if (idx % 6 === 0) {
      // First appointment of each day: Perio scale, Audited
      mockAppointmentTags.set(appointmentId, [4]); // Perio scale, Audited
    } else if (idx % 6 === 1) {
      // Second appointment: NPE
      mockAppointmentTags.set(appointmentId, [1]); // NPE
    } else if (idx % 6 === 2) {
      // Third appointment: Recare Exam (6 month)
      mockAppointmentTags.set(appointmentId, [5]); // Recare Exam (6 month)
    } else if (idx % 6 === 3) {
      // Fourth appointment: Crown & Bridge, Restoration
      mockAppointmentTags.set(appointmentId, [8, 9]); // Crown & Bridge, Restoration
    } else if (idx % 6 === 4) {
      // Block booking: no tags
      // mockAppointmentTags.set(appointmentId, []);
    } else if (idx % 6 === 5) {
      // Sixth appointment: Emergency, Endo
      mockAppointmentTags.set(appointmentId, [12, 10]); // Emergency, Endo
    }
  });
  
  console.log("Initialized", mockAppointments.length, "mock appointments:", mockAppointments);
  console.log("Appointment tags mapping:", Array.from(mockAppointmentTags.entries()));
}

async function mockGetAppointments(
  clinicId: number,
  start: string,
  end: string
): Promise<AppointmentWithRelations[]> {
  // Initialize mock appointments only if empty (first time)
  // This preserves any updates made to appointments
  if (mockAppointments.length === 0) {
    initializeMockAppointments(clinicId);
  }
  
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  console.log("=== Mock Appointments Debug ===");
  console.log("Clinic ID:", clinicId);
  console.log("Date range - Start:", start, "End:", end);
  console.log("Start Date:", startDate.toISOString());
  console.log("End Date:", endDate.toISOString());
  console.log("Total mock appointments:", mockAppointments.length);
  console.log("All mock appointments:", mockAppointments);
  
  const filtered = mockAppointments.filter(
    (a) => {
      const appointmentStart = new Date(a.start_at);
      const matchesClinic = a.clinic_id === clinicId;
      const inRange = appointmentStart >= startDate && appointmentStart < endDate;
      const notCancelled = !a.cancelled_at;
      
      console.log(`Appointment ${a.id}:`, {
        clinic_id: a.clinic_id,
        start_at: a.start_at,
        appointmentStart: appointmentStart.toISOString(),
        matchesClinic,
        inRange,
        notCancelled,
        passes: matchesClinic && inRange && notCancelled
      });
      
      return matchesClinic && inRange && notCancelled;
    }
  );
  
  console.log("Filtered appointments:", filtered.length, filtered);
  console.log("=== End Debug ===");
  
  // Get all tags and confirmations for the clinic to enrich appointments
  const allTags = await getAppointmentTags(clinicId);
  const allConfirmations = await getAppointmentConfirmations(clinicId);
  
  // Return appointments with tags and confirmation populated
  return filtered.map((a) => {
    const tagIds = mockAppointmentTags.get(a.id) || [];
    const tags = allTags.filter((tag: AppointmentTag) => tagIds.includes(tag.id));
    const confirmation = a.confirmation_id 
      ? allConfirmations.find((c: AppointmentConfirmation) => c.id === a.confirmation_id)
      : undefined;
    return { ...a, tags, confirmation } as AppointmentWithRelations;
  });
}

function mockCreateAppointment(
  data: CreateAppointmentRequest
): Appointment {
  // Initialize mock appointments if needed
  initializeMockAppointments(data.clinic_id);
  
  const start = new Date(data.start_at);
  const end = new Date(start.getTime() + data.length_minutes * 60 * 1000);
  const appointment: Appointment = {
    id: Math.max(...mockAppointments.map(a => a.id), 0) + 1,
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
  
  // Save tags if provided
  if (data.tag_ids && data.tag_ids.length > 0) {
    mockAppointmentTags.set(appointment.id, data.tag_ids);
  }
  
  return appointment;
}

function mockUpdateAppointment(
  id: number,
  data: UpdateAppointmentRequest
): Appointment {
  console.log("mockUpdateAppointment - Looking for ID:", id);
  console.log("mockUpdateAppointments array length:", mockAppointments.length);
  console.log("Available appointment IDs:", mockAppointments.map(a => a.id));
  
  const appointmentIndex = mockAppointments.findIndex((a) => a.id === id);
  if (appointmentIndex === -1) {
    console.error("Appointment not found! Available IDs:", mockAppointments.map(a => ({ id: a.id, start_at: a.start_at })));
    throw new Error(`Appointment not found: ${id}. Available IDs: ${mockAppointments.map(a => a.id).join(', ')}`);
  }

  const appointment = mockAppointments[appointmentIndex];
  console.log("=== Mock Update Appointment ===");
  console.log("Appointment ID:", id);
  console.log("Original appointment:", { ...appointment });
  console.log("Update data:", data);

  // Update start time and recalculate end time
  if (data.start_at !== undefined) {
    appointment.start_at = data.start_at;
    const start = new Date(data.start_at);
    const length = data.length_minutes ?? appointment.length_minutes;
    appointment.length_minutes = length;
    appointment.end_at = new Date(
      start.getTime() + length * 60 * 1000
    ).toISOString();
    console.log("Updated start_at to:", appointment.start_at);
    console.log("Updated end_at to:", appointment.end_at);
  }
  
  // Update length and recalculate end time (if start_at wasn't provided)
  if (data.length_minutes !== undefined && data.start_at === undefined) {
    appointment.length_minutes = data.length_minutes;
    const start = new Date(appointment.start_at);
    appointment.end_at = new Date(
      start.getTime() + data.length_minutes * 60 * 1000
    ).toISOString();
    console.log("Updated length_minutes to:", appointment.length_minutes);
    console.log("Updated end_at to:", appointment.end_at);
  }
  
  if (data.operatory_id !== undefined) {
    appointment.operatory_id = data.operatory_id;
    console.log("Updated operatory_id to:", appointment.operatory_id);
  }
  if (data.provider_id !== undefined) {
    appointment.provider_id = data.provider_id;
  }
  if (data.patient_id !== undefined) {
    appointment.patient_id = data.patient_id;
  }
  if (data.status_id !== undefined) {
    appointment.status_id = data.status_id;
  }
  if (data.confirmation_id !== undefined) {
    appointment.confirmation_id = data.confirmation_id;
  }
  if (data.title !== undefined) {
    appointment.title = data.title;
  }
  if (data.notes !== undefined) {
    appointment.notes = data.notes;
  }

  // Update tags if provided
  if (data.tag_ids !== undefined) {
    if (data.tag_ids.length > 0) {
      mockAppointmentTags.set(appointment.id, data.tag_ids);
    } else {
      // Remove tags if empty array
      mockAppointmentTags.delete(appointment.id);
    }
  }

  appointment.updated_at = new Date().toISOString();
  appointment.row_version = (data.row_version || appointment.row_version) + 1;
  appointment.last_modified_at = new Date().toISOString();

  // Create a new object to ensure React Query detects the change
  const updatedAppointment = { ...appointment };
  mockAppointments[appointmentIndex] = updatedAppointment;

  console.log("Updated appointment in array:", updatedAppointment);
  console.log("All appointments after update:", mockAppointments.map(a => ({ id: a.id, start_at: a.start_at, operatory_id: a.operatory_id })));
  console.log("=== End Update ===");

  return updatedAppointment;
}

function mockCancelAppointment(id: number): Appointment {
  const appointment = mockAppointments.find((a) => a.id === id);
  if (!appointment) throw new Error("Appointment not found");
  appointment.cancelled_at = new Date().toISOString();
  appointment.updated_at = new Date().toISOString();
  return appointment;
}
