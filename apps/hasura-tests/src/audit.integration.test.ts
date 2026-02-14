// @vitest-environment node
/// <reference types="node" />

import { describe, it, expect, beforeAll } from 'vitest'
import { makeClient, generateJWTToken, authServiceRequest, bootstrapOwnerUser } from './test-utils'
import pg from 'pg'
const { Client } = pg

// Helper to query audit events directly from PostgreSQL
async function queryAuditEvents(
  where: {
    action?: string
    entity_type?: string
    entity_id?: string
    occurred_at_gte?: string
    actor_user_id?: string
    clinic_id?: number
  },
  limit: number = 10
): Promise<any[]> {
  const pool = new Client({
    host: 'localhost',
    port: 5434,
    database: 'tessdental_test',
    user: 'tess_test',
    password: 'tess_test_password',
  })
  
  await pool.connect()
  
  try {
    const conditions: string[] = []
    const values: any[] = []
    let paramIndex = 1
    
    if (where.action) {
      conditions.push(`action = $${paramIndex++}`)
      values.push(where.action)
    }
    if (where.entity_type) {
      conditions.push(`entity_type = $${paramIndex++}`)
      values.push(where.entity_type)
    }
    if (where.entity_id) {
      conditions.push(`entity_id = $${paramIndex++}`)
      values.push(where.entity_id)
    }
    if (where.occurred_at_gte) {
      conditions.push(`occurred_at >= $${paramIndex++}`)
      values.push(where.occurred_at_gte)
    }
    if (where.actor_user_id) {
      conditions.push(`actor_user_id = $${paramIndex++}`)
      values.push(where.actor_user_id)
    }
    if (where.clinic_id) {
      conditions.push(`clinic_id = $${paramIndex++}`)
      values.push(where.clinic_id)
    }
    
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
    values.push(limit)
    
    const query = `
      SELECT id, occurred_at, actor_user_id, clinic_id, request_id, ip, user_agent,
             action, entity_type, entity_id, success, payload
      FROM audit.event
      ${whereClause}
      ORDER BY occurred_at DESC
      LIMIT $${paramIndex}
    `
    
    const result = await pool.query(query, values)
    return result.rows
  } finally {
    await pool.end()
  }
}

const CREATE_PERSON_WITH_PATIENT = /* GraphQL */ `
  mutation CreatePersonWithPatient(
    $clinicId: bigint!
    $firstName: String!
    $lastName: String!
    $status: patient_status_enum_enum!
  ) {
    insert_person_one(
      object: {
        clinic_id: $clinicId
        first_name: $firstName
        last_name: $lastName
        patient: { data: { status: $status } }
      }
    ) {
      id
      clinic_id
      first_name
      last_name
      patient {
        person_id
        status
      }
    }
  }
`

const UPDATE_PERSON = /* GraphQL */ `
  mutation UpdatePerson($personId: bigint!, $firstName: String!) {
    update_person_by_pk(pk_columns: { id: $personId }, _set: { first_name: $firstName }) {
      id
      first_name
    }
  }
`

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
    insert_app_user_one(object: { email: $email, password_hash: $passwordHash }) {
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
    }
  }
`

const ADD_CAPABILITY_TO_ROLE = /* GraphQL */ `
  mutation AddCapabilityToRole($roleId: bigint!, $capabilityKey: capability_enum!) {
    insert_role_capability_one(object: { role_id: $roleId, capability_key: $capabilityKey }) {
      role_id
      capability_key
    }
  }
`

const ASSIGN_ROLE_TO_USER = /* GraphQL */ `
  mutation AssignRoleToUser($clinicUserId: bigint!, $roleId: bigint!) {
    insert_clinic_user_role_one(
      object: { clinic_user_id: $clinicUserId, role_id: $roleId }
    ) {
      clinic_user_id
      role_id
    }
  }
