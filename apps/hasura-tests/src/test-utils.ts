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
  const expiresIn = 4 * 60 * 60 // 4 hours

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
