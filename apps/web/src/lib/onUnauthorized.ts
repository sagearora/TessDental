import { refreshTokensIfNeeded } from '@/lib/authTokens'

/**
 * Central handler for 401 Unauthorized responses.
 * AuthProvider registers a callback (logout + redirect to login).
 * Apollo link and REST API layer call onUnauthorized() when they receive 401.
 */

let handler: (() => void) | null = null

export function setOnUnauthorized(callback: (() => void) | null): void {
  handler = callback
}

export function onUnauthorized(): void {
  handler?.()
}

/**
 * Wrapper around fetch that refreshes tokens if needed, adds Authorization, and calls onUnauthorized() on 401.
 * Use this for any authenticated REST request so session stays fresh and expiry sends the user to login.
 */
export async function authFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  try {
    await refreshTokensIfNeeded()
  } catch {
    onUnauthorized()
    throw new Error('Session expired. Please sign in again.')
  }

  const token = localStorage.getItem('accessToken')
  const headers = new Headers(init?.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(input, { ...init, headers })
  if (response.status === 401) {
    onUnauthorized()
    throw new Error('Session expired. Please sign in again.')
  }
  return response
}
