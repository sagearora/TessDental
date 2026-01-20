import { api } from "./client";
import type { Patient, CreatePatientRequest } from "./types";

export async function getPatients(
  clinicId: number,
  query?: string
): Promise<Patient[]> {
  if (import.meta.env.VITE_USE_MOCK_API === "true") {
    return mockGetPatients(clinicId, query);
  }
  const params = new URLSearchParams({ clinic_id: String(clinicId) });
  if (query) params.append("query", query);
  return api.get<Patient[]>(`/v1/patients?${params}`);
}

export async function createPatient(
  data: CreatePatientRequest
): Promise<Patient> {
  if (import.meta.env.VITE_USE_MOCK_API === "true") {
    return mockCreatePatient(data);
  }
  return api.post<Patient>("/v1/patients", data);
}

// Mock implementation
const mockPatients: Patient[] = [];

function mockGetPatients(clinicId: number, query?: string): Patient[] {
  let results = mockPatients.filter((p) => p.clinic_id === clinicId);
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (p) =>
        p.first_name.toLowerCase().includes(q) ||
        p.last_name.toLowerCase().includes(q) ||
        p.chart_no?.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q)
    );
  }
  return results;
}

function mockCreatePatient(data: CreatePatientRequest): Patient {
  const patient: Patient = {
    id: mockPatients.length + 1,
    clinic_id: data.clinic_id,
    chart_no: data.chart_no ?? null,
    first_name: data.first_name,
    last_name: data.last_name,
    dob: data.dob ?? null,
    email: data.email ?? null,
    preferred_contact_method: data.preferred_contact_method ?? null,
    default_dentist_id: null,
    default_hygienist_id: null,
    default_assistant_id: null,
    responsible_party_id: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    row_version: 1,
  };
  mockPatients.push(patient);
  return patient;
}
