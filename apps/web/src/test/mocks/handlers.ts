import { http, HttpResponse } from 'msw'
import { USERS_COUNT_QUERY, INSERT_ADMIN_USER_MUTATION } from '@/api/queries'

export const handlers = [
  http.post('http://localhost:8080/v1/graphql', async ({ request }) => {
    const body = await request.json() as { query: string; variables?: any }

    // Handle users count query
    if (body.query.includes('users_aggregate')) {
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

    // Handle insert mutation
    if (body.query.includes('insert_users_one')) {
      return HttpResponse.json({
        data: {
          insert_users_one: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            email: body.variables?.email || 'admin@example.com',
          },
        },
      })
    }

    return HttpResponse.json({ data: {} })
  }),
]
