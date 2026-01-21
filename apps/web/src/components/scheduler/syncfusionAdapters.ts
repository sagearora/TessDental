import type { EventSettingsModel } from "@syncfusion/ej2-react-schedule";
import type { AppointmentWithRelations, Operatory, CreateAppointmentRequest, UpdateAppointmentRequest } from "@/api/types";

/**
 * Syncfusion event interface
 */
export interface SyncfusionEvent {
  Id: number;
  Subject: string;
  StartTime: Date;
  EndTime: Date;
  IsAllDay: boolean;
  OperatoryId: number;
  ProviderId?: number | null;
  PatientId?: number | null;
  Notes?: string | null;
  StatusId: number;
  ConfirmationId?: number | null;
  Tags?: number[];
  // Custom fields
  AppointmentType?: "appointment" | "block";
  Title?: string | null;
  RowVersion?: number;
  TagColor?: string | null; // Color of the first tag for styling
  // Custom display fields
  PatientName?: string | null;
  TagNames?: string; // Comma-separated tag names
  ProcedureCodes?: string; // Comma-separated procedure codes (placeholder for now)
  ConfirmationName?: string | null; // Confirmation status name for border color
}

/**
 * Convert database appointment to Syncfusion event
 */
export function appointmentToSyncfusionEvent(appointment: AppointmentWithRelations): SyncfusionEvent {
  const startTime = new Date(appointment.start_at);
  const endTime = new Date(appointment.end_at);

  // Derive subject from patient name or title
  let subject = "";
  if (appointment.type === "block") {
    subject = appointment.title || "Block";
  } else if (appointment.patient) {
    subject = `${appointment.patient.first_name} ${appointment.patient.last_name}`;
  } else {
    subject = "No Patient";
  }

  // Get the first tag's color for appointment styling
  const firstTag = appointment.tags && appointment.tags.length > 0 ? appointment.tags[0] : null;
  const tagColor = firstTag?.color || null;

  // Get patient name
  const patientName = appointment.patient 
    ? `${appointment.patient.first_name} ${appointment.patient.last_name}`
    : null;

  // Get comma-separated tag names
  const tagNames = appointment.tags && appointment.tags.length > 0
    ? appointment.tags.map(tag => tag.name).join(", ")
    : "";

  // Procedure codes - placeholder for now (will be added when schema is updated)
  const procedureCodes = "";

  // Get confirmation name for border color
  const confirmationName = appointment.confirmation?.name || null;

  return {
    Id: appointment.id,
    Subject: subject,
    StartTime: startTime,
    EndTime: endTime,
    IsAllDay: false,
    OperatoryId: appointment.operatory_id,
    ProviderId: appointment.provider_id,
    PatientId: appointment.patient_id,
    Notes: appointment.notes,
    StatusId: appointment.status_id,
    ConfirmationId: appointment.confirmation_id,
    Tags: appointment.tags?.map((tag) => tag.id) || [],
    AppointmentType: appointment.type,
    Title: appointment.title,
    RowVersion: appointment.row_version,
    TagColor: tagColor,
    PatientName: patientName,
    TagNames: tagNames,
    ProcedureCodes: procedureCodes,
    ConfirmationName: confirmationName,
  };
}

/**
 * Convert Syncfusion event to database create request
 */
export function syncfusionEventToCreateRequest(
  event: Partial<SyncfusionEvent>,
  clinicId: number
): CreateAppointmentRequest {
  const startTime = event.StartTime!;
  const endTime = event.EndTime!;
  const lengthMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));

  return {
    clinic_id: clinicId,
    type: event.AppointmentType || "appointment",
    start_at: startTime.toISOString(),
    length_minutes: lengthMinutes,
    operatory_id: event.OperatoryId!,
    provider_id: event.ProviderId || null,
    patient_id: event.PatientId || null,
    status_id: event.StatusId!,
    confirmation_id: event.ConfirmationId || null,
    title: event.Title || null,
    notes: event.Notes || null,
    source: "front_desk",
  };
}

/**
 * Convert Syncfusion event to database update request
 */
export function syncfusionEventToUpdateRequest(
  event: Partial<SyncfusionEvent>,
  originalAppointment: AppointmentWithRelations
): UpdateAppointmentRequest {
  console.log("syncfusionEventToUpdateRequest - event:", event);
  console.log("syncfusionEventToUpdateRequest - originalAppointment:", originalAppointment);
  
  const updates: UpdateAppointmentRequest = {
    row_version: originalAppointment.row_version,
  };

  // Always update start_at and length_minutes if StartTime/EndTime are provided
  if (event.StartTime) {
    updates.start_at = event.StartTime.toISOString();
    console.log("Setting start_at:", updates.start_at);
  }

  if (event.StartTime && event.EndTime) {
    const lengthMinutes = Math.round((event.EndTime.getTime() - event.StartTime.getTime()) / (1000 * 60));
    updates.length_minutes = lengthMinutes;
    console.log("Setting length_minutes:", lengthMinutes, "from", event.StartTime, "to", event.EndTime);
  }

  if (event.OperatoryId !== undefined && event.OperatoryId !== originalAppointment.operatory_id) {
    updates.operatory_id = event.OperatoryId;
    console.log("Setting operatory_id:", updates.operatory_id);
  }

  if (event.ProviderId !== undefined) {
    updates.provider_id = event.ProviderId;
  }

  if (event.PatientId !== undefined) {
    updates.patient_id = event.PatientId;
  }

  if (event.StatusId !== undefined) {
    updates.status_id = event.StatusId;
  }

  if (event.ConfirmationId !== undefined) {
    updates.confirmation_id = event.ConfirmationId;
  }

  if (event.Title !== undefined) {
    updates.title = event.Title;
  }

  if (event.Notes !== undefined) {
    updates.notes = event.Notes;
  }

  return updates;
}

/**
 * Convert operatories to Syncfusion resource format
 */
export function operatoriesToResources(operatories: Operatory[]) {
  return operatories.map((op) => ({
    id: op.id,
    text: op.name,
    color: (op as any).color || undefined, // Color may not be in type yet
  }));
}
