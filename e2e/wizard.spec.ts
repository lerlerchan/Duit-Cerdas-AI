import { test, expect } from '@playwright/test';

test.describe('Duit-Cerdas AI 3-Step Wizard', () => {
  test.beforeEach(async ({ page }) => {
    // Start on the app homepage
    await page.goto('/');
  });

  test('Happy path — full 3-step flow with correct choice', async ({ page }) => {
    // Mock bazi-profile API
    await page.route('**/api/agents/bazi-profile', route =>
      route.abort()
    );
    await page.route('**/api/agents/bazi-profile', route =>
      route.continue()
    );

    // Actually, let me set up proper mocks
    await page.route('**/api/agents/bazi-profile', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          userId: 'test-user-123',
          profile: {
            element: 'Wood',
            core_trait: 'Strategic',
            primary_vulnerability: 'Romance scams',
            risk_level: 'MODERATE',
            explanation: 'Wood element test',
            mental_firewall_tip: 'Pause before acting',
          },
        }),
      });
    });

    // Mock simulate-quest API
    await page.route('**/api/agents/simulate-quest', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          scenario_title: 'Fake Job Offer',
          scammer_message: 'Bro transfer RM200 cepat bossku!',
          choices: [
            { id: 'A', action_text: 'Click the link and transfer', feedback: 'You fell for it!' },
            { id: 'B', action_text: 'Block and ignore', feedback: 'Smart move!' },
            { id: 'C', action_text: 'Call the number to verify', feedback: 'Wise choice!' },
          ],
        }),
      });
    });

    // Mock reward-token API
    await page.route('**/api/agents/reward-token', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          rewarded: true,
          growth_tokens: 1,
        }),
      });
    });

    // Step 1: Fill DOB and generate profile
    await page.fill('input[type="date"]', '1990-01-01');
    await page.click('button:has-text("Discover My Profile")');

    // Assert: profile card visible with element "Wood"
    await expect(page.locator('h2:has-text("Wood")')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Strategic')).toBeVisible();

    // Step 2: Enter quest
    await page.click('button:has-text("Enter AI Quest")');

    // Assert: scammer message visible and 3 choices rendered
    await expect(page.locator('text=Fake Job Offer')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Bro transfer RM200')).toBeVisible();
    await expect(page.locator('button:has-text("A. Click the link")')).toBeVisible();
    await expect(page.locator('button:has-text("B. Block and ignore")')).toBeVisible();
    await expect(page.locator('button:has-text("C. Call the number")')).toBeVisible();

    // Step 3: Choose correct answer (B)
    await page.click('button:has-text("B. Block and ignore")');

    // Assert: Guru's Advice and growth token visible
    await expect(page.locator('text=Guru\'s Advice')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Smart move!')).toBeVisible();
    await expect(page.locator('.growth-token-chip').first()).toBeVisible();
    await expect(page.locator('.growth-token-chip').first()).toContainText('1 Growth Token');
  });

  test('Step 1 — button disabled when DOB empty', async ({ page }) => {
    const button = page.locator('button:has-text("Discover My Profile")');
    await expect(button).toBeDisabled();
  });

  test('Step 1 — button enabled when DOB filled', async ({ page }) => {
    const button = page.locator('button:has-text("Discover My Profile")');
    await page.fill('input[type="date"]', '1990-01-01');
    await expect(button).toBeEnabled();
  });

  test('Step 1 — handles API error gracefully', async ({ page }) => {
    // Mock API to return 500
    await page.route('**/api/agents/bazi-profile', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' }),
      });
    });

    await page.fill('input[type="date"]', '1990-01-01');
    const button = page.locator('button:has-text("Discover My Profile")');
    await button.click();

    // Assert: page still responsive (button re-enables after error)
    // Wait a bit for API call to fail and state to recover
    await page.waitForTimeout(1000);
    await expect(button).toBeEnabled({ timeout: 5000 });
  });

  test('Step 3 — wrong choice (A) does not earn token', async ({ page }) => {
    // Mock bazi-profile
    await page.route('**/api/agents/bazi-profile', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          userId: 'test-user-123',
          profile: {
            element: 'Fire',
            core_trait: 'Passionate',
            primary_vulnerability: 'Crypto scams',
            risk_level: 'HIGH',
            explanation: 'Fire element test',
            mental_firewall_tip: 'Stay calm',
          },
        }),
      });
    });

    // Mock simulate-quest
    await page.route('**/api/agents/simulate-quest', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          scenario_title: 'Telegram Pump Scheme',
          scammer_message: 'Join our group, 500% returns guaranteed!',
          choices: [
            { id: 'A', action_text: 'Join and invest RM1000', feedback: 'Scammed!' },
            { id: 'B', action_text: 'Block and ignore', feedback: 'Avoided danger!' },
            { id: 'C', action_text: 'Report to authorities', feedback: 'Good citizen!' },
          ],
        }),
      });
    });

    // Mock reward-token to return false
    await page.route('**/api/agents/reward-token', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          rewarded: false,
          growth_tokens: null,
        }),
      });
    });

    // Complete steps 1-2
    await page.fill('input[type="date"]', '1985-06-15');
    await page.click('button:has-text("Discover My Profile")');
    await expect(page.locator('h2:has-text("Fire")')).toBeVisible({ timeout: 5000 });

    await page.click('button:has-text("Enter AI Quest")');
    await expect(page.locator('text=500% returns')).toBeVisible({ timeout: 5000 });

    // Choose wrong answer (A)
    await page.click('button:has-text("A. Join and invest")');

    // Assert: no growth token chip (or chip is not visible)
    await expect(page.locator('.growth-token-chip')).not.toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Scammed!')).toBeVisible();
  });

  test('Restart button resets to Step 1', async ({ page }) => {
    // Mock all APIs
    await page.route('**/api/agents/bazi-profile', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          userId: 'test-user-456',
          profile: {
            element: 'Water',
            core_trait: 'Intuitive',
            primary_vulnerability: 'Phishing',
            risk_level: 'MODERATE',
            explanation: 'Water element test',
            mental_firewall_tip: 'Trust your instincts',
          },
        }),
      });
    });

    await page.route('**/api/agents/simulate-quest', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          scenario_title: 'Phishing Email',
          scammer_message: 'Click here to verify your account',
          choices: [
            { id: 'A', action_text: 'Click the link', feedback: 'Phished!' },
            { id: 'B', action_text: 'Delete email', feedback: 'Safe!' },
            { id: 'C', action_text: 'Go directly to website', feedback: 'Excellent!' },
          ],
        }),
      });
    });

    await page.route('**/api/agents/reward-token', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          rewarded: true,
          growth_tokens: 1,
        }),
      });
    });

    // Complete to step 3
    await page.fill('input[type="date"]', '1992-03-20');
    await page.click('button:has-text("Discover My Profile")');
    await expect(page.locator('h2:has-text("Water")')).toBeVisible({ timeout: 5000 });

    await page.click('button:has-text("Enter AI Quest")');
    await expect(page.locator('text=Phishing Email')).toBeVisible({ timeout: 5000 });

    await page.click('button:has-text("B. Delete email")');
    await expect(page.locator('text=Guru\'s Advice')).toBeVisible({ timeout: 5000 });

    // Click Restart
    await page.click('button:has-text("Restart")');

    // Assert: back to step 1 (date input visible, profile hidden)
    await expect(page.locator('input[type="date"]')).toBeVisible();
    await expect(page.locator('input[type="date"]')).toHaveValue('');
    await expect(page.locator('text=Water')).not.toBeVisible();
    await expect(page.locator('text=Guru\'s Advice')).not.toBeVisible();
  });
});
