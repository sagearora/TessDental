import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { resetApolloClient } from '@/apollo/client'
import { useUpdateCurrentClinicMutation } from '@/gql/generated'
import { markTokensRefreshed } from '@/lib/authTokens'
import { setOnUnauthorized } from '@/lib/onUnauthorized'

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:4000'

interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
}

interface Session {
  user: User
  clinicId: number
}

const SESSION_STARTED_AT_KEY = 'sessionStartedAt'
const MAX_SESSION_MS = 24 * 60 * 60 * 1000 // 24 hours

interface AuthContextType {
  session: Session | null
  isLoading: boolean
  login: (email: string, password: string, clinicId?: number) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
  switchClinic: (clinicId: number) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const [updateCurrentClinicMutation] = useUpdateCurrentClinicMutation()

  // Load session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken')
    const storedRefreshToken = localStorage.getItem('refreshToken')
    
    if (storedToken) {
      // Verify token by fetching /auth/me
      fetchSession()
        .then((sessionData) => {
          setSession(sessionData)
        })
        .catch(() => {
          // Token invalid, try refresh
          if (storedRefreshToken) {
            refreshAccessToken(storedRefreshToken)
              .then(({ accessToken: newToken }) => {
                localStorage.setItem('accessToken', newToken)
                resetApolloClient()
                return fetchSession()
              })
              .then((sessionData) => {
                setSession(sessionData)
              })
              .catch(() => {
                // Refresh failed, clear everything
                clearAuth()
              })
          } else {
            clearAuth()
          }
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  // Enforce a hard 24-hour maximum session lifetime on the frontend.
  useEffect(() => {
    if (!session) return

    const interval = setInterval(() => {
      const startedAtRaw = localStorage.getItem(SESSION_STARTED_AT_KEY)
      const startedAt = startedAtRaw ? Number(startedAtRaw) : 0
      if (!startedAt) return

      const now = Date.now()
      if (now - startedAt > MAX_SESSION_MS) {
        clearInterval(interval)
        logout()
      }
    }, 60 * 1000) // check every minute

    return () => clearInterval(interval)
  }, [session])

  async function fetchSession(): Promise<Session> {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      throw new Error('No token')
    }

    const response = await fetch(`${AUTH_API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch session')
    }

    return response.json()
  }

  async function refreshAccessToken(refreshTokenValue: string): Promise<{ accessToken: string; refreshToken: string }> {
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

  function clearAuth() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem(SESSION_STARTED_AT_KEY)
    setSession(null)
    resetApolloClient()
  }

  const login = async (email: string, password: string, clinicId?: number) => {
    const response = await fetch(`${AUTH_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, clinicId }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Login failed')
    }

    const data = await response.json()

    // Check if clinic selection is required
    if (data.requiresClinicSelection) {
      const error: any = new Error('CLINIC_SELECTION_REQUIRED')
      error.clinics = data.clinics
      throw error
    }

    // Store tokens
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    localStorage.setItem(SESSION_STARTED_AT_KEY, Date.now().toString())
    markTokensRefreshed()

    // Set session
    setSession({
      user: data.user,
      clinicId: data.clinicId,
    })

    // Reset Apollo client to use new token
    resetApolloClient()

    navigate('/')
  }

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    
    if (refreshToken) {
      try {
        await fetch(`${AUTH_API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        })
      } catch (error) {
        console.error('Logout error:', error)
      }
    }

    clearAuth()
    navigate('/login')
  }, [navigate])

  // When any API gets 401, we logout and redirect to login
  useEffect(() => {
    setOnUnauthorized(() => {
      void logout()
    })
    return () => setOnUnauthorized(null)
  }, [logout])

  const refresh = async () => {
    const refreshTokenValue = localStorage.getItem('refreshToken')
    if (!refreshTokenValue) {
      throw new Error('No refresh token available')
    }

    const { accessToken: newToken, refreshToken: newRefreshToken } = await refreshAccessToken(refreshTokenValue)
    
    localStorage.setItem('accessToken', newToken)
    localStorage.setItem('refreshToken', newRefreshToken)
    markTokensRefreshed()
    resetApolloClient()

    // Fetch updated session
    const sessionData = await fetchSession()
    setSession(sessionData)
  }

  const switchClinic = async (clinicId: number) => {
    if (!session) {
      throw new Error('No active session')
    }

    // Update current_clinic_id in database using the generated mutation hook
    try {
      const result = await updateCurrentClinicMutation({
        variables: {
          userId: session.user.id,
          clinicId: clinicId,
        },
      })
      
      if (result.data === undefined && result.error) {
        throw new Error(result.error.message || 'Failed to update clinic')
      }
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to update clinic')
    }

    // Get new access token with updated clinic
    const refreshTokenValue = localStorage.getItem('refreshToken')
    if (refreshTokenValue) {
      // Use refresh endpoint which will use the updated current_clinic_id
      const { accessToken: newToken, refreshToken: newRefreshToken } = await refreshAccessToken(refreshTokenValue)
      
      localStorage.setItem('accessToken', newToken)
      localStorage.setItem('refreshToken', newRefreshToken)
      markTokensRefreshed()
      resetApolloClient()

      // Fetch updated session
      const sessionData = await fetchSession()
      setSession(sessionData)
    }
  }

  return (
    <AuthContext.Provider value={{ session, isLoading, login, logout, refresh, switchClinic }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
