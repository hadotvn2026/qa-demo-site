import { test, expect } from '@playwright/test';

test.describe('Authentication Flow Tests', () => {
  test('successful login with valid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/elements/auth');
    await page.getByTestId('auth-username').fill('tomsmith');
    await page.getByTestId('auth-password').fill('SuperSecretPassword!');
    await page.getByTestId('auth-signin').click();
    await expect(page).toHaveURL(/\/elements\/dropdown/);
  });

  test('rejects invalid username', async ({ page }) => {
    await page.goto('http://localhost:3000/elements/auth');
    await page.getByTestId('auth-username').fill('invaliduser');
    await page.getByTestId('auth-password').fill('SuperSecretPassword!');
    await page.getByTestId('auth-signin').click();
    await expect(page.getByText(/Invalid credentials/)).toBeVisible();
  });

  test('rejects invalid password', async ({ page }) => {
    await page.goto('http://localhost:3000/elements/auth');
    await page.getByTestId('auth-username').fill('tomsmith');
    await page.getByTestId('auth-password').fill('wrongpassword');
    await page.getByTestId('auth-signin').click();
    await expect(page.getByText(/Invalid credentials/)).toBeVisible();
  });

  test('shows lockout after 3 failed attempts', async ({ page }) => {
    await page.goto('http://localhost:3000/elements/auth');

    // First failed attempt
    await page.getByTestId('auth-username').fill('tomsmith');
    await page.getByTestId('auth-password').fill('wrong1');
    await page.getByTestId('auth-signin').click();
    await expect(page.getByText(/2 attempts remaining/)).toBeVisible();

    // Second failed attempt
    await page.getByTestId('auth-username').fill('tomsmith');
    await page.getByTestId('auth-password').fill('wrong2');
    await page.getByTestId('auth-signin').click();
    await expect(page.getByText(/1 attempts remaining/)).toBeVisible();

    // Third failed attempt - should lock account
    await page.getByTestId('auth-username').fill('tomsmith');
    await page.getByTestId('auth-password').fill('wrong3');
    await page.getByTestId('auth-signin').click();
    await expect(page.getByText(/Account locked/)).toBeVisible();

    // Verify form is disabled
    await expect(page.getByTestId('auth-username')).toBeDisabled();
    await expect(page.getByTestId('auth-password')).toBeDisabled();
    await expect(page.getByTestId('auth-signin')).toBeDisabled();
  });

  test('can reset attempts after lockout', async ({ page }) => {
    await page.goto('http://localhost:3000/elements/auth');

    // Trigger lockout
    for (let i = 0; i < 3; i++) {
      await page.getByTestId('auth-username').fill('tomsmith');
      await page.getByTestId('auth-password').fill(`wrong${i}`);
      await page.getByTestId('auth-signin').click();
      await page.waitForTimeout(100); // Brief pause
    }

    // Verify locked
    await expect(page.getByText(/Account locked/)).toBeVisible();

    // Click reset button
    await page.getByRole('button', { name: 'Reset Attempts' }).click();

    // Verify form is enabled again
    await expect(page.getByTestId('auth-username')).toBeEnabled();
    await expect(page.getByTestId('auth-password')).toBeEnabled();
    await expect(page.getByTestId('auth-signin')).toBeEnabled();
  });

  test('form validation prevents empty submissions', async ({ page }) => {
    await page.goto('http://localhost:3000/elements/auth');

    // Try to submit empty form
    await page.getByTestId('auth-signin').click();

    // Should show validation errors
    await expect(page.getByText(/Username must be at least 2 characters/)).toBeVisible();
    await expect(page.getByText(/Password must be at least 6 characters/)).toBeVisible();
  });

  test('form validation for short username', async ({ page }) => {
    await page.goto('http://localhost:3000/elements/auth');

    await page.getByTestId('auth-username').fill('a');
    await page.getByTestId('auth-password').fill('SuperSecretPassword!');
    await page.getByTestId('auth-signin').click();

    await expect(page.getByText(/Username must be at least 2 characters/)).toBeVisible();
  });

  test('form validation for short password', async ({ page }) => {
    await page.goto('http://localhost:3000/elements/auth');

    await page.getByTestId('auth-username').fill('tomsmith');
    await page.getByTestId('auth-password').fill('12345');
    await page.getByTestId('auth-signin').click();

    await expect(page.getByText(/Password must be at least 6 characters/)).toBeVisible();
  });
});