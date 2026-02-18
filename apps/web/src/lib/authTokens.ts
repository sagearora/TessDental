const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:4000'

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const LAST_REFRESH_AT_KEY = 'lastRefreshAt'

/** Sliding 24h session: updated on every successful refresh so active users stay logged in. */
export const SESSION_STARTED_AT_KEY = 'sessionStartedAt'

// Refresh at most every 15 minutes while the user is active.
const TOKEN_REFRESH_INTERVAL_MS = 15 * 60 * 1000
// Treat token as stale when it expires within this window (ms).
const TOKEN_STALE_MS = 5 * 60 * 1000 // 5 minutes

/** In-flight refresh promise so concurrent callers (e.g. AuthContext + Apollo) share one refresh. */
let refreshPromise: Promise<void> | null = null

interface RefreshResponse {
  accessToken: string
  refreshToken: string
}

async function requestTokenRefresh(refreshTokenValue: string): Promise<RefreshResponse> {
  const response = await fetch(`${AUTH_API_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken: refreshTokenValue }),
  })

  if (!response.ok) {
    throw new Error('Failed to refresh token')
  }

  return response.json()
}

/**
 * Decode access token payload and return exp in milliseconds (or null if missing/invalid).
 * Client-side decode only; no verification.
 */
export function getAccessTokenExpiryMs(): number | null {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY)
  if (!token) return null
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    ) as { exp?: number }
    if (typeof payload.exp !== 'number') return null
    return payload.exp * 1000
  } catch {
    return null
  }
}

/**
 * Ensures the access token is reasonably fresh before making an API request.
 * - Uses localStorage timestamps and token exp so it can run outside React (e.g. Apollo link, REST API layer).
 * - No-op if there's no refresh token (user not logged in).
 * - Refreshes when token is missing, expires within TOKEN_STALE_MS, or last refresh was > 15 min ago.
 * - On refresh failure, clears tokens and rethrows so callers can handle logout/navigation.
 */
export async function refreshTokensIfNeeded(): Promise<void> {
  const refreshTokenValue = localStorage.getItem(REFRESH_TOKEN_KEY)
  if (!refreshTokenValue) {
    return
  }

  const now = Date.now()
  const lastRefreshAtRaw = localStorage.getItem(LAST_REFRESH_AT_KEY)
  const lastRefreshAt = lastRefreshAtRaw ? Number(lastRefreshAtRaw) : 0
  const expiresAtMs = getAccessTokenExpiryMs()
  const tokenStillFresh =
    expiresAtMs != null &&
    expiresAtMs - now > TOKEN_STALE_MS &&
    lastRefreshAt !== 0 &&
    now - lastRefreshAt < TOKEN_REFRESH_INTERVAL_MS

  if (tokenStillFresh) {
    return
  }

  // Only one refresh at a time; server rotates tokens so double-use would 401.
  if (refreshPromise) {
    await refreshPromise
    return
  }

  const doRefresh = async () => {
    try {
      const currentRefresh = localStorage.getItem(REFRESH_TOKEN_KEY)
      if (!currentRefresh) return
      const { accessToken, refreshToken } = await requestTokenRefresh(currentRefresh)
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
      localStorage.setItem(LAST_REFRESH_AT_KEY, Date.now().toString())
      localStorage.setItem(SESSION_STARTED_AT_KEY, Date.now().toString())
    } catch (error) {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      localStorage.removeItem(LAST_REFRESH_AT_KEY)
      throw error
    } finally {
      refreshPromise = null
    }
  }

  refreshPromise = doRefresh()
  await refreshPromise
}

/**
 * Record that we just performed an auth-related operation (login, manual refresh, etc.).
 * This keeps the rolling refresh logic in sync with AuthContext actions.
 */
export function markTokensRefreshed() {
  localStorage.setItem(LAST_REFRESH_AT_KEY, Date.now().toString())
}

