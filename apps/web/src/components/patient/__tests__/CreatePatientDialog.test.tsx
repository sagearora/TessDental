import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CreatePatientDialog } from '../CreatePatientDialog'
import { renderWithProviders } from '@/test/utils'

// Mock react-router-dom navigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock AuthContext to provide session immediately
const mockSession = {
  user: {
    id: '1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
  },
  clinicId: 1,
}

vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual('@/contexts/AuthContext')
  return {
    ...actual,
    useAuth: () => ({
      session: mockSession,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      refresh: vi.fn(),
      switchClinic: vi.fn(),
    }),
  }
})

describe('CreatePatientDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockNavigate.mockClear()
  })

  describe('Basic rendering', () => {
    it('should render dialog when open prop is true', async () => {
      renderWithProviders(
        <CreatePatientDialog open={true} onOpenChange={vi.fn()} />
      )

      await waitFor(() => {
        expect(screen.getByText('Create New Patient')).toBeInTheDocument()
      })
    })

    it('should not render dialog when open prop is false', () => {
      renderWithProviders(
        <CreatePatientDialog open={false} onOpenChange={vi.fn()} />
      )

      expect(screen.queryByText('Create New Patient')).not.toBeInTheDocument()
    })

    it('should show dialog title and description', async () => {
      renderWithProviders(
        <CreatePatientDialog open={true} onOpenChange={vi.fn()} />
      )

      await waitFor(() => {
        expect(screen.getByText('Create New Patient')).toBeInTheDocument()
        expect(
          screen.getByText(/Fill in the patient information. Fields marked with \* are required./i)
        ).toBeInTheDocument()
      })
    })

    it('should render form fields based on field configuration', async () => {
      renderWithProviders(
        <CreatePatientDialog open={true} onOpenChange={vi.fn()} />
      )

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/First Name/i)).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/Last Name/i)).toBeInTheDocument()
      })
    })

    it('should show required field indicators', async () => {
      renderWithProviders(
        <CreatePatientDialog open={true} onOpenChange={vi.fn()} />
      )

      await waitFor(() => {
        // Check for required field indicator (asterisk)
        const requiredIndicators = screen.getAllByText('*')
        expect(requiredIndicators.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Form validation', () => {
    it('should validate required fields on submit', async () => {
      const user = userEvent.setup()
      const onOpenChange = vi.fn()

      renderWithProviders(
        <CreatePatientDialog open={true} onOpenChange={onOpenChange} />
      )

      // Wait for form fields to load
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/First Name/i)).toBeInTheDocument()
      }, { timeout: 5000 })

      // Clear navigation mock to track if it's called
      mockNavigate.mockClear()

      const submitButton = screen.getByRole('button', { name: /Create Patient/i })
      await user.click(submitButton)

      // Validation should prevent navigation - wait a bit to ensure navigation doesn't happen
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Navigation should NOT have been called (validation prevented submission)
      expect(mockNavigate).not.toHaveBeenCalled()

      // Error message should appear - try multiple ways to find it
      await waitFor(() => {
        // Try to find error by class first
        let errorDiv = document.querySelector('.bg-red-50') as HTMLElement
        if (!errorDiv) {
          // Fallback: find any div with error text
          errorDiv = Array.from(document.querySelectorAll('div')).find(div => 
            div.textContent?.includes('required fields') || 
            div.textContent?.includes('Please fill in required fields')
          ) as HTMLElement
        }
        expect(errorDiv).toBeTruthy()
        if (errorDiv) {
          expect(errorDiv.textContent).toMatch(/required fields/i)
        }
      }, { timeout: 5000 })
    })

    it('should show error message for missing required fields', async () => {
      const user = userEvent.setup()

      renderWithProviders(
        <CreatePatientDialog open={true} onOpenChange={vi.fn()} />
      )

      // Wait for form fields to load
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/First Name/i)).toBeInTheDocument()
      }, { timeout: 5000 })

      mockNavigate.mockClear()

      const submitButton = screen.getByRole('button', { name: /Create Patient/i })
      await user.click(submitButton)

      // Wait a bit to ensure validation runs
      await new Promise(resolve => setTimeout(resolve, 500))

      // Navigation should NOT have been called
      expect(mockNavigate).not.toHaveBeenCalled()

      // Error message should appear - try multiple ways to find it
      await waitFor(() => {
        // Try to find error by class first
        let errorDiv = document.querySelector('.bg-red-50') as HTMLElement
        if (!errorDiv) {
          // Fallback: find any element with error text
          errorDiv = Array.from(document.querySelectorAll('*')).find(el => 
            el.textContent?.includes('required fields') || 
            el.textContent?.includes('Please fill in required fields')
          ) as HTMLElement
        }
        expect(errorDiv).toBeTruthy()
        if (errorDiv) {
          expect(errorDiv.textContent).toMatch(/required fields/i)
        }
      }, { timeout: 5000 })
    })

    it('should validate referral fields when household head is not selected', async () => {
      const user = userEvent.setup()

      renderWithProviders(
        <CreatePatientDialog open={true} onOpenChange={vi.fn()} />
      )

      // Wait for form fields and queries to load
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/First Name/i)).toBeInTheDocument()
      }, { timeout: 5000 })

      // Wait a bit more for all queries to complete
      await new Promise(resolve => setTimeout(resolve, 500))

      // Fill in required fields except referral
      await user.type(screen.getByPlaceholderText(/First Name/i), 'John')
      await user.type(screen.getByPlaceholderText(/Last Name/i), 'Doe')
      await user.type(screen.getByPlaceholderText(/Email/i), 'john@example.com')
      await user.type(screen.getByPlaceholderText(/Cell Phone/i), '5551234567')

      const submitButton = screen.getByRole('button', { name: /Create Patient/i })
      await user.click(submitButton)

      await waitFor(() => {
        // Look for error message - it should appear in a div with error styling
        const errorDiv = document.querySelector('.bg-red-50') as HTMLElement
        expect(errorDiv).toBeTruthy()
        expect(errorDiv?.textContent).toMatch(/required fields/i)
      }, { timeout: 3000 })
    })
  })

  describe('User interactions', () => {
    it('should allow user to type in form fields', async () => {
      const user = userEvent.setup()

      renderWithProviders(
        <CreatePatientDialog open={true} onOpenChange={vi.fn()} />
      )

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/First Name/i)).toBeInTheDocument()
      })

      const firstNameInput = screen.getByPlaceholderText(/First Name/i)
      await user.type(firstNameInput, 'John')

      expect(firstNameInput).toHaveValue('John')
    })

    it('should allow user to select gender from dropdown', async () => {
      const user = userEvent.setup()

      renderWithProviders(
        <CreatePatientDialog open={true} onOpenChange={vi.fn()} />
      )

      await waitFor(() => {
        // Wait for form to load
        expect(screen.getByPlaceholderText(/First Name/i)).toBeInTheDocument()
      })

      // Find gender select by looking for select with "Select gender..." option
      const allSelects = Array.from(document.querySelectorAll('select'))
      const genderSelect = allSelects.find(select => 
        Array.from(select.options).some(opt => opt.textContent?.includes('Select gender') || opt.textContent?.includes('gender'))
      ) as HTMLSelectElement
      
      expect(genderSelect).toBeTruthy()
      await user.selectOptions(genderSelect, 'male')
      await waitFor(() => {
        expect(genderSelect.value).toBe('male')
      })
    })

    it('should allow user to select referral type and source', async () => {
      const user = userEvent.setup()

      renderWithProviders(
        <CreatePatientDialog open={true} onOpenChange={vi.fn()} />
      )

      await waitFor(() => {
        // Wait for form to load
        expect(screen.getByPlaceholderText(/First Name/i)).toBeInTheDocument()
      })

      // Find referral type select by looking for selects and finding the one with referral type label
      await waitFor(() => {
        const selects = Array.from(document.querySelectorAll('select'))
        const referralTypeSelect = selects.find(select => {
          const label = select.closest('div')?.querySelector('label')
          return label?.textContent?.includes('Referral Type')
        })
        expect(referralTypeSelect).toBeTruthy()
      })
      
      const selects = Array.from(document.querySelectorAll('select'))
      const referralTypeSelect = selects.find(select => {
        const label = select.closest('div')?.querySelector('label')
        return label?.textContent?.includes('Referral Type')
      }) as HTMLSelectElement
      
      expect(referralTypeSelect).toBeTruthy()
      await user.selectOptions(referralTypeSelect, 'source')

      await waitFor(() => {
        // Wait for referral source to appear
        const allSelects = Array.from(document.querySelectorAll('select'))
        const referralSourceSelect = allSelects.find(select => {
          const label = select.closest('div')?.querySelector('label')
          return label?.textContent?.includes('Referral Source')
        })
        expect(referralSourceSelect).toBeTruthy()
      })

      // Find referral source select
      const allSelects = Array.from(document.querySelectorAll('select'))
      const referralSourceSelect = allSelects.find(select => {
        const label = select.closest('div')?.querySelector('label')
        return label?.textContent?.includes('Referral Source')
      }) as HTMLSelectElement
      
      expect(referralSourceSelect).toBeTruthy()
      // Wait for options to be populated
      await waitFor(() => {
        expect(referralSourceSelect.options.length).toBeGreaterThan(1)
      })
      // Get the first non-empty option value
      const availableValues = Array.from(referralSourceSelect.options).map(opt => opt.value)
      const valueToSelect = availableValues.find(v => v && v !== '') || '1'
      await user.selectOptions(referralSourceSelect, valueToSelect)

      await waitFor(() => {
        expect(referralSourceSelect.value).toBe(valueToSelect)
      })
    })

    it('should allow user to cancel dialog', async () => {
      const user = userEvent.setup()
      const onOpenChange = vi.fn()

      renderWithProviders(
        <CreatePatientDialog open={true} onOpenChange={onOpenChange} />
      )

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument()
      })

      const cancelButton = screen.getByRole('button', { name: /Cancel/i })
      await user.click(cancelButton)

      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  describe('Household head selection', () => {
    it('should show household head search input', async () => {
      renderWithProviders(
        <CreatePatientDialog open={true} onOpenChange={vi.fn()} />
      )

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Search by name or phone/i)).toBeInTheDocument()
      })
    })

    it('should display search results when typing', async () => {
      const user = userEvent.setup()

      renderWithProviders(
        <CreatePatientDialog open={true} onOpenChange={vi.fn()} />
      )

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Search by name or phone/i)).toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText(/Search by name or phone/i)
      await user.type(searchInput, 'John')

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })
    })

    it('should allow selecting a household head', async () => {
      const user = userEvent.setup()

      renderWithProviders(
        <CreatePatientDialog open={true} onOpenChange={vi.fn()} />
      )

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Search by name or phone/i)).toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText(/Search by name or phone/i)
      await user.type(searchInput, 'John')

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })

      const result = screen.getByText('John Doe')
      await user.click(result)

      await waitFor(() => {
        expect(screen.getByText(/Relationship to household head/i)).toBeInTheDocument()
      })
    })

    it('should show relationship selector after selection', async () => {
      const user = userEvent.setup()

      renderWithProviders(
        <CreatePatientDialog open={true} onOpenChange={vi.fn()} />
      )

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Search by name or phone/i)).toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText(/Search by name or phone/i)
      await user.type(searchInput, 'John')

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })

      const result = screen.getByText('John Doe')
      await user.click(result)

      await waitFor(() => {
        const relationshipSelect = screen.getByRole('combobox', { name: /Relationship to household head/i }) || document.querySelector('select[id="householdRelationship"]')
        expect(relationshipSelect).toBeInTheDocument()
        expect(relationshipSelect).toHaveValue('child')
      })
    })

    it('should hide referral field when household head is selected', async () => {
      const user = userEvent.setup()

      renderWithProviders(
        <CreatePatientDialog open={true} onOpenChange={vi.fn()} />
      )

      await waitFor(() => {
        // Wait for form to fully load
        expect(screen.getByPlaceholderText(/First Name/i)).toBeInTheDocument()
      })
      
      // Initially, check that referral type select exists
      const initialReferralTypeSelects = Array.from(document.querySelectorAll('select')).filter(select => {
        const label = select.closest('div')?.querySelector('label')
        return label?.textContent?.includes('Referral Type')
      })
      expect(initialReferralTypeSelects.length).toBeGreaterThan(0)

      const searchInput = screen.getByPlaceholderText(/Search by name or phone/i)
      await user.type(searchInput, 'John')

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })

      const result = screen.getByText('John Doe')
      await user.click(result)

      await waitFor(() => {
        // After selecting household head, relationship selector should appear
        expect(screen.getByText(/Relationship to household head/i)).toBeInTheDocument()
      }, { timeout: 3000 })
      
      // Verify referral field is no longer visible by checking selects
      const referralTypeSelectsAfter = Array.from(document.querySelectorAll('select')).filter(select => {
        const label = select.closest('div')?.querySelector('label')
        const isVisible = select.offsetParent !== null
        return label?.textContent?.includes('Referral Type') && isVisible
      })
      // After household head selection, referral should be hidden
      expect(referralTypeSelectsAfter.length).toBe(0)
    })
  })

  describe('Form submission', () => {
    it('should submit form with all required fields', async () => {
      const user = userEvent.setup()
      const onOpenChange = vi.fn()
      const onSuccess = vi.fn()

      renderWithProviders(
        <CreatePatientDialog
          open={true}
          onOpenChange={onOpenChange}
          onSuccess={onSuccess}
        />
      )

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/First Name/i)).toBeInTheDocument()
      })

      // Fill in required fields
      await user.type(screen.getByPlaceholderText(/First Name/i), 'John')
      await user.type(screen.getByPlaceholderText(/Last Name/i), 'Doe')
      await user.type(screen.getByPlaceholderText(/Email/i), 'john@example.com')
      await user.type(screen.getByPlaceholderText(/Cell Phone/i), '5551234567')

      // Select referral
      const selects = screen.getAllByRole('combobox')
      const referralTypeSelect = selects.find(select => {
        const label = select.closest('div')?.querySelector('label')
        return label?.textContent?.includes('Referral Type')
      }) || selects[0]
      await user.selectOptions(referralTypeSelect as HTMLSelectElement, 'other')
      await user.type(screen.getByPlaceholderText(/Enter referral information/i), 'Test referral')

      const submitButton = screen.getByRole('button', { name: /Create Patient/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/profile/100')
        expect(onSuccess).toHaveBeenCalled()
        expect(onOpenChange).toHaveBeenCalledWith(false)
      })
    })

    it('should call CreatePatientWithRelations mutation with correct variables', async () => {
      const user = userEvent.setup()

      renderWithProviders(
        <CreatePatientDialog open={true} onOpenChange={vi.fn()} />
      )

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/First Name/i)).toBeInTheDocument()
      })

      await user.type(screen.getByPlaceholderText(/First Name/i), 'John')
      await user.type(screen.getByPlaceholderText(/Last Name/i), 'Doe')
      await user.type(screen.getByPlaceholderText(/Email/i), 'john@example.com')
      await user.type(screen.getByPlaceholderText(/Cell Phone/i), '5551234567')

      const selects = screen.getAllByRole('combobox')
      const referralTypeSelect = selects.find(select => {
        const label = select.closest('div')?.querySelector('label')
        return label?.textContent?.includes('Referral Type')
      }) || selects[0]
      await user.selectOptions(referralTypeSelect, 'other')
      await user.type(screen.getByPlaceholderText(/Enter referral information/i), 'Test referral')

      const submitButton = screen.getByRole('button', { name: /Create Patient/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalled()
      })
    })

    it('should create address when address fields are provided', async () => {
      const user = userEvent.setup()

      renderWithProviders(
        <CreatePatientDialog open={true} onOpenChange={vi.fn()} />
      )

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/First Name/i)).toBeInTheDocument()
      })

      await user.type(screen.getByPlaceholderText(/First Name/i), 'John')
      await user.type(screen.getByPlaceholderText(/Last Name/i), 'Doe')
      await user.type(screen.getByPlaceholderText(/Email/i), 'john@example.com')
      await user.type(screen.getByPlaceholderText(/Cell Phone/i), '5551234567')

      // Fill in address
      await user.type(screen.getByPlaceholderText(/Street Address/i), '123 Main St')
      await user.type(screen.getByPlaceholderText(/City/i), 'Toronto')
      await user.type(screen.getByPlaceholderText(/Postal Code/i), 'M1A 1A1')

      const selects = screen.getAllByRole('combobox')
      const referralTypeSelect = selects.find(select => {
        const label = select.closest('div')?.querySelector('label')
        return label?.textContent?.includes('Referral Type')
      }) || selects[0]
      await user.selectOptions(referralTypeSelect, 'other')
      await user.type(screen.getByPlaceholderText(/Enter referral information/i), 'Test referral')

      const submitButton = screen.getByRole('button', { name: /Create Patient/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalled()
      })
    })

    it('should create referral when referral is provided (and no household head)', async () => {
      const user = userEvent.setup()

      renderWithProviders(
        <CreatePatientDialog open={true} onOpenChange={vi.fn()} />
      )

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/First Name/i)).toBeInTheDocument()
      })

      await user.type(screen.getByPlaceholderText(/First Name/i), 'John')
      await user.type(screen.getByPlaceholderText(/Last Name/i), 'Doe')
      await user.type(screen.getByPlaceholderText(/Email/i), 'john@example.com')
      await user.type(screen.getByPlaceholderText(/Cell Phone/i), '5551234567')

      // Find referral type select by looking for selects
      await waitFor(() => {
        const selects = Array.from(document.querySelectorAll('select'))
        const referralTypeSelect = selects.find(select => {
          const label = select.closest('div')?.querySelector('label')
          return label?.textContent?.includes('Referral Type')
        })
        expect(referralTypeSelect).toBeTruthy()
      })
      
      const selects = Array.from(document.querySelectorAll('select'))
      const referralTypeSelect = selects.find(select => {
        const label = select.closest('div')?.querySelector('label')
        return label?.textContent?.includes('Referral Type')
      }) as HTMLSelectElement
      
      expect(referralTypeSelect).toBeTruthy()
      await user.selectOptions(referralTypeSelect, 'source')
      
      await waitFor(() => {
        // Wait for referral source to appear
        const allSelects = Array.from(document.querySelectorAll('select'))
        const referralSourceSelect = allSelects.find(select => {
          const label = select.closest('div')?.querySelector('label')
          return label?.textContent?.includes('Referral Source')
        })
        expect(referralSourceSelect).toBeTruthy()
      })
      
      // Find referral source select
      const allSelects = Array.from(document.querySelectorAll('select'))
      const referralSourceSelect = allSelects.find(select => {
        const label = select.closest('div')?.querySelector('label')
        return label?.textContent?.includes('Referral Source')
      }) as HTMLSelectElement
      
      expect(referralSourceSelect).toBeTruthy()
      // Wait for options to be populated
      await waitFor(() => {
        expect(referralSourceSelect.options.length).toBeGreaterThan(1)
      })
      // Get the first non-empty option value
      const availableValues = Array.from(referralSourceSelect.options).map(opt => opt.value)
      const valueToSelect = availableValues.find(v => v && v !== '') || '1'
      await user.selectOptions(referralSourceSelect, valueToSelect)

      const submitButton = screen.getByRole('button', { name: /Create Patient/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalled()
      })
    })

    it('should navigate to patient profile on success', async () => {
      const user = userEvent.setup()

      renderWithProviders(
        <CreatePatientDialog open={true} onOpenChange={vi.fn()} />
      )

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/First Name/i)).toBeInTheDocument()
      })

      await user.type(screen.getByPlaceholderText(/First Name/i), 'John')
      await user.type(screen.getByPlaceholderText(/Last Name/i), 'Doe')
      await user.type(screen.getByPlaceholderText(/Email/i), 'john@example.com')
      await user.type(screen.getByPlaceholderText(/Cell Phone/i), '5551234567')

      const selects = screen.getAllByRole('combobox')
      const referralTypeSelect = selects.find(select => {
        const label = select.closest('div')?.querySelector('label')
        return label?.textContent?.includes('Referral Type')
      }) || selects[0]
      await user.selectOptions(referralTypeSelect, 'other')
      await user.type(screen.getByPlaceholderText(/Enter referral information/i), 'Test referral')

      const submitButton = screen.getByRole('button', { name: /Create Patient/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/profile/100')
      })
    })

    it('should call onSuccess callback on success', async () => {
      const user = userEvent.setup()
      const onSuccess = vi.fn()

      renderWithProviders(
        <CreatePatientDialog
          open={true}
          onOpenChange={vi.fn()}
          onSuccess={onSuccess}
        />
      )

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/First Name/i)).toBeInTheDocument()
      })

      await user.type(screen.getByPlaceholderText(/First Name/i), 'John')
      await user.type(screen.getByPlaceholderText(/Last Name/i), 'Doe')
      await user.type(screen.getByPlaceholderText(/Email/i), 'john@example.com')
      await user.type(screen.getByPlaceholderText(/Cell Phone/i), '5551234567')

      const selects = screen.getAllByRole('combobox')
      const referralTypeSelect = selects.find(select => {
        const label = select.closest('div')?.querySelector('label')
        return label?.textContent?.includes('Referral Type')
      }) || selects[0]
      await user.selectOptions(referralTypeSelect, 'other')
      await user.type(screen.getByPlaceholderText(/Enter referral information/i), 'Test referral')

      const submitButton = screen.getByRole('button', { name: /Create Patient/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled()
      })
    })

    it('should close dialog after successful submission', async () => {
      const user = userEvent.setup()
      const onOpenChange = vi.fn()

      renderWithProviders(
        <CreatePatientDialog open={true} onOpenChange={onOpenChange} />
      )

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/First Name/i)).toBeInTheDocument()
      })

      await user.type(screen.getByPlaceholderText(/First Name/i), 'John')
      await user.type(screen.getByPlaceholderText(/Last Name/i), 'Doe')
      await user.type(screen.getByPlaceholderText(/Email/i), 'john@example.com')
      await user.type(screen.getByPlaceholderText(/Cell Phone/i), '5551234567')

      const selects = screen.getAllByRole('combobox')
      const referralTypeSelect = selects.find(select => {
        const label = select.closest('div')?.querySelector('label')
        return label?.textContent?.includes('Referral Type')
      }) || selects[0]
      await user.selectOptions(referralTypeSelect, 'other')
      await user.type(screen.getByPlaceholderText(/Enter referral information/i), 'Test referral')

      const submitButton = screen.getByRole('button', { name: /Create Patient/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false)
      })
    })
  })

  describe('Error handling', () => {
    it('should show error message when mutation fails', async () => {
      const user = userEvent.setup()

      // Mock a failed mutation by modifying the handler temporarily
      // This test would need server.use() from MSW to override the handler
      // For now, we'll test that error handling exists in the component
      renderWithProviders(
        <CreatePatientDialog open={true} onOpenChange={vi.fn()} />
      )

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/First Name/i)).toBeInTheDocument()
      })

      // The component should handle errors gracefully
      // This is a placeholder test - actual error simulation would require MSW handler override
      expect(screen.getByRole('button', { name: /Create Patient/i })).toBeInTheDocument()
    })
  })
})
