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

function initializeMockPatients(clinicId: number) {
  if (mockPatients.length > 0) return; // Already initialized

  const patients: Patient[] = [
    {
      id: 1,
      clinic_id: clinicId,
      chart_no: "CH001",
      first_name: "John",
      last_name: "Doe",
      dob: "1980-01-15",
      email: "john.doe@example.com",
      preferred_contact_method: "email",
      default_dentist_id: null,
      default_hygienist_id: null,
      default_assistant_id: null,
      responsible_party_id: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      row_version: 1,
    },
    {
      id: 2,
      clinic_id: clinicId,
      chart_no: "CH002",
      first_name: "Jane",
      last_name: "Smith",
      dob: "1985-05-20",
      email: "jane.smith@example.com",
      preferred_contact_method: "sms",
      default_dentist_id: null,
      default_hygienist_id: null,
      default_assistant_id: null,
      responsible_party_id: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      row_version: 1,
    },
    {
      id: 3,
      clinic_id: clinicId,
      chart_no: "CH003",
      first_name: "Bob",
      last_name: "Johnson",
      dob: "1975-11-10",
      email: "bob.johnson@example.com",
      preferred_contact_method: "phone",
      default_dentist_id: null,
      default_hygienist_id: null,
      default_assistant_id: null,
      responsible_party_id: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      row_version: 1,
    },
    {
      id: 4,
      clinic_id: clinicId,
      chart_no: "CH004",
      first_name: "Alice",
      last_name: "Williams",
      dob: "1990-03-25",
      email: "alice.williams@example.com",
      preferred_contact_method: "email",
      default_dentist_id: null,
      default_hygienist_id: null,
      default_assistant_id: null,
      responsible_party_id: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      row_version: 1,
    },
    {
      id: 5,
      clinic_id: clinicId,
      chart_no: "CH005",
      first_name: "Charlie",
      last_name: "Brown",
      dob: "1988-07-12",
      email: "charlie.brown@example.com",
      preferred_contact_method: "sms",
      default_dentist_id: null,
      default_hygienist_id: null,
      default_assistant_id: null,
      responsible_party_id: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      row_version: 1,
    },
  ];

  mockPatients.push(...patients);
}

function mockGetPatients(clinicId: number, query?: string): Patient[] {
  initializeMockPatients(clinicId);
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
