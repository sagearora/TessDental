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
 * Wrapper around fetch that calls onUnauthorized() and throws when response is 401.
 * Use this for any authenticated request so session expiry sends the user to login.
 */
export async function authFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const response = await fetch(input, init)
  if (response.status === 401) {
    onUnauthorized()
    throw new Error('Session expired. Please sign in again.')
  }
  return response
}
