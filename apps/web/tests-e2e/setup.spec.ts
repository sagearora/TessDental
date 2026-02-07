import { test, expect } from '@playwright/test'

test.describe('Setup Flow', () => {
  test('should create admin user and show setup complete', async ({ page }) => {
    // Navigate to setup page
    await page.goto('/setup')

    // Wait for the form to be visible
    await expect(page.getByText('Initial Setup')).toBeVisible()
    await expect(page.getByLabel(/Email/i)).toBeVisible()

    // Fill in the form
    await page.getByLabel(/Email/i).fill('admin@example.com')
    await page.getByLabel(/Password/i).fill('password123')
    await page.getByLabel(/Confirm Password/i).fill('password123')

    // Submit the form
    await page.getByRole('button', { name: /Create Admin User/i }).click()

    // Wait for success message
    await expect(
      page.getByText(/Admin user created successfully!/i)
    ).toBeVisible({ timeout: 10000 })

    // Refresh the page
    await page.reload()

    // Now should show "Setup Complete"
    await expect(page.getByText('Setup Complete')).toBeVisible()
    await expect(
      page.getByText(/The initial admin user has already been created/i)
    ).toBeVisible()

    // Form should not be visible
    await expect(page.getByLabel(/Email/i)).not.toBeVisible()
  })

  test('should validate form fields', async ({ page }) => {
    await page.goto('/setup')

    await expect(page.getByText('Initial Setup')).toBeVisible()

    // Try to submit empty form
    await page.getByRole('button', { name: /Create Admin User/i }).click()

    // Should show validation errors
    await expect(page.getByText(/Invalid email address/i)).toBeVisible()

    // Fill invalid email
    await page.getByLabel(/Email/i).fill('invalid-email')
    await page.getByLabel(/Password/i).fill('short')
    await page.getByRole('button', { name: /Create Admin User/i }).click()

    // Should show validation errors
    await expect(page.getByText(/Invalid email address/i)).toBeVisible()
    await expect(
      page.getByText(/Password must be at least 8 characters/i)
    ).toBeVisible()

    // Fill mismatched passwords
    await page.getByLabel(/Email/i).fill('admin@example.com')
    await page.getByLabel(/Password/i).fill('password123')
    await page.getByLabel(/Confirm Password/i).fill('different123')
    await page.getByRole('button', { name: /Create Admin User/i }).click()

    // Should show password mismatch error
    await expect(page.getByText(/Passwords don't match/i)).toBeVisible()
  })
})
