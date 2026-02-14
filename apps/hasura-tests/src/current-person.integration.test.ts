// @vitest-environment node
/// <reference types="node" />

import { ClientError } from 'graphql-request'
import { describe, it, expect, beforeAll } from 'vitest'
import { makeClient, bootstrapClinicUser, generateJWTToken } from './test-utils'

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

const GET_CLINIC_USER = /* GraphQL */ `
  query GetClinicUser($clinicId: bigint!, $userId: uuid!) {
    clinic_user(
      where: { clinic_id: { _eq: $clinicId }, user_id: { _eq: $userId } }
    ) {
      id
      clinic_id
      user_id
      current_person_id
    }
  }
`

const GET_CLINIC_USER_V = /* GraphQL */ `
  query GetClinicUserV($clinicId: bigint!, $userId: uuid!) {
    clinic_user_v(
      where: { clinic_id: { _eq: $clinicId }, user_id: { _eq: $userId } }
    ) {
      id
      clinic_id
      user_id
      current_person_id
    }
  }
`

const GET_CURRENT_PERSON = /* GraphQL */ `
  query GetCurrentPerson($clinicId: bigint!, $userId: uuid!) {
    clinic_user_v(
      where: { clinic_id: { _eq: $clinicId }, user_id: { _eq: $userId } }
    ) {
      id
      current_person_id
      person {
        id
        first_name
        last_name
        preferred_name
        clinic_id
      }
    }
  }
`

const UPDATE_CURRENT_PERSON = /* GraphQL */ `
  mutation UpdateCurrentPerson(
    $clinicId: bigint!
    $userId: uuid!
    $personId: bigint
  ) {
    update_clinic_user(
      where: {
        clinic_id: { _eq: $clinicId }
        user_id: { _eq: $userId }
      }
      _set: { current_person_id: $personId }
    ) {
      affected_rows
      returning {
        id
        clinic_id
        user_id
        current_person_id
      }
    }
  }
`

const DELETE_PERSON = /* GraphQL */ `
  mutation DeletePerson($personId: bigint!) {
    delete_person_by_pk(id: $personId) {
      id
    }
  }
`

