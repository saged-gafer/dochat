import { test, expect } from '@playwright/test';

test('GhostChat loads and allows login', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Check for the title
  await expect(page.getByText('GhostChat')).toBeVisible();

  // Fill login form
  await page.getByPlaceholder('Enter your name').fill('Alice');
  await page.getByPlaceholder('••••••••').fill('password123');
  await page.getByRole('button', { name: 'Access App' }).click();

  // Should now see the connection manager
  await expect(page.getByText('Connect to Partner')).toBeVisible();
  await expect(page.getByText('Your Unique Code')).toBeVisible();

  // Check if a code is generated (it should be deterministic for 'Alice' + 'password123')
  // btoa('Alicepassword123') -> "QWxpY2VwYXNzd29yZDEyMw==" -> "qwxpy2vw"
  const codeElement = page.locator('div.font-mono.text-center');
  await expect(codeElement).toContainText('qwxpy2vw');
});
