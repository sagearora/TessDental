import { ReactElement, ReactNode } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ApolloProvider } from '@apollo/client/react'
import { AuthProvider } from '@/contexts/AuthContext'
import { apolloClient } from '@/apollo/client'

interface Session {
  user: {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
  }
  clinicId: number
}

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  session?: Session | null
  queryClient?: QueryClient
}

export function renderWithProviders(
  ui: ReactElement,
  {
    session = {
      user: {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      },
      clinicId: 1,
    },
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    }),
    ...renderOptions
  }: RenderWithProvidersOptions = {}
) {
  // Set up localStorage for auth if session is provided
  if (session) {
    localStorage.setItem('accessToken', 'mock-token')
    localStorage.setItem('refreshToken', 'mock-refresh-token')
  } else {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ApolloProvider client={apolloClient}>
            <AuthProvider>{children}</AuthProvider>
          </ApolloProvider>
        </QueryClientProvider>
      </BrowserRouter>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}
