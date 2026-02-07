import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Setup } from '../Setup'
import { hasuraClient } from '@/api/hasuraClient'
import { USERS_COUNT_QUERY, INSERT_ADMIN_USER_MUTATION } from '@/api/queries'

// Mock the hasura client
vi.mock('@/api/hasuraClient', () => ({
  hasuraClient: {
    request: vi.fn(),
  },
}))

// Mock password hashing
vi.mock('@/lib/password', () => ({
  hashPassword: vi.fn().mockResolvedValue('hashed_password_123'),
}))

describe('Setup', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    vi.clearAllMocks()
  })

  const renderSetup = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <Setup />
      </QueryClientProvider>
    )
  }

  it('should show setup complete when admin user exists', async () => {
    vi.mocked(hasuraClient.request).mockResolvedValueOnce({
      users_aggregate: {
        aggregate: {
          count: 1,
        },
      },
    })

    renderSetup()

    await waitFor(() => {
      expect(screen.getByText('Setup Complete')).toBeInTheDocument()
      expect(
        screen.getByText(/The initial admin user has already been created/)
      ).toBeInTheDocument()
    })
  })

  it('should show setup form when no admin user exists', async () => {
    vi.mocked(hasuraClient.request).mockResolvedValueOnce({
      users_aggregate: {
        aggregate: {
          count: 0,
        },
      },
    })

    renderSetup()

    await waitFor(() => {
      expect(screen.getByText('Initial Setup')).toBeInTheDocument()
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    })
  })

  it('should validate email format', async () => {
    vi.mocked(hasuraClient.request).mockResolvedValueOnce({
      users_aggregate: {
        aggregate: {
          count: 0,
        },
      },
    })

    const user = userEvent.setup()
    renderSetup()

    await waitFor(() => {
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    })

    const emailInput = screen.getByLabelText(/Email/i)
    const submitButton = screen.getByRole('button', { name: /Create Admin User/i })

    await user.type(emailInput, 'invalid-email')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument()
    })
  })

  it('should validate password length', async () => {
    vi.mocked(hasuraClient.request).mockResolvedValueOnce({
      users_aggregate: {
        aggregate: {
          count: 0,
        },
      },
    })

    const user = userEvent.setup()
    renderSetup()

    await waitFor(() => {
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    })

    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/Password/i)
    const submitButton = screen.getByRole('button', { name: /Create Admin User/i })

    await user.type(emailInput, 'admin@example.com')
    await user.type(passwordInput, 'short')
    await user.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText(/Password must be at least 8 characters/i)
      ).toBeInTheDocument()
    })
  })

  it('should validate password confirmation match', async () => {
    vi.mocked(hasuraClient.request).mockResolvedValueOnce({
      users_aggregate: {
        aggregate: {
          count: 0,
        },
      },
    })

    const user = userEvent.setup()
    renderSetup()

    await waitFor(() => {
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    })

    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/Password/i)
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i)
    const submitButton = screen.getByRole('button', { name: /Create Admin User/i })

    await user.type(emailInput, 'admin@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'different123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/Passwords don't match/i)).toBeInTheDocument()
    })
  })

  it('should submit form and create admin user', async () => {
    vi.mocked(hasuraClient.request)
      .mockResolvedValueOnce({
        users_aggregate: {
          aggregate: {
            count: 0,
          },
        },
      })
      .mockResolvedValueOnce({
        insert_users_one: {
          id: '123',
          email: 'admin@example.com',
        },
      })

    const user = userEvent.setup()
    renderSetup()

    await waitFor(() => {
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    })

    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/Password/i)
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i)
    const submitButton = screen.getByRole('button', { name: /Create Admin User/i })

    await user.type(emailInput, 'admin@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(hasuraClient.request).toHaveBeenCalledWith(
        INSERT_ADMIN_USER_MUTATION,
        expect.objectContaining({
          email: 'admin@example.com',
          passwordHash: 'hashed_password_123',
        })
      )
    })

    await waitFor(() => {
      expect(
        screen.getByText(/Admin user created successfully!/i)
      ).toBeInTheDocument()
    })
  })

  it('should handle duplicate email error', async () => {
    vi.mocked(hasuraClient.request)
      .mockResolvedValueOnce({
        users_aggregate: {
          aggregate: {
            count: 0,
          },
        },
      })
      .mockRejectedValueOnce({
        response: {
          errors: [
            {
              message: 'Uniqueness violation. duplicate key value violates unique constraint',
            },
          ],
        },
      })

    const user = userEvent.setup()
    renderSetup()

    await waitFor(() => {
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    })

    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/Password/i)
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i)
    const submitButton = screen.getByRole('button', { name: /Create Admin User/i })

    await user.type(emailInput, 'admin@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText(/An admin user with this email already exists/i)
      ).toBeInTheDocument()
    })
  })
})
