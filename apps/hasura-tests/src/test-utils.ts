// @vitest-environment node
/// <reference types="node" />

import { GraphQLClient } from 'graphql-request'
import jwt from 'jsonwebtoken'

const HASURA_TEST_GRAPHQL_URL =
  process.env.HASURA_TEST_GRAPHQL_URL || 'http://localhost:8082/v1/graphql'

const ADMIN_SECRET = process.env.HASURA_TEST_ADMIN_SECRET || 'testadminsecret'

// JWT config matching docker-compose.test.yml
const JWT_SECRET = 'testjwtsecret_testjwtsecret_testjwt'
const JWT_ISSUER = 'test-issuer'
const JWT_AUDIENCE = 'test-audience'

/**
 * Creates a GraphQL client for Hasura test instance
 */
export function makeClient(headers: Record<string, string> = {}): GraphQLClient {
  return new GraphQLClient(HASURA_TEST_GRAPHQL_URL, {
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': ADMIN_SECRET,
      ...headers,
    },
  })
}

/**
 * Generates a JWT token for testing with the specified user and clinic
 */
export function generateJWTToken(userId: string, clinicId: number): string {
  const now = Math.floor(Date.now() / 1000)
  const expiresIn = 5 * 60 * 60 // 5 hours

  const claims = {
    sub: userId,
    iat: now,
    exp: now + expiresIn,
    iss: JWT_ISSUER,
    aud: JWT_AUDIENCE,
    'https://hasura.io/jwt/claims': {
      'x-hasura-user-id': userId,
      'x-hasura-clinic-id': String(clinicId),
      'x-hasura-default-role': 'clinic_user',
      'x-hasura-allowed-roles': ['clinic_user'],
    },
  }

  return jwt.sign(claims, JWT_SECRET, {
    algorithm: 'HS256',
  })
}

/**
 * Makes an authenticated request to the auth service
 */
export async function authServiceRequest(
  endpoint: string,
  method: string,
  token: string | null,
  body?: any
): Promise<Response> {
  const AUTH_API_URL = process.env.AUTH_API_URL || 'http://localhost:4001'
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${AUTH_API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  return response
}

/**
 * Makes an authenticated request to the imaging service
 */
export async function imagingServiceRequest(
  endpoint: string,
  method: string,
  token: string | null,
  formData?: FormData
): Promise<Response> {
  const IMAGING_API_URL = process.env.IMAGING_API_URL || 'http://localhost:4011'
  
  const headers: Record<string, string> = {}

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // Don't set Content-Type for FormData - browser will set it with boundary
  if (!formData) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${IMAGING_API_URL}${endpoint}`, {
    method,
    headers,
    body: formData || undefined,
  })

  return response
}

export interface PdfServiceRequestOptions {
  /** Abort the request after this many ms (e.g. to fail fast if PDF generation hangs). */
  timeoutMs?: number
}

/**
 * Makes an authenticated request to the PDF service
 */
export async function pdfServiceRequest(
  endpoint: string,
  method: string,
  token: string | null,
  body?: unknown,
  options?: PdfServiceRequestOptions
): Promise<Response> {
  const PDF_API_URL = process.env.PDF_API_URL || 'http://localhost:4021'

  const headers: Record<string, string> = {}

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  const controller = options?.timeoutMs != null ? new AbortController() : undefined
  const timeoutId =
    controller != null && options?.timeoutMs != null
      ? setTimeout(() => controller.abort(), options.timeoutMs)
      : undefined

  try {
    const response = await fetch(`${PDF_API_URL}${endpoint}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller?.signal,
    })
    if (timeoutId != null) clearTimeout(timeoutId)
    return response
  } catch (e) {
    if (timeoutId != null) clearTimeout(timeoutId)
    throw e
  }
}

/**
 * GraphQL mutations/queries for test setup
 */
const CREATE_CLINIC = /* GraphQL */ `
  mutation CreateClinic($name: String!) {
    insert_clinic_one(object: { name: $name }) {
      id
      name
    }
  }
`

