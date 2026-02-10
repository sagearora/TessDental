const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:4000'

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const LAST_REFRESH_AT_KEY = 'lastRefreshAt'

// Refresh at most every 15 minutes while the user is active.
const TOKEN_REFRESH_INTERVAL_MS = 15 * 60 * 1000

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
 * Ensures the access token is reasonably fresh before making an API request.
 * - Uses localStorage timestamps so it can run outside React (e.g. Apollo link, REST API layer).
 * - No-op if there's no refresh token (user not logged in).
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

  if (lastRefreshAt && now - lastRefreshAt < TOKEN_REFRESH_INTERVAL_MS) {
    // Recently refreshed; nothing to do.
    return
  }

  try {
    const { accessToken, refreshToken } = await requestTokenRefresh(refreshTokenValue)
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    localStorage.setItem(LAST_REFRESH_AT_KEY, now.toString())
  } catch (error) {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(LAST_REFRESH_AT_KEY)
    throw error
  }
}

/**
 * Record that we just performed an auth-related operation (login, manual refresh, etc.).
 * This keeps the rolling refresh logic in sync with AuthContext actions.
 */
export function markTokensRefreshed() {
  localStorage.setItem(LAST_REFRESH_AT_KEY, Date.now().toString())
}

