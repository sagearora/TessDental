import { http, HttpResponse } from 'msw'
import {
  createMockFieldConfigs,
  createMockGenderEnum,
  createMockReferralKindEnum,
  createMockReferralSources,
  createMockClinic,
  createMockPatientSearchResults,
} from './fixtures'

const HASURA_URL = /http:\/\/127\.0\.0\.1:8080\/v1\/graphql|http:\/\/localhost:8080\/v1\/graphql/
const AUTH_API_URL = 'http://localhost:4000'

export const handlers = [
  // REST API handlers for auth
  http.get(`${AUTH_API_URL}/auth/me`, async () => {
    return HttpResponse.json({
      user: {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      },
      clinicId: 1,
    })
  }),

  http.post(`${AUTH_API_URL}/auth/login`, async () => {
    return HttpResponse.json({
      accessToken: 'mock-token',
      refreshToken: 'mock-refresh-token',
      user: {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      },
      clinicId: 1,
    })
  }),

  http.post(`${AUTH_API_URL}/auth/refresh`, async () => {
    return HttpResponse.json({
      accessToken: 'new-mock-token',
      refreshToken: 'new-mock-refresh-token',
    })
  }),

  http.post(`${AUTH_API_URL}/auth/logout`, async () => {
    return HttpResponse.json({ success: true })
  }),

  // GraphQL handlers
  http.post(HASURA_URL, async ({ request }) => {
    const body = await request.json() as { query: string; variables?: any; operationName?: string }
    const query = body.query || ''
    const operationName = body.operationName || ''

    // Handle users count query
    if (query.includes('users_aggregate')) {
      return HttpResponse.json({
        data: {
          users_aggregate: {
            aggregate: {
              count: 0,
            },
          },
        },
      })
    }

    // Handle insert users mutation
    if (query.includes('insert_users_one')) {
      return HttpResponse.json({
        data: {
          insert_users_one: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            email: body.variables?.email || 'admin@example.com',
          },
        },
      })
    }

    // Handle GetPatientFieldConfig query
    if (operationName === 'GetPatientFieldConfig' || query.includes('GetPatientFieldConfig') || query.includes('patient_field_config')) {
      return HttpResponse.json({
        data: {
          patient_field_config: createMockFieldConfigs(),
        },
      })
    }

    // Handle GetGenderEnum query
    if (operationName === 'GetGenderEnum' || query.includes('GetGenderEnum') || query.includes('gender_enum')) {
      return HttpResponse.json({
        data: {
          gender_enum: createMockGenderEnum(),
        },
      })
    }

    // Handle GetReferralKindEnum query
    if (operationName === 'GetReferralKindEnum' || query.includes('GetReferralKindEnum') || query.includes('referral_kind_enum')) {
      return HttpResponse.json({
        data: {
          referral_kind_enum: createMockReferralKindEnum(),
        },
      })
    }

    // Handle GetReferralSources query
    if (operationName === 'GetReferralSources' || query.includes('GetReferralSources') || (query.includes('referral_source') && body.variables?.clinicId)) {
      return HttpResponse.json({
        data: {
          referral_source: createMockReferralSources(),
        },
      })
    }

    // Handle GetClinic query
    if (operationName === 'GetClinic' || query.includes('GetClinic') || query.includes('clinic_v')) {
      const clinic = createMockClinic({ id: body.variables?.clinicId || 1 })
      return HttpResponse.json({
        data: {
          clinic_v: [clinic],
        },
      })
    }

    // Handle SearchPatients query (used by useUnifiedPatientSearch)
    if (operationName === 'SearchPatients' || query.includes('SearchPatients') || (query.includes('person(') && body.variables?.where)) {
      const results = createMockPatientSearchResults()
      // Filter results based on search query if needed
      return HttpResponse.json({
        data: {
          person: results,
        },
      })
    }

    // Handle GetPersonAddressIds query
    if (operationName === 'GetPersonAddressIds' || query.includes('GetPersonAddressIds') || (query.includes('person(') && body.variables?.personId && body.variables?.clinicId && !body.variables?.where)) {
      const personId = body.variables?.personId
      return HttpResponse.json({
        data: {
          person: [
            {
              id: personId,
              mailing_address_id: 1,
              billing_address_id: 1,
              mailing_address: {
                line1: '123 Main St',
                line2: 'Apt 4',
                city: 'Toronto',
                region: 'ON',
                postal_code: 'M1A 1A1',
                country: 'Canada',
              },
              person_contact_point: [
                {
                  id: 1,
                  kind: 'email',
                  value: 'head@example.com',
                  is_primary: true,
                },
                {
                  id: 2,
                  kind: 'cell_phone',
                  value: '(555) 123-4567',
                  is_primary: true,
                },
              ],
            },
          ],
        },
      })
    }

    // Handle CreatePatientWithRelations mutation
    if (operationName === 'CreatePatientWithRelations' || query.includes('CreatePatientWithRelations') || (query.includes('insert_person_one') && body.variables?.contactPoints)) {
      const vars = body.variables || {}
      return HttpResponse.json({
        data: {
          insert_person_one: {
            id: 100,
            clinic_id: vars.clinicId || 1,
            first_name: vars.firstName || '',
            last_name: vars.lastName || '',
            preferred_name: vars.preferredName || null,
            household_head_id: vars.householdHeadId || null,
            household_relationship: vars.householdRelationship || null,
            responsible_party_id: vars.responsiblePartyId || null,
            patient: {
              person_id: 100,
              chart_no: vars.chartNo || null,
              status: vars.status || 'active',
            },
            person_contact_point: vars.contactPoints || [],
            mailing_address: vars.mailingAddressId
              ? {
                  id: vars.mailingAddressId,
                  line1: '123 Main St',
                  city: 'Toronto',
                  region: 'ON',
                  postal_code: 'M1A 1A1',
                }
              : null,
            billing_address: vars.billingAddressId
              ? {
                  id: vars.billingAddressId,
                  line1: '123 Main St',
                  city: 'Toronto',
                  region: 'ON',
                  postal_code: 'M1A 1A1',
                }
              : null,
          },
        },
      })
    }

    // Handle CreateAddress mutation
    if (operationName === 'CreateAddress' || query.includes('CreateAddress') || query.includes('insert_address_one')) {
      const vars = body.variables || {}
      return HttpResponse.json({
        data: {
          insert_address_one: {
            id: 1,
            line1: vars.line1 || '',
            line2: vars.line2 || null,
            city: vars.city || '',
            region: vars.region || '',
            postal_code: vars.postalCode || '',
            country: vars.country || 'Canada',
          },
        },
      })
    }

    // Handle UpsertPatientReferral mutation
    if (operationName === 'UpsertPatientReferral' || query.includes('UpsertPatientReferral') || query.includes('insert_patient_referral_one')) {
      const vars = body.variables || {}
      return HttpResponse.json({
        data: {
          insert_patient_referral_one: {
            patient_person_id: vars.patientPersonId || 100,
            referral_kind: vars.referralKind || '',
            referral_source_id: vars.referralSourceId || null,
            referral_contact_person_id: vars.referralContactPersonId || null,
            referral_other_text: vars.referralOtherText || null,
          },
        },
      })
    }

    // Default response for unhandled queries
    return HttpResponse.json({ data: {} })
  }),
]