const CREATE_USER = /* GraphQL */ `
  mutation CreateUser($email: String!, $passwordHash: String!) {
    insert_app_user_one(
      object: { email: $email, password_hash: $passwordHash }
    ) {
      id
      email
    }
  }
`

const CREATE_CLINIC_USER = /* GraphQL */ `
  mutation CreateClinicUser($clinicId: bigint!, $userId: uuid!) {
    insert_clinic_user_one(
      object: { clinic_id: $clinicId, user_id: $userId, is_active: true }
    ) {
      id
      clinic_id
      user_id
    }
  }
`

const CREATE_ROLE = /* GraphQL */ `
  mutation CreateRole($clinicId: bigint!, $name: String!, $description: String) {
    insert_role_one(
      object: {
        clinic_id: $clinicId
        name: $name
        description: $description
        is_active: true
      }
    ) {
      id
      clinic_id
      name
      description
    }
  }
`

const ADD_CAPABILITY_TO_ROLE = /* GraphQL */ `
  mutation AddCapabilityToRole($roleId: bigint!, $capabilityKey: capability_enum!) {
    insert_role_capability_one(
      object: { role_id: $roleId, capability_key: $capabilityKey }
    ) {
      role_id
      capability_key
    }
  }
`

const ASSIGN_ROLE_TO_USER = /* GraphQL */ `
  mutation AssignRoleToUser($clinicUserId: bigint!, $roleId: bigint!) {
    insert_clinic_user_role_one(
      object: {
        clinic_user_id: $clinicUserId
        role_id: $roleId
      }
    ) {
      clinic_user_id
      role_id
    }
  }
`

export interface BootstrapUserResult {
  clinicId: number
  userId: string
  clinicUserId: number
  roleId: number
}

/**
 * Bootstraps a test clinic with a user and role having the specified capabilities.
 * This simulates the initial setup/bootstrap process.
 * 
 * @param clinicName - Name for the test clinic
 * @param userEmail - Email for the test user (will be made unique if not provided)
 * @param roleName - Name for the role
 * @param capabilities - Array of capability keys to assign to the role
 * @returns Bootstrap result with IDs
 */
export async function bootstrapClinicUser(
  clinicName: string = 'Test Clinic',
  userEmail?: string,
  roleName: string = 'Test Role',
  capabilities: string[] = []
): Promise<BootstrapUserResult> {
  const client = makeClient()

  // Create test clinic
  const clinicResult = await client.request(CREATE_CLINIC, {
    name: clinicName,
  })
  const clinicId = clinicResult.insert_clinic_one.id

  // Create user
  const email = userEmail || `test-user-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`
  const userResult = await client.request(CREATE_USER, {
    email,
    passwordHash: 'test_hash',
  })
  const userId = userResult.insert_app_user_one.id

  // Create clinic_user membership
  const clinicUserResult = await client.request(CREATE_CLINIC_USER, {
    clinicId,
    userId,
  })
  const clinicUserId = clinicUserResult.insert_clinic_user_one.id

  // Create role
  const roleResult = await client.request(CREATE_ROLE, {
    clinicId,
    name: roleName,
    description: `Test role with capabilities: ${capabilities.join(', ')}`,
  })
  const roleId = roleResult.insert_role_one.id

  // Add capabilities to role
  for (const capability of capabilities) {
    await client.request(ADD_CAPABILITY_TO_ROLE, {
      roleId,
      capabilityKey: capability as any,
    })
  }

  // Assign role to user
  await client.request(ASSIGN_ROLE_TO_USER, {
    clinicUserId,
    roleId,
  })

  return {
    clinicId,
    userId,
    clinicUserId,
    roleId,
  }
}

/**
 * Bootstraps a test clinic with an owner user having all capabilities.
 * This is a convenience function for tests that need a fully-privileged user.
 */
export async function bootstrapOwnerUser(
  clinicName: string = 'Test Clinic'
): Promise<BootstrapUserResult> {
  return bootstrapClinicUser(
    clinicName,
    `owner-${Date.now()}@example.com`,
    'Owner',
    ['system_admin', 'clinic_manage', 'users_manage', 'patient_manage', 'audit_export']
  )
}

