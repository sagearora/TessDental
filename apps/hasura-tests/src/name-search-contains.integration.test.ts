// @vitest-environment node
/// <reference types="node" />

import { describe, it, expect, beforeAll } from 'vitest'
import { makeClient, bootstrapClinicUser } from './test-utils'

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
      patient {
        chart_no
        status
      }
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
      first_name
      last_name
      patient {
        chart_no
        status
      }
    }
  }
`

describe('Name search with contains matching (trigram indexes)', () => {
  let clinicId: number
  let stLawrencePersonId: number

  beforeAll(async () => {
    // Create a clinic for search tests
    const bootstrap = await bootstrapClinicUser(
      'Contains Search Test Clinic',
      undefined,
      'Dummy Role',
      []
    )
    clinicId = bootstrap.clinicId

    const client = makeClient()

    // Create a person with compound last name "St Lawrence"
    // This tests the scenario where searching "lawrence" should find "St Lawrence"
    const result = await client.request(CREATE_PERSON_WITH_CONTACT, {
      clinicId,
      firstName: 'Mary',
      lastName: 'St Lawrence',
      middleName: null,
      preferredName: null,
      status: 'active',
      chartNo: 'CHART-ST-LAWRENCE',
      contactKind: 'cell_phone',
      contactValue: '(555) 111-2222',
      contactPhoneE164: '+15551112222',
    })
    stLawrencePersonId = result.insert_person_one.id
  })

  it('should NOT find "St Lawrence" when searching "lawrence" with prefix-only matching (before migration)', async () => {
    const client = makeClient()

    // This test uses only prefix matching (the old behavior)
    // It should fail because "St Lawrence" doesn't start with "lawrence"
    const result = await client.request(SEARCH_PATIENTS, {
      where: {
        clinic_id: { _eq: clinicId },
        is_active: { _eq: true },
        _or: [
          // Prefix matches only (old behavior)
          { first_name: { _ilike: 'lawrence%' } },
          { last_name: { _ilike: 'lawrence%' } },
          { middle_name: { _ilike: 'lawrence%' } },
          { preferred_name: { _ilike: 'lawrence%' } },
          { patient: { chart_no: { _ilike: 'lawrence%' } } },
        ],
      },
      limit: 10,
    })

    // Should NOT find "St Lawrence" because it doesn't start with "lawrence"
    const stLawrence = result.person.find(
      (p: any) => p.last_name === 'St Lawrence'
    )
    expect(stLawrence).toBeUndefined()
  })

  it('should find "St Lawrence" when searching "lawrence" with contains matching (after migration)', async () => {
    const client = makeClient()

    // This test uses both prefix AND contains matching (the new behavior with trigram indexes)
    const searchTerm = 'lawrence'
    const prefix = `${searchTerm}%`
    const contains = `%${searchTerm}%`

    const result = await client.request(SEARCH_PATIENTS, {
      where: {
        clinic_id: { _eq: clinicId },
        is_active: { _eq: true },
        _or: [
          // Prefix matches (uses text_pattern_ops indexes)
          { first_name: { _ilike: prefix } },
          { last_name: { _ilike: prefix } },
          { middle_name: { _ilike: prefix } },
          { preferred_name: { _ilike: prefix } },
          { patient: { chart_no: { _ilike: prefix } } },
          // Contains matches (uses trigram GIN indexes)
          { first_name: { _ilike: contains } },
          { last_name: { _ilike: contains } },
          { middle_name: { _ilike: contains } },
          { preferred_name: { _ilike: contains } },
        ],
      },
      limit: 10,
    })

    // Should find "St Lawrence" because contains matching finds "lawrence" within "St Lawrence"
    const stLawrence = result.person.find(
      (p: any) => p.last_name === 'St Lawrence'
    )
    expect(stLawrence).toBeTruthy()
    expect(stLawrence.first_name).toBe('Mary')
    expect(stLawrence.patient?.chart_no).toBe('CHART-ST-LAWRENCE')
  })

  it('should still find "St Lawrence" when searching "st" (prefix match still works)', async () => {
    const client = makeClient()

    // Prefix matching should still work for "st"
    const result = await client.request(SEARCH_PATIENTS, {
      where: {
        clinic_id: { _eq: clinicId },
        is_active: { _eq: true },
        _or: [
          { first_name: { _ilike: 'st%' } },
          { last_name: { _ilike: 'st%' } },
          { middle_name: { _ilike: 'st%' } },
          { preferred_name: { _ilike: 'st%' } },
          { patient: { chart_no: { _ilike: 'st%' } } },
        ],
      },
      limit: 10,
    })

    // Should find "St Lawrence" because it starts with "st"
    const stLawrence = result.person.find(
      (p: any) => p.last_name === 'St Lawrence'
    )
    expect(stLawrence).toBeTruthy()
    expect(stLawrence.first_name).toBe('Mary')
  })
})
