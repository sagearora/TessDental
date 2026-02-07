import { GraphQLClient } from 'graphql-request'

const hasuraUrl = import.meta.env.VITE_HASURA_URL || 'http://localhost:8080/v1/graphql'
const adminSecret = import.meta.env.VITE_HASURA_ADMIN_SECRET

const headers: Record<string, string> = {
  'Content-Type': 'application/json',
}

if (adminSecret) {
  headers['x-hasura-admin-secret'] = adminSecret
}

export const hasuraClient = new GraphQLClient(hasuraUrl, {
  headers,
})