const INSERT_PERSON_WITH_PATIENT = /* GraphQL */ `
  mutation InsertPersonWithPatient(
    $clinicId: bigint!
    $firstName: String!
    $lastName: String!
    $preferredName: String
    $status: patient_status_enum_enum!
  ) {
    insert_person_one(
      object: {
        clinic_id: $clinicId
        first_name: $firstName
        last_name: $lastName
        preferred_name: $preferredName
        patient: { data: { status: $status } }
      }
    ) {
      id
    }
  }
`

export interface PdfTestData {
  clinicId: number
  userId: string
  token: string
  personId: number
  assetId: number
  mountId: number
  clinicName: string
  patientDisplayName: string
}

/**
 * Bootstrap clinic + user (with imaging_read, imaging_write), person + patient,
 * upload one asset, create one mount with that asset assigned. For PDF integration tests.
 */
export async function bootstrapPdfTestData(): Promise<PdfTestData> {
  const clinicName = 'PDF Test Clinic'
  const patientDisplayName = 'Print Test Patient'
  const { userId, clinicId } = await bootstrapClinicUser(clinicName, undefined, 'PDF Test Role', [
    'imaging_read',
    'imaging_write',
  ])
  const token = generateJWTToken(userId, clinicId)
  const client = makeClient()

  const personResult = await client.request(INSERT_PERSON_WITH_PATIENT, {
    clinicId,
    firstName: 'Print',
    lastName: 'Test',
    preferredName: patientDisplayName,
    status: 'active',
  })
  const personId = personResult.insert_person_one.id

  const tinyPngBase64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
  const formData = new FormData()
  formData.append('patientId', String(personId))
  formData.append('modality', 'PHOTO')
  formData.append('file', new Blob([Buffer.from(tinyPngBase64, 'base64')], { type: 'image/png' }), 'test.png')

  const uploadRes = await imagingServiceRequest('/imaging/assets/upload', 'POST', token, formData)
  if (!uploadRes.ok) {
    const err = await uploadRes.json().catch(() => ({}))
    throw new Error(`Upload failed: ${uploadRes.status} ${JSON.stringify(err)}`)
  }
  const uploadJson = (await uploadRes.json()) as { assetId: number }
  const assetId = uploadJson.assetId

  const templatesRes = await imagingServiceRequest('/imaging/mount-templates', 'GET', token)
  if (!templatesRes.ok) throw new Error('Failed to list mount templates')
  const templates = (await templatesRes.json()) as Array<{ id: number; slot_definitions?: Array<{ slot_id: string }> }>
  const template = templates[0]
  if (!template) throw new Error('No mount template found')
  const slotId = (template.slot_definitions && template.slot_definitions[0]?.slot_id) || 'slot_1'

  const mountUrl = (process.env.IMAGING_API_URL || 'http://localhost:4011') + '/imaging/mounts'
  const createMountBody = JSON.stringify({
    patientId: Number(personId),
    templateId: Number(template.id),
  })
  const createMountRes3 = await fetch(mountUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: createMountBody,
  })
  if (!createMountRes3.ok) {
    const err = await createMountRes3.json().catch(() => ({}))
    throw new Error(`Create mount failed: ${createMountRes3.status} ${JSON.stringify(err)}`)
  }
  const mountJson = (await createMountRes3.json()) as { mountId?: number; id?: number }
  const mountId = mountJson.mountId ?? mountJson.id
  if (!mountId) throw new Error('Mount response missing id')

  const assignUrl = `${mountUrl}/${mountId}/slots/${encodeURIComponent(slotId)}/assign`
  const assignRes = await fetch(assignUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ assetId: Number(assetId) }),
  })
  if (!assignRes.ok) {
    const err = await assignRes.json().catch(() => ({}))
    throw new Error(`Assign asset to slot failed: ${assignRes.status} ${JSON.stringify(err)}`)
  }

  return {
    clinicId,
    userId,
    token,
    personId,
    assetId,
    mountId,
    clinicName,
    patientDisplayName,
  }
}
