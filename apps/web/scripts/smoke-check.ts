#!/usr/bin/env node

/**
 * Smoke check script to verify Hasura is reachable and GraphQL works
 */

import { GraphQLClient } from 'graphql-request'

const HASURA_URL = process.env.VITE_HASURA_URL || 'http://localhost:8080/v1/graphql'
const ADMIN_SECRET = process.env.VITE_HASURA_ADMIN_SECRET

const USERS_COUNT_QUERY = `
  query UsersCount {
    users_aggregate {
      aggregate {
        count
      }
    }
  }
`

async function checkHealth() {
  try {
    const response = await fetch('http://localhost:8080/healthz')
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`)
    }
    console.log('✓ Hasura health check passed')
  } catch (error) {
    console.error('✗ Hasura health check failed:', error)
    process.exit(1)
  }
}

async function checkGraphQL() {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (ADMIN_SECRET) {
      headers['x-hasura-admin-secret'] = ADMIN_SECRET
    }

    const client = new GraphQLClient(HASURA_URL, { headers })
    const data = await client.request(USERS_COUNT_QUERY)

    console.log('✓ GraphQL query successful')
    console.log(`  Users count: ${(data as any).users_aggregate.aggregate.count}`)
  } catch (error) {
    console.error('✗ GraphQL query failed:', error)
    process.exit(1)
  }
}

async function main() {
  console.log('Running smoke checks...\n')
  await checkHealth()
  await checkGraphQL()
  console.log('\n✓ All smoke checks passed!')
}

main().catch((error) => {
  console.error('Smoke check failed:', error)
  process.exit(1)
})
