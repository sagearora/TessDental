// @vitest-environment node
/// <reference types="node" />

import { ClientError } from 'graphql-request'
import { describe, it, expect, beforeAll } from 'vitest'
import { makeClient, bootstrapClinicUser } from './test-utils'
import searchTestData from './data/search-test-data.json'

const GET_USER_CAPABILITIES = /* GraphQL */ `
  query GetUserCapabilities($clinicId: bigint!, $userId: uuid!) {
    clinic_user_effective_capabilities_v(
      where: { clinic_id: { _eq: $clinicId }, user_id: { _eq: $userId } }
    ) {
      capability_key
    }
  }
`

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

const CREATE_PERSON_WITH_HOUSEHOLD_HEAD = /* GraphQL */ `
  mutation CreatePersonWithHouseholdHead(
    $clinicId: bigint!
    $firstName: String!
    $lastName: String!
    $householdHeadId: bigint
    $householdRelationship: household_relationship_enum_enum
    $status: patient_status_enum_enum!
  ) {
    insert_person_one(
      object: {
        clinic_id: $clinicId
        first_name: $firstName
        last_name: $lastName
        household_head_id: $householdHeadId
        household_relationship: $householdRelationship
        patient: { data: { status: $status } }
      }
    ) {
      id
      clinic_id
      first_name
      last_name
      household_head_id
      household_relationship
      patient {
        person_id
        status
      }
    }
  }
`

const CREATE_PERSON_WITH_RESPONSIBLE_PARTY = /* GraphQL */ `
  mutation CreatePersonWithResponsibleParty(
    $clinicId: bigint!
    $firstName: String!
    $lastName: String!
    $responsiblePartyId: bigint
    $status: patient_status_enum_enum!
  ) {
    insert_person_one(
      object: {
        clinic_id: $clinicId
        first_name: $firstName
        last_name: $lastName
        responsible_party_id: $responsiblePartyId
        patient: { data: { status: $status } }
      }
    ) {
      id
      clinic_id
      first_name
      last_name
      responsible_party_id
      patient {
        person_id
        status
      }
    }
  }
`

const UPDATE_PERSON_HOUSEHOLD_HEAD = /* GraphQL */ `
  mutation UpdatePersonHouseholdHead(
    $personId: bigint!
    $householdHeadId: bigint
    $householdRelationship: household_relationship_enum_enum
  ) {
    update_person_by_pk(
      pk_columns: { id: $personId }
      _set: {
        household_head_id: $householdHeadId
        household_relationship: $householdRelationship
      }
    ) {
      id
      household_head_id
      household_relationship
    }
  }
`

const GET_PERSON = /* GraphQL */ `
  query GetPerson($personId: bigint!) {
    person_by_pk(id: $personId) {
      id
      household_head_id
      household_relationship
    }
  }
`

const SEARCH_PATIENTS = /* GraphQL */ `
  query SearchPatients($where: person_bool_exp!, $limit: Int!) {
    person(
      where: $where
      limit: $limit
      order_by: [{ last_name: asc }, { first_name: asc }]
    ) {
      id
      household_head_id
      household_head {
        id
        first_name
        last_name
        preferred_name
      }
      responsible_party_id
      first_name
      last_name
      preferred_name
      dob
      patient {
        status
        chart_no
      }
      person_contact_point(
        where: { kind: { _in: [cell_phone, home_phone, work_phone] }, is_active: { _eq: true } }
        order_by: { is_primary: desc }
        limit: 1
      ) {
        value
      }
    }
  }
`

const CREATE_PERSON_WITH_CONTACT = /* GraphQL */ `
  mutation CreatePersonWithContact(
    $clinicId: bigint!
    $firstName: String!
    $lastName: String!
    $middleName: String
    $preferredName: String
    $status: patient_status_enum_enum!
    $chartNo: String
    $contactKind: contact_kind_enum_enum!
    $contactValue: citext!
    $contactPhoneE164: String
  ) {
    insert_person_one(
      object: {
        clinic_id: $clinicId
        first_name: $firstName
        last_name: $lastName
        middle_name: $middleName
        preferred_name: $preferredName
        patient: {
          data: {
            status: $status
            chart_no: $chartNo
          }
        }
        person_contact_point: {
          data: {
            kind: $contactKind
            value: $contactValue
            phone_e164: $contactPhoneE164
            is_primary: true
            is_active: true
          }
        }
      }
    ) {
      id
      first_name
      last_name
      middle_name
      preferred_name
      patient {
        chart_no
        status
      }
      person_contact_point {
        kind
        value
        value_norm
        phone_e164
        phone_last10
      }
    }
  }
`

