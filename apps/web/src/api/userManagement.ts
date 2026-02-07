const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:4000'

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('accessToken')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export interface CreateUserRequest {
  email: string
  password: string
  firstName?: string
  lastName?: string
  clinicId?: number
  roleIds?: number[]
  userKind?: 'staff' | 'dentist' | 'hygienist' | 'assistant' | 'manager'
  licenseNo?: string
}

export interface UpdateUserRequest {
  firstName?: string
  lastName?: string
  isActive?: boolean
  password?: string
}

export interface UpdateUserProfileRequest {
  userKind?: 'staff' | 'dentist' | 'hygienist' | 'assistant' | 'manager'
  licenseNo?: string
  schedulerColor?: string
  isActive?: boolean
}

export interface UpdateUserMembershipRequest {
  jobTitle?: string
  isSchedulable?: boolean
  providerKind?: 'dentist' | 'hygienist' | 'assistant' | null
  defaultOperatoryId?: number | null
  schedulerColor?: string
  isActive?: boolean
}

export interface CreateRoleRequest {
  name: string
  description?: string
  capabilityKeys?: string[]
}

export interface UpdateRoleRequest {
  name?: string
  description?: string
  isActive?: boolean
}

// User Management
export async function createUser(data: CreateUserRequest) {
  const response = await fetch(`${AUTH_API_URL}/auth/users`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create user')
  }

  return response.json()
}

export async function updateUser(userId: string, data: UpdateUserRequest) {
  const response = await fetch(`${AUTH_API_URL}/auth/users/${userId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update user')
  }

  return response.json()
}

// Role Management
export async function createRole(clinicId: number, data: CreateRoleRequest) {
  const response = await fetch(`${AUTH_API_URL}/auth/clinics/${clinicId}/roles`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create role')
  }

  return response.json()
}

export async function updateRole(clinicId: number, roleId: number, data: UpdateRoleRequest) {
  const response = await fetch(`${AUTH_API_URL}/auth/clinics/${clinicId}/roles/${roleId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update role')
  }

  return response.json()
}

export async function addCapabilityToRole(clinicId: number, roleId: number, capabilityKey: string) {
  const response = await fetch(
    `${AUTH_API_URL}/auth/clinics/${clinicId}/roles/${roleId}/capabilities`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ capabilityKey }),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to add capability')
  }

  return response.json()
}

export async function removeCapabilityFromRole(
  clinicId: number,
  roleId: number,
  capabilityKey: string
) {
  const response = await fetch(
    `${AUTH_API_URL}/auth/clinics/${clinicId}/roles/${roleId}/capabilities/${capabilityKey}`,
    {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to remove capability')
  }

  return response.json()
}

// User-Role Assignment
export async function assignRoleToUser(clinicId: number, userId: string, roleId: number) {
  const response = await fetch(
    `${AUTH_API_URL}/auth/clinics/${clinicId}/users/${userId}/roles`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ roleId }),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to assign role')
  }

  return response.json()
}

export async function removeRoleFromUser(clinicId: number, userId: string, roleId: number) {
  const response = await fetch(
    `${AUTH_API_URL}/auth/clinics/${clinicId}/users/${userId}/roles/${roleId}`,
    {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to remove role')
  }

  return response.json()
}

// User Profile Management
export async function updateUserProfile(userId: string, data: UpdateUserProfileRequest) {
  const response = await fetch(`${AUTH_API_URL}/auth/users/${userId}/profile`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update user profile')
  }

  return response.json()
}

// User Membership Management
export async function updateUserMembership(
  clinicId: number,
  userId: string,
  data: UpdateUserMembershipRequest
) {
  const response = await fetch(`${AUTH_API_URL}/auth/clinics/${clinicId}/users/${userId}/membership`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update user membership')
  }

  return response.json()
}

// Clinic Management
export interface UpdateClinicRequest {
  name?: string
  timezone?: string
  phone?: string | null
  fax?: string | null
  website?: string | null
  email?: string | null
  addressStreet?: string | null
  addressUnit?: string | null
  addressCity?: string | null
  addressProvince?: string | null
  addressPostal?: string | null
  billingNumber?: string | null
}

export async function updateClinic(clinicId: number, data: UpdateClinicRequest) {
  const response = await fetch(`${AUTH_API_URL}/auth/clinics/${clinicId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update clinic')
  }

  return response.json()
}

// Provider Identifier Management
export interface CreateProviderIdentifierRequest {
  identifierKind?: string
  provinceCode: string
  licenseType: string
  identifierValue: string
  effectiveFrom?: string | null
  effectiveTo?: string | null
  isActive?: boolean
}

export interface UpdateProviderIdentifierRequest {
  provinceCode?: string
  licenseType?: string
  identifierValue?: string
  effectiveFrom?: string | null
  effectiveTo?: string | null
  isActive?: boolean
}

export async function createProviderIdentifier(
  userId: string,
  data: CreateProviderIdentifierRequest
) {
  const response = await fetch(`${AUTH_API_URL}/auth/users/${userId}/provider-identifiers`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create provider identifier')
  }

  return response.json()
}

export async function updateProviderIdentifier(
  identifierId: number,
  data: UpdateProviderIdentifierRequest
) {
  const response = await fetch(`${AUTH_API_URL}/auth/users/provider-identifiers/${identifierId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update provider identifier')
  }

  return response.json()
}

export async function deleteProviderIdentifier(identifierId: number) {
  const response = await fetch(`${AUTH_API_URL}/auth/users/provider-identifiers/${identifierId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete provider identifier')
  }
}
