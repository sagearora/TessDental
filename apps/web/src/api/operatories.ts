import { api } from "./client";
import type { Operatory } from "./types";

export async function getOperatories(clinicId: number): Promise<Operatory[]> {
  if (import.meta.env.VITE_USE_MOCK_API === "true") {
    return mockGetOperatories(clinicId);
  }
  try {
    return await api.get<Operatory[]>(`/v1/operatories?clinic_id=${clinicId}`);
  } catch (error) {
    console.error("Failed to fetch operatories:", error);
    throw error;
  }
}

// Mock implementation
function mockGetOperatories(clinicId: number): Operatory[] {
  return [
    {
      id: 1,
      clinic_id: clinicId,
      name: "Op 1",
      short_name: "Op1",
      is_bookable: true,
      provider_id: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      row_version: 1,
    },
    {
      id: 2,
      clinic_id: clinicId,
      name: "Op 2",
      short_name: "Op2",
      is_bookable: true,
      provider_id: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      row_version: 1,
    },
    {
      id: 3,
      clinic_id: clinicId,
      name: "Op 3",
      short_name: "Op3",
      is_bookable: true,
      provider_id: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      row_version: 1,
    },
  ];
}