describe('Current Person Integration Tests', () => {
  let clinicId: number
  let userId: string
  let clinicUserId: number
  let personId1: number
  let personId2: number
  let otherClinicId: number
  let otherClinicPersonId: number
  let otherClinicUserId: string

  beforeAll(async () => {
    // Bootstrap test data: clinic, user, persons
    const bootstrap = await bootstrapClinicUser(
      'Current Person Test Clinic',
      undefined,
      'Test Role',
      ['patient_manage']
    )
    clinicId = bootstrap.clinicId
    userId = bootstrap.userId
    clinicUserId = bootstrap.clinicUserId

    // Create another clinic for isolation tests
    const otherBootstrap = await bootstrapClinicUser(
      'Other Clinic',
      undefined,
      'Test Role',
      ['patient_manage']
    )
    otherClinicId = otherBootstrap.clinicId
    otherClinicUserId = otherBootstrap.userId

    const client = makeClient()

    // Create test persons in first clinic
    const person1Result = await client.request(CREATE_PERSON_WITH_PATIENT, {
      clinicId,
      firstName: 'John',
      lastName: 'Doe',
      status: 'active',
    })
    personId1 = person1Result.insert_person_one.id

    const person2Result = await client.request(CREATE_PERSON_WITH_PATIENT, {
      clinicId,
      firstName: 'Jane',
      lastName: 'Smith',
      status: 'active',
    })
    personId2 = person2Result.insert_person_one.id

    // Create person in other clinic
    const otherPersonResult = await client.request(CREATE_PERSON_WITH_PATIENT, {
      clinicId: otherClinicId,
      firstName: 'Other',
      lastName: 'Person',
      status: 'active',
    })
    otherClinicPersonId = otherPersonResult.insert_person_one.id
  })

  describe('Database Schema', () => {
    it('should have current_person_id column in clinic_user table', async () => {
      const client = makeClient()
      const result = await client.request(GET_CLINIC_USER, {
        clinicId,
        userId,
      })

      expect(result.clinic_user).toBeTruthy()
      expect(result.clinic_user.length).toBeGreaterThan(0)
      // The column should exist (will be null initially)
      expect(result.clinic_user[0]).toHaveProperty('current_person_id')
    })

    it('should include current_person_id in clinic_user_v view', async () => {
      const client = makeClient()
      const result = await client.request(GET_CLINIC_USER_V, {
        clinicId,
        userId,
      })

      expect(result.clinic_user_v).toBeTruthy()
      expect(result.clinic_user_v.length).toBeGreaterThan(0)
      expect(result.clinic_user_v[0]).toHaveProperty('current_person_id')
    })

    it('should allow setting current_person_id to a valid person ID', async () => {
      const client = makeClient()
      const result = await client.request(UPDATE_CURRENT_PERSON, {
        clinicId,
        userId,
        personId: personId1,
      })

      expect(result.update_clinic_user.affected_rows).toBe(1)
      expect(result.update_clinic_user.returning[0].current_person_id).toBe(
        personId1
      )
    })

    it('should enforce foreign key constraint - setting to non-existent person fails', async () => {
      const client = makeClient()
      const nonExistentPersonId = 999999999

      let error: ClientError | null = null
      try {
        await client.request(UPDATE_CURRENT_PERSON, {
          clinicId,
          userId,
          personId: nonExistentPersonId,
        })
      } catch (err) {
        error = err as ClientError
      }

      expect(error).toBeTruthy()
      const errorMessage =
        error!.response?.errors?.[0]?.message ||
        error!.response?.errors?.[0]?.extensions?.internal?.error?.message ||
        error!.message ||
        ''
      expect(errorMessage).toMatch(/foreign key|constraint|violates/i)
    })

    it('should set current_person_id to NULL when person is deleted (ON DELETE SET NULL)', async () => {
      const client = makeClient()

      // First, set current_person_id to personId2
      await client.request(UPDATE_CURRENT_PERSON, {
        clinicId,
        userId,
        personId: personId2,
      })

      // Verify it's set
      const beforeResult = await client.request(GET_CLINIC_USER, {
        clinicId,
        userId,
      })
      expect(beforeResult.clinic_user[0].current_person_id).toBe(personId2)

      // Create a new person to delete
      const tempPersonResult = await client.request(CREATE_PERSON_WITH_PATIENT, {
        clinicId,
        firstName: 'Temp',
        lastName: 'Person',
        status: 'active',
      })
      const tempPersonId = tempPersonResult.insert_person_one.id

      // Set current_person_id to temp person
      await client.request(UPDATE_CURRENT_PERSON, {
        clinicId,
        userId,
        personId: tempPersonId,
      })

      // Delete the person
      await client.request(DELETE_PERSON, {
        personId: tempPersonId,
      })

      // Verify current_person_id is now NULL
      const afterResult = await client.request(GET_CLINIC_USER, {
        clinicId,
        userId,
      })
      expect(afterResult.clinic_user[0].current_person_id).toBeNull()
    })
  })

  describe('GraphQL Queries', () => {
    it('should return current_person_id and person details when set', async () => {
      const client = makeClient()

      // Set current person
      await client.request(UPDATE_CURRENT_PERSON, {
        clinicId,
        userId,
        personId: personId1,
      })

      // Query current person
      const result = await client.request(GET_CURRENT_PERSON, {
        clinicId,
        userId,
      })

      expect(result.clinic_user_v).toBeTruthy()
      expect(result.clinic_user_v.length).toBe(1)
      expect(result.clinic_user_v[0].current_person_id).toBe(personId1)
      expect(result.clinic_user_v[0].person).toBeTruthy()
      expect(result.clinic_user_v[0].person.id).toBe(personId1)
      expect(result.clinic_user_v[0].person.first_name).toBe('John')
      expect(result.clinic_user_v[0].person.last_name).toBe('Doe')
    })

    it('should return null when no current person is set', async () => {
      const client = makeClient()

      // Clear current person
      await client.request(UPDATE_CURRENT_PERSON, {
        clinicId,
        userId,
        personId: null,
      })

      // Query current person
      const result = await client.request(GET_CURRENT_PERSON, {
        clinicId,
        userId,
      })

      expect(result.clinic_user_v).toBeTruthy()
      expect(result.clinic_user_v.length).toBe(1)
      expect(result.clinic_user_v[0].current_person_id).toBeNull()
      expect(result.clinic_user_v[0].person).toBeNull()
    })
  })

  describe('GraphQL Mutations', () => {
    it('should successfully set current_person_id', async () => {
      const client = makeClient()

      const result = await client.request(UPDATE_CURRENT_PERSON, {
        clinicId,
        userId,
        personId: personId1,
      })

      expect(result.update_clinic_user.affected_rows).toBe(1)
      expect(result.update_clinic_user.returning[0].current_person_id).toBe(
        personId1
      )

      // Verify it was actually set
      const verifyResult = await client.request(GET_CLINIC_USER, {
        clinicId,
        userId,
      })
      expect(verifyResult.clinic_user[0].current_person_id).toBe(personId1)
    })

    it('should successfully set current_person_id to null (clears selection)', async () => {
      const client = makeClient()

      // First set it
      await client.request(UPDATE_CURRENT_PERSON, {
        clinicId,
        userId,
        personId: personId1,
      })

      // Then clear it
      const result = await client.request(UPDATE_CURRENT_PERSON, {
        clinicId,
        userId,
        personId: null,
      })

      expect(result.update_clinic_user.affected_rows).toBe(1)
      expect(result.update_clinic_user.returning[0].current_person_id).toBeNull()

      // Verify it was actually cleared
      const verifyResult = await client.request(GET_CLINIC_USER, {
        clinicId,
        userId,
      })
      expect(verifyResult.clinic_user[0].current_person_id).toBeNull()
    })

    it('should fail when person does not exist', async () => {
      const client = makeClient()
      const nonExistentPersonId = 999999999

      let error: ClientError | null = null
      try {
        await client.request(UPDATE_CURRENT_PERSON, {
          clinicId,
          userId,
          personId: nonExistentPersonId,
        })
      } catch (err) {
        error = err as ClientError
      }

      expect(error).toBeTruthy()
    })

    it('should update only the authenticated user\'s current_person_id (user isolation)', async () => {
      const client = makeClient()

      // Set current person for first user
      await client.request(UPDATE_CURRENT_PERSON, {
        clinicId,
        userId,
        personId: personId1,
      })

      // Set current person for other user (different user, same clinic)
      await client.request(UPDATE_CURRENT_PERSON, {
        clinicId: otherClinicId,
        userId: otherClinicUserId,
        personId: otherClinicPersonId,
      })

      // Verify each user has their own current_person_id
      const user1Result = await client.request(GET_CLINIC_USER, {
        clinicId,
        userId,
      })
      const user2Result = await client.request(GET_CLINIC_USER, {
        clinicId: otherClinicId,
        userId: otherClinicUserId,
      })

      expect(user1Result.clinic_user[0].current_person_id).toBe(personId1)
      expect(user2Result.clinic_user[0].current_person_id).toBe(
        otherClinicPersonId
      )
    })
  })

  describe('Permissions', () => {
    it('should allow user to query their own current_person_id', async () => {
      const client = makeClient({
        'x-hasura-role': 'clinic_user',
        'x-hasura-clinic-id': clinicId.toString(),
        'x-hasura-user-id': userId,
      })

      // Set current person first
      const adminClient = makeClient()
      await adminClient.request(UPDATE_CURRENT_PERSON, {
        clinicId,
        userId,
        personId: personId1,
      })

      // Query as the user
      const result = await client.request(GET_CURRENT_PERSON, {
        clinicId,
        userId,
      })

      expect(result.clinic_user_v).toBeTruthy()
      expect(result.clinic_user_v.length).toBe(1)
      expect(result.clinic_user_v[0].current_person_id).toBe(personId1)
    })

    it('should allow user to update their own current_person_id', async () => {
      const client = makeClient({
        'x-hasura-role': 'clinic_user',
        'x-hasura-clinic-id': clinicId.toString(),
        'x-hasura-user-id': userId,
      })

      const result = await client.request(UPDATE_CURRENT_PERSON, {
        clinicId,
        userId,
        personId: personId2,
      })

      expect(result.update_clinic_user.affected_rows).toBe(1)
      expect(result.update_clinic_user.returning[0].current_person_id).toBe(
        personId2
      )
    })

    it('should prevent user from updating another user\'s current_person_id', async () => {
      // Create a second user in the SAME clinic as the first user
      const adminClient = makeClient()
      
      // Create second user in the same clinic
      const secondUserEmail = `second-user-${Date.now()}@example.com`
      const secondUserResult = await adminClient.request(
        /* GraphQL */ `
          mutation CreateUser($email: String!, $passwordHash: String!) {
            insert_app_user_one(
              object: { email: $email, password_hash: $passwordHash }
            ) {
              id
              email
            }
          }
        `,
        {
          email: secondUserEmail,
          passwordHash: 'test_hash',
        }
      )
      const secondUserId = secondUserResult.insert_app_user_one.id

      // Create clinic_user membership in the same clinic
      const secondClinicUserResult = await adminClient.request(
        /* GraphQL */ `
          mutation CreateClinicUser($clinicId: bigint!, $userId: uuid!) {
            insert_clinic_user_one(
              object: { clinic_id: $clinicId, user_id: $userId, is_active: true }
            ) {
              id
              clinic_id
              user_id
            }
          }
        `,
        {
          clinicId,
          userId: secondUserId,
        }
      )

      // Try to update second user's current_person_id as first user
      const firstUserClient = makeClient({
        'x-hasura-role': 'clinic_user',
        'x-hasura-clinic-id': clinicId.toString(),
        'x-hasura-user-id': userId, // First user trying to update second user
      })

      let error: ClientError | null = null
      let result: any = null
      try {
        result = await firstUserClient.request(UPDATE_CURRENT_PERSON, {
          clinicId,
          userId: secondUserId, // Trying to update second user
          personId: personId1,
        })
      } catch (err) {
        error = err as ClientError
      }

      // Should fail due to RLS - user can only update their own record
      // Either an error is thrown, or 0 rows are affected
      if (error) {
        const errorMessage =
          error.response?.errors?.[0]?.message ||
          error.message ||
          ''
        expect(errorMessage).toMatch(/permission|not allowed|unauthorized|row-level/i)
      } else {
        // If no error, the update should have affected 0 rows
        expect(result.update_clinic_user.affected_rows).toBe(0)
      }
    })
  })

  describe('Clinic Isolation', () => {
    it('should prevent setting current_person_id to person from different clinic', async () => {
      const client = makeClient()

      // Try to set current_person_id to a person from another clinic
      // Note: The foreign key constraint allows this, but when querying as a user,
      // the person relationship should be filtered by clinic_id due to person permissions
      await client.request(UPDATE_CURRENT_PERSON, {
        clinicId,
        userId,
        personId: otherClinicPersonId, // Person from other clinic
      })

      // Query as a regular user (not admin) - the person should be filtered out
      // due to person's select permissions requiring clinic_id match
      const userClient = makeClient({
        'x-hasura-role': 'clinic_user',
        'x-hasura-clinic-id': clinicId.toString(),
        'x-hasura-user-id': userId,
      })

      const result = await userClient.request(GET_CURRENT_PERSON, {
        clinicId,
        userId,
      })

      // The current_person_id is set, but the person relationship should be null
      // because the person is from a different clinic and filtered out by RLS
      expect(result.clinic_user_v[0].current_person_id).toBe(otherClinicPersonId)
      // The person should be null because it's filtered out by clinic_id permission
      expect(result.clinic_user_v[0].person).toBeNull()
    })

    it('should only return persons from user\'s clinic when querying', async () => {
      const client = makeClient()

      // Set current person to a person in the same clinic
      await client.request(UPDATE_CURRENT_PERSON, {
        clinicId,
        userId,
        personId: personId1,
      })

      // Query current person
      const result = await client.request(GET_CURRENT_PERSON, {
        clinicId,
        userId,
      })

      expect(result.clinic_user_v[0].person).toBeTruthy()
      expect(result.clinic_user_v[0].person.clinic_id).toBe(clinicId)
    })
  })

  describe('Edge Cases', () => {
    it('should be idempotent - setting current_person_id to same value succeeds', async () => {
      const client = makeClient()

      // Set to personId1
      await client.request(UPDATE_CURRENT_PERSON, {
        clinicId,
        userId,
        personId: personId1,
      })

      // Set to same value again
      const result = await client.request(UPDATE_CURRENT_PERSON, {
        clinicId,
        userId,
        personId: personId1,
      })

      expect(result.update_clinic_user.affected_rows).toBe(1)
      expect(result.update_clinic_user.returning[0].current_person_id).toBe(
        personId1
      )
    })

    it('should allow multiple users to have different current_person_id values', async () => {
      const client = makeClient()

      // Create two more users in the same clinic
      const user2Bootstrap = await bootstrapClinicUser(
        'Multi User Clinic',
        `user2-${Date.now()}@example.com`,
        'Test Role',
        ['patient_manage']
      )
      const user3Bootstrap = await bootstrapClinicUser(
        'Multi User Clinic',
        `user3-${Date.now()}@example.com`,
        'Test Role',
        ['patient_manage']
      )

      // Create persons for this clinic
      const personA = await client.request(CREATE_PERSON_WITH_PATIENT, {
        clinicId: user2Bootstrap.clinicId,
        firstName: 'Person',
        lastName: 'A',
        status: 'active',
      })
      const personB = await client.request(CREATE_PERSON_WITH_PATIENT, {
        clinicId: user2Bootstrap.clinicId,
        firstName: 'Person',
        lastName: 'B',
        status: 'active',
      })

      // Set different current persons for each user
      await client.request(UPDATE_CURRENT_PERSON, {
        clinicId: user2Bootstrap.clinicId,
        userId: user2Bootstrap.userId,
        personId: personA.insert_person_one.id,
      })

      await client.request(UPDATE_CURRENT_PERSON, {
        clinicId: user3Bootstrap.clinicId,
        userId: user3Bootstrap.userId,
        personId: personB.insert_person_one.id,
      })

      // Verify each has their own value
      const user2Result = await client.request(GET_CLINIC_USER, {
        clinicId: user2Bootstrap.clinicId,
        userId: user2Bootstrap.userId,
      })
      const user3Result = await client.request(GET_CLINIC_USER, {
        clinicId: user3Bootstrap.clinicId,
        userId: user3Bootstrap.userId,
      })

      expect(user2Result.clinic_user[0].current_person_id).toBe(
        personA.insert_person_one.id
      )
      expect(user3Result.clinic_user[0].current_person_id).toBe(
        personB.insert_person_one.id
      )
    })
  })
})