describe('Hasura GraphQL – person/permissions', () => {
  let clinicId: number

  // Set up test data before running tests
  beforeAll(async () => {
    // Create a test clinic (we just need the clinic, not a user)
    const bootstrap = await bootstrapClinicUser('Test Clinic', undefined, 'Dummy Role', [])
    clinicId = bootstrap.clinicId
  })

  it('allows creating a patient as admin (bypassing row-level permissions)', async () => {
    const client = makeClient()

    const result = await client.request(CREATE_PERSON_WITH_PATIENT, {
      clinicId,
      firstName: 'Integration',
      lastName: 'AdminPatient',
      status: 'active',
    })

    expect(result.insert_person_one).toBeTruthy()
    expect(result.insert_person_one.patient.status).toBe('active')
  })

  it('allows creating a patient as clinic_user with patient_manage capability', async () => {
    // Create a user with patient_manage capability using shared bootstrap
    const bootstrap = await bootstrapClinicUser(
      'Test Clinic',
      `test-with-patient-manage-${Date.now()}@example.com`,
      'Patient Manager',
      ['patient_manage']
    )
    const userId = bootstrap.userId

    // Verify user has patient_manage capability
    const client = makeClient()
    const capabilitiesResult = await client.request(GET_USER_CAPABILITIES, {
      clinicId: bootstrap.clinicId,
      userId,
    })
    const capabilityKeys = capabilitiesResult.clinic_user_effective_capabilities_v.map(
      (c: any) => c.capability_key
    )
    expect(capabilityKeys).toContain('patient_manage')

    // Now try to create a patient as this user (who has patient_manage)
    const clientAsUser = makeClient({
      'x-hasura-role': 'clinic_user',
      'x-hasura-clinic-id': bootstrap.clinicId.toString(),
      'x-hasura-user-id': userId,
    })

    const result = await clientAsUser.request(CREATE_PERSON_WITH_PATIENT, {
      clinicId: bootstrap.clinicId,
      firstName: 'Integration',
      lastName: 'AllowedPatient',
      status: 'active',
    })

    expect(result.insert_person_one).toBeTruthy()
    expect(result.insert_person_one.patient.status).toBe('active')
  })

  it('denies creating a patient as clinic_user without patient_manage capability', async () => {
    // Create a user without patient_manage capability (only users_manage) using shared bootstrap
    const bootstrap = await bootstrapClinicUser(
      'Test Clinic',
      `test-no-patient-manage-${Date.now()}@example.com`,
      'User Manager',
      ['users_manage']
    )
    const userId = bootstrap.userId

    // Verify user does NOT have patient_manage capability
    const client = makeClient()
    const capabilitiesResult = await client.request(GET_USER_CAPABILITIES, {
      clinicId: bootstrap.clinicId,
      userId,
    })
    const capabilityKeys = capabilitiesResult.clinic_user_effective_capabilities_v.map(
      (c: any) => c.capability_key
    )
    expect(capabilityKeys).not.toContain('patient_manage')
    expect(capabilityKeys).toContain('users_manage')

    // Now try to create a patient as this user (who lacks patient_manage)
    const clientAsUser = makeClient({
      'x-hasura-role': 'clinic_user',
      'x-hasura-clinic-id': bootstrap.clinicId.toString(),
      'x-hasura-user-id': userId,
    })

    let error: ClientError | null = null

    try {
      await clientAsUser.request(CREATE_PERSON_WITH_PATIENT, {
        clinicId: bootstrap.clinicId,
        firstName: 'Integration',
        lastName: 'DeniedPatient',
        status: 'active',
      })
    } catch (err) {
      error = err as ClientError
    }

    expect(error).toBeTruthy()
    // Check for error message in response.errors or error.message
    const errorMessage =
      error!.response?.errors?.[0]?.message || error!.message || ''
    expect(errorMessage).toMatch(/permission|not allowed|unauthorized/i)
  })

  it('prevents chaining household_head_id (cannot reference a person that already has a household_head_id)', async () => {
    const client = makeClient()

    // Step 1: Create a household head (person with household_head_id = null)
    const headResult = await client.request(CREATE_PERSON_WITH_PATIENT, {
      clinicId,
      firstName: 'Household',
      lastName: 'Head',
      status: 'active',
    })
    const headPersonId = headResult.insert_person_one.id

    // Step 2: Create a person that references the household head
    const memberResult = await client.request(CREATE_PERSON_WITH_HOUSEHOLD_HEAD, {
      clinicId,
      firstName: 'Household',
      lastName: 'Member',
      householdHeadId: headPersonId,
      householdRelationship: 'child',
      status: 'active',
    })
    const memberPersonId = memberResult.insert_person_one.id

    // Verify the member was created correctly
    expect(memberResult.insert_person_one.household_head_id).toBe(headPersonId)
    expect(memberResult.insert_person_one.household_relationship).toBe('child')

    // Step 3: Try to create another person that references the member
    // (who already has a household_head_id) - this should fail
    let error: ClientError | null = null

    try {
      await client.request(CREATE_PERSON_WITH_HOUSEHOLD_HEAD, {
        clinicId,
        firstName: 'Chained',
        lastName: 'Person',
        householdHeadId: memberPersonId, // This person already has household_head_id set
        householdRelationship: 'child',
        status: 'active',
      })
    } catch (err) {
      error = err as ClientError
    }

    expect(error).toBeTruthy()
    
    // Check for error message in various possible locations
    const errorResponse = error!.response
    const internalError = errorResponse?.errors?.[0]?.extensions?.internal as any
    const errorMessage =
      internalError?.error?.message ||
      errorResponse?.errors?.[0]?.message ||
      error!.message ||
      ''
    
    expect(errorMessage).toMatch(
      /household_head_id.*null|household_head_id.*household head/i
    )
  })

  it('prevents chaining responsible_party_id (cannot reference a person that already has a responsible_party_id)', async () => {
    const client = makeClient()

    // Step 1: Create a root person (person with responsible_party_id = null)
    const rootResult = await client.request(CREATE_PERSON_WITH_PATIENT, {
      clinicId,
      firstName: 'Root',
      lastName: 'Person',
      status: 'active',
    })
    const rootPersonId = rootResult.insert_person_one.id

    // Step 2: Create a person that references the root as responsible party
    const dependentResult = await client.request(CREATE_PERSON_WITH_RESPONSIBLE_PARTY, {
      clinicId,
      firstName: 'Dependent',
      lastName: 'Person',
      responsiblePartyId: rootPersonId,
      status: 'active',
    })
    const dependentPersonId = dependentResult.insert_person_one.id

    // Verify the dependent was created correctly
    expect(dependentResult.insert_person_one.responsible_party_id).toBe(rootPersonId)

    // Step 3: Try to create another person that references the dependent
    // (who already has a responsible_party_id) - this should fail
    let error: ClientError | null = null

    try {
      await client.request(CREATE_PERSON_WITH_RESPONSIBLE_PARTY, {
        clinicId,
        firstName: 'Chained',
        lastName: 'Person',
        responsiblePartyId: dependentPersonId, // This person already has responsible_party_id set
        status: 'active',
      })
    } catch (err) {
      error = err as ClientError
    }

    expect(error).toBeTruthy()
    
    // Check for error message in various possible locations
    const errorResponse = error!.response
    const internalError = errorResponse?.errors?.[0]?.extensions?.internal as any
    const errorMessage =
      internalError?.error?.message ||
      errorResponse?.errors?.[0]?.message ||
      error!.message ||
      ''
    
    expect(errorMessage).toMatch(
      /responsible_party.*null|responsible_party.*root|responsible_party_must_be_root/i
    )
  })

  it('prevents setting household_relationship to "self" when household_head_id is set', async () => {
    const client = makeClient()

    // Step 1: Create a household head (person with household_head_id = null)
    const headResult = await client.request(CREATE_PERSON_WITH_PATIENT, {
      clinicId,
      firstName: 'Household',
      lastName: 'Head',
      status: 'active',
    })
    const headPersonId = headResult.insert_person_one.id

    // Step 2: Try to create a person with household_head_id set but household_relationship = 'self'
    // This should fail
    let error: ClientError | null = null

    try {
      await client.request(CREATE_PERSON_WITH_HOUSEHOLD_HEAD, {
        clinicId,
        firstName: 'Invalid',
        lastName: 'Person',
        householdHeadId: headPersonId,
        householdRelationship: 'self', // This should not be allowed when household_head_id is set
        status: 'active',
      })
    } catch (err) {
      error = err as ClientError
    }

    expect(error).toBeTruthy()
    
    // Check for error message in various possible locations
    const errorResponse = error!.response
    const internalError = errorResponse?.errors?.[0]?.extensions?.internal as any
    const errorMessage =
      internalError?.error?.message ||
      errorResponse?.errors?.[0]?.message ||
      error!.message ||
      ''
    
    expect(errorMessage).toMatch(
      /household_relationship.*cannot.*self|household_relationship.*self.*household_head_id/i
    )
  })

  it('automatically sets household_relationship to "self" when household_head_id is updated to null', async () => {
    const client = makeClient()

    // Step 1: Create a household head (person with household_head_id = null)
    const headResult = await client.request(CREATE_PERSON_WITH_PATIENT, {
      clinicId,
      firstName: 'Household',
      lastName: 'Head',
      status: 'active',
    })
    const headPersonId = headResult.insert_person_one.id

    // Step 2: Create a person with household_head_id set and a valid relationship
    const memberResult = await client.request(CREATE_PERSON_WITH_HOUSEHOLD_HEAD, {
      clinicId,
      firstName: 'Household',
      lastName: 'Member',
      householdHeadId: headPersonId,
      householdRelationship: 'child',
      status: 'active',
    })
    const memberPersonId = memberResult.insert_person_one.id

    // Verify the member was created correctly
    expect(memberResult.insert_person_one.household_head_id).toBe(headPersonId)
    expect(memberResult.insert_person_one.household_relationship).toBe('child')

    // Step 3: Update the person to set household_head_id to null
    // The household_relationship should automatically be set to 'self'
    const updateResult = await client.request(UPDATE_PERSON_HOUSEHOLD_HEAD, {
      personId: memberPersonId,
      householdHeadId: null,
      householdRelationship: null, // Let the trigger set it to 'self'
    })

    // Verify household_head_id is null
    expect(updateResult.update_person_by_pk.household_head_id).toBeNull()

    // Verify household_relationship was automatically set to 'self'
    expect(updateResult.update_person_by_pk.household_relationship).toBe('self')

    // Double-check by querying the person
    const verifyResult = await client.request(GET_PERSON, {
      personId: memberPersonId,
    })
    expect(verifyResult.person_by_pk.household_head_id).toBeNull()
    expect(verifyResult.person_by_pk.household_relationship).toBe('self')
  })

  describe('patient search functionality', () => {
    let searchClinicId: number
    let seededPersonIds: number[] = []

    beforeAll(async () => {
      // Create a clinic for search tests
      const bootstrap = await bootstrapClinicUser(
        searchTestData.searchClinic.name,
        undefined,
        'Dummy Role',
        []
      )
      searchClinicId = bootstrap.clinicId

      const client = makeClient()

      // Seed test data from JSON file
      for (const personData of searchTestData.testPersons) {
        const result = await client.request(CREATE_PERSON_WITH_CONTACT, {
          clinicId: searchClinicId,
          firstName: personData.firstName,
          lastName: personData.lastName,
          middleName: personData.middleName ?? undefined,
          preferredName: personData.preferredName ?? undefined,
          status: personData.status as any,
          chartNo: personData.chartNo ?? undefined,
          contactKind: personData.contact.kind,
          contactValue: personData.contact.value,
          contactPhoneE164: personData.contact.phoneE164 ?? undefined,
        })
        seededPersonIds.push(result.insert_person_one.id)
      }

      // Create other clinic and seed data for clinic isolation test
      const otherClinic = await bootstrapClinicUser(
        searchTestData.otherClinic.name,
        undefined,
        'Dummy Role',
        []
      )
      for (const personData of searchTestData.otherClinic.testPersons) {
        await client.request(CREATE_PERSON_WITH_CONTACT, {
          clinicId: otherClinic.clinicId,
          firstName: personData.firstName,
          lastName: personData.lastName,
          middleName: personData.middleName ?? undefined,
          preferredName: personData.preferredName ?? undefined,
          status: personData.status as any,
          chartNo: personData.chartNo ?? undefined,
          contactKind: personData.contact.kind,
          contactValue: personData.contact.value,
          contactPhoneE164: personData.contact.phoneE164 ?? undefined,
        })
      }
    })

    it('searches by first name typeahead', async () => {
      const client = makeClient()

      const result = await client.request(SEARCH_PATIENTS, {
        where: {
          clinic_id: { _eq: searchClinicId },
          is_active: { _eq: true },
          _or: [
            { first_name: { _ilike: 'john%' } },
            { last_name: { _ilike: 'john%' } },
            { middle_name: { _ilike: 'john%' } },
            { preferred_name: { _ilike: 'john%' } },
            { patient: { chart_no: { _ilike: 'john%' } } },
          ],
        },
        limit: 10,
      })

      expect(result.person.length).toBeGreaterThan(0)
      const johnPerson = result.person.find((p: any) => p.first_name === 'John')
      expect(johnPerson).toBeTruthy()
      expect(johnPerson.last_name).toBe('Smith')
      expect(johnPerson.patient?.chart_no).toBe('CHART001')
    })

    it('searches by last name typeahead', async () => {
      const client = makeClient()

      const result = await client.request(SEARCH_PATIENTS, {
        where: {
          clinic_id: { _eq: searchClinicId },
          is_active: { _eq: true },
          _or: [
            { first_name: { _ilike: 'smith%' } },
            { last_name: { _ilike: 'smith%' } },
            { middle_name: { _ilike: 'smith%' } },
            { preferred_name: { _ilike: 'smith%' } },
            { patient: { chart_no: { _ilike: 'smith%' } } },
          ],
        },
        limit: 10,
      })

      expect(result.person.length).toBeGreaterThanOrEqual(2)
      const smithPersons = result.person.filter((p: any) => p.last_name === 'Smith')
      expect(smithPersons.length).toBeGreaterThanOrEqual(2)
      expect(smithPersons.some((p: any) => p.first_name === 'John')).toBe(true)
      expect(smithPersons.some((p: any) => p.first_name === 'Jane')).toBe(true)
    })

    it('searches by middle name typeahead', async () => {
      const client = makeClient()

      const result = await client.request(SEARCH_PATIENTS, {
        where: {
          clinic_id: { _eq: searchClinicId },
          is_active: { _eq: true },
          _or: [
            { first_name: { _ilike: 'marie%' } },
            { last_name: { _ilike: 'marie%' } },
            { middle_name: { _ilike: 'marie%' } },
            { preferred_name: { _ilike: 'marie%' } },
            { patient: { chart_no: { _ilike: 'marie%' } } },
          ],
        },
        limit: 10,
      })

      expect(result.person.length).toBeGreaterThan(0)
      const janePerson = result.person.find((p: any) => p.first_name === 'Jane' && p.last_name === 'Smith')
      expect(janePerson).toBeTruthy()
    })

    it('searches by preferred name typeahead', async () => {
      const client = makeClient()

      const result = await client.request(SEARCH_PATIENTS, {
        where: {
          clinic_id: { _eq: searchClinicId },
          is_active: { _eq: true },
          _or: [
            { first_name: { _ilike: 'bob%' } },
            { last_name: { _ilike: 'bob%' } },
            { middle_name: { _ilike: 'bob%' } },
            { preferred_name: { _ilike: 'bob%' } },
            { patient: { chart_no: { _ilike: 'bob%' } } },
          ],
        },
        limit: 10,
      })

      expect(result.person.length).toBeGreaterThan(0)
      const bobPerson = result.person.find((p: any) => p.preferred_name === 'Bob')
      expect(bobPerson).toBeTruthy()
      expect(bobPerson.first_name).toBe('Robert')
      expect(bobPerson.last_name).toBe('Johnson')
    })

    it('searches by typing the whole name of the patient', async () => {
      const client = makeClient()

      // Search for the full name "John Smith" using multi-word search logic
      // This matches the enhanced search in useUnifiedPatientSearch.ts
      const tokens = ['john', 'smith']
      const first = tokens[0]
      const last = tokens[tokens.length - 1]
      
      // Token-all-match: every token must match at least one name field
      const tokenAllMatch = {
        _and: tokens.map((t) => ({
          _or: [
            { first_name: { _ilike: `${t}%` } },
            { last_name: { _ilike: `${t}%` } },
            { middle_name: { _ilike: `${t}%` } },
            { preferred_name: { _ilike: `${t}%` } },
          ],
        })),
      }
      
      // First+Last: common "John Smith" pattern
      const firstLast = {
        _and: [
          { first_name: { _ilike: `${first}%` } },
          { last_name: { _ilike: `${last}%` } },
        ],
      }
      
      // Last+First: handles "Smith John" pattern
      const lastFirst = {
        _and: [
          { first_name: { _ilike: `${last}%` } },
          { last_name: { _ilike: `${first}%` } },
        ],
      }

      const result = await client.request(SEARCH_PATIENTS, {
        where: {
          clinic_id: { _eq: searchClinicId },
          is_active: { _eq: true },
          _or: [
            firstLast,
            lastFirst,
            tokenAllMatch,
            // Keep existing single-string prefix matches for backward compatibility
            { first_name: { _ilike: 'john smith%' } },
            { last_name: { _ilike: 'john smith%' } },
            { middle_name: { _ilike: 'john smith%' } },
            { preferred_name: { _ilike: 'john smith%' } },
            { patient: { chart_no: { _ilike: 'john smith%' } } },
          ],
        },
        limit: 10,
      })

      // This test should now pass with the enhanced multi-word search
      expect(result.person.length).toBeGreaterThan(0)
      const johnSmith = result.person.find((p: any) => p.first_name === 'John' && p.last_name === 'Smith')
      expect(johnSmith).toBeTruthy()
      expect(johnSmith.patient?.chart_no).toBe('CHART001')
    })

    it('searches by chart number typeahead', async () => {
      const client = makeClient()

      const result = await client.request(SEARCH_PATIENTS, {
        where: {
          clinic_id: { _eq: searchClinicId },
          is_active: { _eq: true },
          _or: [
            { first_name: { _ilike: 'chart008%' } },
            { last_name: { _ilike: 'chart008%' } },
            { middle_name: { _ilike: 'chart008%' } },
            { preferred_name: { _ilike: 'chart008%' } },
            { patient: { chart_no: { _ilike: 'chart008%' } } },
          ],
        },
        limit: 10,
      })

      expect(result.person.length).toBeGreaterThan(0)
      const emilyPerson = result.person.find((p: any) => p.patient?.chart_no === 'CHART008')
      expect(emilyPerson).toBeTruthy()
      expect(emilyPerson.first_name).toBe('Emily')
      expect(emilyPerson.last_name).toBe('Wilson')
    })

    it('searches by email (exact match on value_norm)', async () => {
      const client = makeClient()

      const result = await client.request(SEARCH_PATIENTS, {
        where: {
          clinic_id: { _eq: searchClinicId },
          is_active: { _eq: true },
          person_contact_point: {
            kind: { _eq: 'email' },
            is_active: { _eq: true },
            value_norm: { _eq: 'robert.johnson@example.com' },
          },
        },
        limit: 10,
      })

      expect(result.person.length).toBe(1)
      expect(result.person[0].first_name).toBe('Robert')
      expect(result.person[0].last_name).toBe('Johnson')
    })

    it('searches by phone exact match (>= 10 digits, uses phone_last10)', async () => {
      const client = makeClient()

      // Search for last 10 digits: 5551234567
      const result = await client.request(SEARCH_PATIENTS, {
        where: {
          clinic_id: { _eq: searchClinicId },
          is_active: { _eq: true },
          person_contact_point: {
            kind: { _in: ['cell_phone', 'home_phone', 'work_phone'] },
            is_active: { _eq: true },
            phone_last10: { _eq: '5551234567' },
          },
        },
        limit: 10,
      })

      expect(result.person.length).toBe(1)
      expect(result.person[0].first_name).toBe('John')
      expect(result.person[0].last_name).toBe('Smith')
    })

    it('searches by phone exact match with different formatting', async () => {
      const client = makeClient()

      // Search for last 10 digits: 5559876543 (from 555-987-6543)
      const result = await client.request(SEARCH_PATIENTS, {
        where: {
          clinic_id: { _eq: searchClinicId },
          is_active: { _eq: true },
          person_contact_point: {
            kind: { _in: ['cell_phone', 'home_phone', 'work_phone'] },
            is_active: { _eq: true },
            phone_last10: { _eq: '5559876543' },
          },
        },
        limit: 10,
      })

      expect(result.person.length).toBe(1)
      expect(result.person[0].first_name).toBe('Jane')
      expect(result.person[0].last_name).toBe('Smith')
    })

    it('searches by phone partial match (7-9 digits, uses value_norm LIKE)', async () => {
      const client = makeClient()

      // Search for 7 digits: 5551234
      const result = await client.request(SEARCH_PATIENTS, {
        where: {
          clinic_id: { _eq: searchClinicId },
          is_active: { _eq: true },
          person_contact_point: {
            kind: { _in: ['cell_phone', 'home_phone', 'work_phone'] },
            is_active: { _eq: true },
            value_norm: { _like: '%5551234%' },
          },
        },
        limit: 10,
      })

      expect(result.person.length).toBeGreaterThan(0)
      // Should match both person with 555-123-4567 and person with 555-1234
      const matchedPersons = result.person.map((p: any) => `${p.first_name} ${p.last_name}`)
      expect(matchedPersons).toContain('David Miller') // Has 555-1234
      // May also match John Smith if the LIKE pattern matches
    })

    it('only returns results from the correct clinic', async () => {
      const client = makeClient()

      // Search for "John Smith" - should only return the one from searchClinicId
      const result = await client.request(SEARCH_PATIENTS, {
        where: {
          clinic_id: { _eq: searchClinicId },
          is_active: { _eq: true },
          _or: [
            { first_name: { _ilike: 'john%' } },
            { last_name: { _ilike: 'john%' } },
            { middle_name: { _ilike: 'john%' } },
            { preferred_name: { _ilike: 'john%' } },
            { patient: { chart_no: { _ilike: 'john%' } } },
          ],
        },
        limit: 10,
      })

      // Should only find 1 John Smith (from searchClinicId), not the one from other clinic
      const johnSmiths = result.person.filter((p: any) => p.first_name === 'John' && p.last_name === 'Smith')
      expect(johnSmiths.length).toBe(1)
      expect(johnSmiths[0].patient?.chart_no).toBe('CHART001')
    })

    it('respects the limit parameter', async () => {
      const client = makeClient()

      // Search for all active persons in clinic
      const result = await client.request(SEARCH_PATIENTS, {
        where: {
          clinic_id: { _eq: searchClinicId },
          is_active: { _eq: true },
        },
        limit: 3,
      })

      expect(result.person.length).toBeLessThanOrEqual(3)
    })

    it('orders results by last_name then first_name', async () => {
      const client = makeClient()

      const result = await client.request(SEARCH_PATIENTS, {
        where: {
          clinic_id: { _eq: searchClinicId },
          is_active: { _eq: true },
        },
        limit: 10,
      })

      // Verify ordering
      for (let i = 1; i < result.person.length; i++) {
        const prev = result.person[i - 1]
        const curr = result.person[i]
        const prevLast = prev.last_name.toLowerCase()
        const currLast = curr.last_name.toLowerCase()
        
        if (prevLast === currLast) {
          // If last names are equal, first names should be in ascending order
          expect(prev.first_name.toLowerCase() <= curr.first_name.toLowerCase()).toBe(true)
        } else {
          // Last names should be in ascending order
          expect(prevLast <= currLast).toBe(true)
        }
      }
    })
  })
})
