import { api } from "./client";
import type {
  AppointmentStatus,
  AppointmentConfirmation,
  AppointmentTag,
} from "./types";

export async function getAppointmentStatuses(
  clinicId: number
): Promise<AppointmentStatus[]> {
  if (import.meta.env.VITE_USE_MOCK_API === "true") {
    return mockGetAppointmentStatuses(clinicId);
  }
  return api.get<AppointmentStatus[]>(
    `/v1/appointment-statuses?clinic_id=${clinicId}`
  );
}

export async function getAppointmentConfirmations(
  clinicId: number
): Promise<AppointmentConfirmation[]> {
  if (import.meta.env.VITE_USE_MOCK_API === "true") {
    return mockGetAppointmentConfirmations(clinicId);
  }
  return api.get<AppointmentConfirmation[]>(
    `/v1/appointment-confirmations?clinic_id=${clinicId}`
  );
}

export async function getAppointmentTags(
  clinicId: number
): Promise<AppointmentTag[]> {
  if (import.meta.env.VITE_USE_MOCK_API === "true") {
    return mockGetAppointmentTags(clinicId);
  }
  return api.get<AppointmentTag[]>(
    `/v1/appointment-tags?clinic_id=${clinicId}`
  );
}

// Mock implementations
function mockGetAppointmentStatuses(clinicId: number): AppointmentStatus[] {
  return [
    {
      id: 1,
      clinic_id: clinicId,
      name: "Scheduled",
      workflow_order: 1,
      color: "#3b82f6",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      row_version: 1,
    },
    {
      id: 2,
      clinic_id: clinicId,
      name: "Confirmed",
      workflow_order: 2,
      color: "#10b981",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      row_version: 1,
    },
    {
      id: 3,
      clinic_id: clinicId,
      name: "Completed",
      workflow_order: 3,
      color: "#6b7280",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      row_version: 1,
    },
    {
      id: 4,
      clinic_id: clinicId,
      name: "Cancelled",
      workflow_order: 4,
      color: "#ef4444",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      row_version: 1,
    },
    {
      id: 5,
      clinic_id: clinicId,
      name: "No-Show",
      workflow_order: 5,
      color: "#f59e0b",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      row_version: 1,
    },
  ];
}

function mockGetAppointmentConfirmations(
  clinicId: number
): AppointmentConfirmation[] {
  return [
    {
      id: 1,
      clinic_id: clinicId,
      name: "Unconfirmed",
      workflow_order: 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      row_version: 1,
    },
    {
      id: 2,
      clinic_id: clinicId,
      name: "Left Message",
      workflow_order: 2,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      row_version: 1,
    },
    {
      id: 3,
      clinic_id: clinicId,
      name: "Confirmed",
      workflow_order: 3,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      row_version: 1,
    },
  ];
}

function mockGetAppointmentTags(clinicId: number): AppointmentTag[] {
  return [
    {
      id: 1,
      clinic_id: clinicId,
      name: "New Patient",
      color: "#8b5cf6",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      row_version: 1,
    },
    {
      id: 2,
      clinic_id: clinicId,
      name: "Cleaning",
      color: "#06b6d4",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      row_version: 1,
    },
    {
      id: 3,
      clinic_id: clinicId,
      name: "Emergency",
      color: "#ef4444",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      row_version: 1,
    },
    {
      id: 4,
      clinic_id: clinicId,
      name: "Crown",
      color: "#f59e0b",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      row_version: 1,
    },
    {
      id: 5,
      clinic_id: clinicId,
      name: "Filling",
      color: "#10b981",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      row_version: 1,
    },
  ];
}
