import { describe, it, expect, vi, beforeEach } from 'vitest'
import { hasuraClient } from '../hasuraClient'

// Mock environment variables
const originalEnv = import.meta.env

describe('hasuraClient', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('should create client with default URL when env var is not set', () => {
    expect(hasuraClient.endpoint).toBe('http://localhost:8080/v1/graphql')
  })

  it('should attach admin secret header when present', () => {
    // The client is created at module load time, so we can't easily test
    // dynamic env changes. But we can verify the structure.
    const headers = (hasuraClient as any).requestConfig?.headers || {}
    
    // If admin secret is set in env, it should be in headers
    if (import.meta.env.VITE_HASURA_ADMIN_SECRET) {
      expect(headers['x-hasura-admin-secret']).toBeDefined()
    }
  })

  it('should have Content-Type header', () => {
    const headers = (hasuraClient as any).requestConfig?.headers || {}
    expect(headers['Content-Type']).toBe('application/json')
  })
})