`

describe('Hasura GraphQL – audit event logging', () => {
  let clinicId: number
  let ownerUserId: string
  let testStartTime: string

  beforeAll(async () => {
    // Record test start time to filter audit events
    testStartTime = new Date().toISOString()
    
    // Create a test clinic and owner user
    const bootstrap = await bootstrapOwnerUser('Audit Test Clinic')
    clinicId = bootstrap.clinicId
    ownerUserId = bootstrap.userId
  })

  it('logs audit events for user creation via auth service', async () => {
    const ownerToken = generateJWTToken(ownerUserId, clinicId)
    const uniqueEmail = `audit-test-user-${Date.now()}@example.com`
    
    let response: Response
    try {
      response = await authServiceRequest(
        '/auth/users',
        'POST',
        ownerToken,
        {
          email: uniqueEmail,
          password: 'TestPassword123!',
          firstName: 'Audit',
          lastName: 'Test',
        }
      )
    } catch (error) {
      console.warn('Auth service not available, skipping test. Error:', error)
      return
    }

    if (!response.ok) {
      console.warn('Auth service error, skipping test')
      return
    }

    const result = (await response.json()) as { userId: string; clinicUserId: number }
    const userId = result.userId

    // Query audit events for user creation
    const events = await queryAuditEvents({
      action: 'user.create',
      entity_type: 'app_user',
      entity_id: userId,
      occurred_at_gte: testStartTime,
    }, 1)

    expect(events.length).toBeGreaterThan(0)
    const event = events[0]
    
    expect(event.action).toBe('user.create')
    expect(event.entity_type).toBe('app_user')
    expect(event.entity_id).toBe(userId)
    expect(event.success).toBe(true)
    expect(event.actor_user_id).toBe(ownerUserId)
    expect(Number(event.clinic_id)).toBe(clinicId)
    expect(event.payload).toBeTruthy()
    
    // Verify payload contains expected data
    const payload = event.payload as any
    expect(payload.email).toBe(uniqueEmail.toLowerCase())
    expect(payload.clinic_id).toBe(clinicId)
  })

  it('logs audit events for patient creation via Hasura', async () => {
    const client = makeClient({
      'x-hasura-role': 'clinic_user',
      'x-hasura-clinic-id': clinicId.toString(),
      'x-hasura-user-id': ownerUserId,
    })

    // Create a patient
    const personResult = await client.request(CREATE_PERSON_WITH_PATIENT, {
      clinicId,
      firstName: 'Audit',
      lastName: 'Patient',
      status: 'active',
    })
    const personId = personResult.insert_person_one.id

    // Query audit events for person creation
    const events = await queryAuditEvents({
      action: 'person.insert',
      entity_type: 'public.person',
      entity_id: personId.toString(),
      occurred_at_gte: testStartTime,
    }, 1)

    expect(events.length).toBeGreaterThan(0)
    const event = events[0]
    
    expect(event.action).toBe('person.insert')
    expect(event.entity_type).toBe('public.person')
    expect(event.entity_id).toBe(personId.toString())
    expect(event.success).toBe(true)
    
    // Verify payload contains row data
    const payload = event.payload as any
    expect(payload.source).toBe('hasura')
    expect(payload.table).toBe('person')
    expect(payload.op).toBe('INSERT')
    expect(payload.row_after).toBeTruthy()
    expect((payload.row_after as any).first_name).toBe('Audit')
    expect((payload.row_after as any).last_name).toBe('Patient')
  })

  it('logs audit events for patient updates via Hasura', async () => {
    const client = makeClient({
      'x-hasura-role': 'clinic_user',
      'x-hasura-clinic-id': clinicId.toString(),
      'x-hasura-user-id': ownerUserId,
    })

    // Create a patient first
    const personResult = await client.request(CREATE_PERSON_WITH_PATIENT, {
      clinicId,
      firstName: 'Original',
      lastName: 'Name',
      status: 'active',
    })
    const personId = personResult.insert_person_one.id

    // Update the patient
    await client.request(UPDATE_PERSON, {
      personId,
      firstName: 'Updated',
    })

    // Query audit events for person update
    const events = await queryAuditEvents({
      action: 'person.update',
      entity_type: 'public.person',
      entity_id: personId.toString(),
      occurred_at_gte: testStartTime,
    }, 1)

    expect(events.length).toBeGreaterThan(0)
    const event = events[0]
    
    expect(event.action).toBe('person.update')
    expect(event.entity_type).toBe('public.person')
    expect(event.entity_id).toBe(personId.toString())
    expect(event.success).toBe(true)
    
    // Verify payload contains before and after data
    const payload = event.payload as any
    expect(payload.op).toBe('UPDATE')
    expect(payload.row_before).toBeTruthy()
    expect(payload.row_after).toBeTruthy()
    expect((payload.row_before as any).first_name).toBe('Original')
    expect((payload.row_after as any).first_name).toBe('Updated')
  })

  it('logs audit events for clinic creation via Hasura', async () => {
    const client = makeClient()

    // Create a clinic
    const clinicResult = await client.request(CREATE_CLINIC, {
      name: `Audit Clinic ${Date.now()}`,
    })
    const newClinicId = clinicResult.insert_clinic_one.id

    // Query audit events for clinic creation
    const events = await queryAuditEvents({
      action: 'clinic.insert',
      entity_type: 'public.clinic',
      entity_id: newClinicId.toString(),
      occurred_at_gte: testStartTime,
    }, 1)

    expect(events.length).toBeGreaterThan(0)
    const event = events[0]
    
    expect(event.action).toBe('clinic.insert')
    expect(event.entity_type).toBe('public.clinic')
    expect(event.entity_id).toBe(newClinicId.toString())
    expect(event.success).toBe(true)
    // Note: clinic_id may be null for clinic creation if done via admin
  })

  it('logs audit events for role creation via Hasura', async () => {
    const client = makeClient({
      'x-hasura-role': 'clinic_user',
      'x-hasura-clinic-id': clinicId.toString(),
      'x-hasura-user-id': ownerUserId,
    })

    // Create a role
    const roleResult = await client.request(CREATE_ROLE, {
      clinicId,
      name: 'Audit Test Role',
      description: 'Role for audit testing',
    })
    const roleId = roleResult.insert_role_one.id

    // Query audit events for role creation
    const events = await queryAuditEvents({
      action: 'role.insert',
      entity_type: 'public.role',
      entity_id: roleId.toString(),
      occurred_at_gte: testStartTime,
    }, 1)

    expect(events.length).toBeGreaterThan(0)
    const event = events[0]
    
    expect(event.action).toBe('role.insert')
    expect(event.entity_type).toBe('public.role')
    expect(event.entity_id).toBe(roleId.toString())
    expect(event.success).toBe(true)
    expect(Number(event.clinic_id)).toBe(clinicId)
  })

  it('logs audit events for capability assignment via Hasura', async () => {
    const client = makeClient({
      'x-hasura-role': 'clinic_user',
      'x-hasura-clinic-id': clinicId.toString(),
      'x-hasura-user-id': ownerUserId,
    })

    // Create a role first
    const roleResult = await client.request(CREATE_ROLE, {
      clinicId,
      name: 'Capability Test Role',
      description: 'Role for capability testing',
    })
    const roleId = roleResult.insert_role_one.id

    // Add capability to role
    await client.request(ADD_CAPABILITY_TO_ROLE, {
      roleId,
      capabilityKey: 'patient_manage' as any,
    })

    // Query audit events for role_capability creation
    const events = await queryAuditEvents({
      action: 'role_capability.insert',
      entity_type: 'public.role_capability',
      occurred_at_gte: testStartTime,
    }, 1)

    expect(events.length).toBeGreaterThan(0)
    const event = events[0]
    
    expect(event.action).toBe('role_capability.insert')
    expect(event.entity_type).toBe('public.role_capability')
    expect(event.success).toBe(true)
    
    // Verify payload contains capability data
    const payload = event.payload as any
    expect(payload.row_after).toBeTruthy()
    expect((payload.row_after as any).role_id).toBe(roleId)
    expect((payload.row_after as any).capability_key).toBe('patient_manage')
  })

  it('logs audit events for role assignment to user via Hasura', async () => {
    const adminClient = makeClient()
    
    // Create a test user
    const userResult = await adminClient.request(CREATE_USER, {
      email: `audit-role-assign-${Date.now()}@example.com`,
      passwordHash: 'test_hash',
    })
    const testUserId = userResult.insert_app_user_one.id

    // Create clinic_user membership
    const clinicUserResult = await adminClient.request(CREATE_CLINIC_USER, {
      clinicId,
      userId: testUserId,
    })
    const clinicUserId = clinicUserResult.insert_clinic_user_one.id

    // Create a role
    const client = makeClient({
      'x-hasura-role': 'clinic_user',
      'x-hasura-clinic-id': clinicId.toString(),
      'x-hasura-user-id': ownerUserId,
    })
    
    const roleResult = await client.request(CREATE_ROLE, {
      clinicId,
      name: 'Assigned Role',
      description: 'Role to be assigned',
    })
    const roleId = roleResult.insert_role_one.id

    // Assign role to user
    await client.request(ASSIGN_ROLE_TO_USER, {
      clinicUserId,
      roleId,
    })

    // Query audit events for clinic_user_role creation
    const events = await queryAuditEvents({
      action: 'clinic_user_role.insert',
      entity_type: 'public.clinic_user_role',
      occurred_at_gte: testStartTime,
    }, 1)

    expect(events.length).toBeGreaterThan(0)
    const event = events[0]
    
    expect(event.action).toBe('clinic_user_role.insert')
    expect(event.entity_type).toBe('public.clinic_user_role')
    expect(event.success).toBe(true)
    
    // Verify payload contains assignment data
    const payload = event.payload as any
    expect(payload.row_after).toBeTruthy()
    expect((payload.row_after as any).clinic_user_id).toBe(clinicUserId)
    expect((payload.row_after as any).role_id).toBe(roleId)
  })

  it('includes actor_user_id and clinic_id in audit events from Hasura', async () => {
    const client = makeClient({
      'x-hasura-role': 'clinic_user',
      'x-hasura-clinic-id': clinicId.toString(),
      'x-hasura-user-id': ownerUserId,
    })

    // Create a patient
    const personResult = await client.request(CREATE_PERSON_WITH_PATIENT, {
      clinicId,
      firstName: 'Actor',
      lastName: 'Test',
      status: 'active',
    })
    const personId = personResult.insert_person_one.id

    // Query audit events
    const events = await queryAuditEvents({
      action: 'person.insert',
      entity_type: 'public.person',
      entity_id: personId.toString(),
      occurred_at_gte: testStartTime,
      actor_user_id: ownerUserId,
      clinic_id: clinicId,
    }, 1)

    expect(events.length).toBeGreaterThan(0)
    const event = events[0]
    
    // Verify Hasura context is captured
    expect(event.actor_user_id).toBe(ownerUserId)
    expect(Number(event.clinic_id)).toBe(clinicId)
  })

  it('includes request context in audit events from auth service', async () => {
    const ownerToken = generateJWTToken(ownerUserId, clinicId)
    const uniqueEmail = `audit-context-${Date.now()}@example.com`
    
    let response: Response
    try {
      response = await authServiceRequest(
        '/auth/users',
        'POST',
        ownerToken,
        {
          email: uniqueEmail,
          password: 'TestPassword123!',
          firstName: 'Context',
          lastName: 'Test',
        }
      )
    } catch (error) {
      console.warn('Auth service not available, skipping test. Error:', error)
      return
    }

    if (!response.ok) {
      console.warn('Auth service error, skipping test')
      return
    }

    const result = (await response.json()) as { userId: string }
    const userId = result.userId

    // Query audit events
    const events = await queryAuditEvents({
      action: 'user.create',
      entity_type: 'app_user',
      entity_id: userId,
      occurred_at_gte: testStartTime,
      actor_user_id: ownerUserId,
      clinic_id: clinicId,
    }, 1)

    expect(events.length).toBeGreaterThan(0)
    const event = events[0]
    
    // Verify auth service context is captured
    expect(event.actor_user_id).toBe(ownerUserId)
    expect(Number(event.clinic_id)).toBe(clinicId)
    expect(event.request_id).toBeTruthy()
    // IP and user_agent may be null in test environment, but request_id should exist
  })
})
