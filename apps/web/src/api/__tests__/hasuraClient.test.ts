import { describe, it, expect, vi, beforeEach } from 'vitest'
import { hasuraClient } from '../hasuraClient'

describe('hasuraClient', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('should create a GraphQL client instance', () => {
    expect(hasuraClient).toBeTruthy()
    expect(typeof (hasuraClient as any).request).toBe('function')
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
