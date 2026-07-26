import { test, expect } from "@playwright/test";

test.describe("Application Flow", () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the app
		await page.goto("http://localhost:3000");
	});

	test("complete application flow", async ({ page }) => {
		// 1. Navigate to New Application page
		await page.click("text=New Application");
		await expect(page).toHaveURL(/.*applications\/new/);

		// 2. Fill application form
		await page.fill('input[name="applicantName"]', "E2E Test User");
		await page.fill('input[name="email"]', "e2e@example.com");
		await page.fill('input[name="phone"]', "+1234567890");
		await page.fill('input[name="currentCompany"]', "E2E Corp");
		await page.fill('input[name="linkedinUrl"]', "https://linkedin.com/in/e2euser");

		// 3. Select job from dropdown
		await page.click('[role="combobox"]');
		await page.click("text=Software Engineer");

		// 4. Submit the application
		await page.click('button[type="submit"]');

		// 5. Wait for navigation to detail page
		await expect(page).toHaveURL(/.*applications\/.*/);

		// 6. Verify application details
		await expect(page.locator("h1")).toContainText("E2E Test User");
		await expect(page.locator(".status-badge")).toContainText("PENDING");
	});

	test("dashboard displays applications", async ({ page }) => {
		// Navigate to dashboard
		await page.click("text=Dashboard");
		await expect(page).toHaveURL(/.*dashboard/);

		// Verify stats are displayed
		await expect(page.locator("text=Total Applications")).toBeVisible();
		await expect(page.locator("text=Success Rate")).toBeVisible();

		// Verify applications table
		await expect(page.locator("table")).toBeVisible();
	});

	test("view application details", async ({ page }) => {
		// Navigate to dashboard
		await page.click("text=Dashboard");

		// Click on first application
		await page.click("text=View");

		// Verify detail page
		await expect(page.locator("h1")).toBeVisible();
		await expect(page.locator("text=Timeline")).toBeVisible();
		await expect(page.locator("text=Application Details")).toBeVisible();
	});

	test("retry failed application", async ({ page }) => {
		// Navigate to dashboard
		await page.click("text=Dashboard");

		// Find a failed application
		const failedApp = page.locator('tr:has-text("FAILED")');
		if ((await failedApp.count()) > 0) {
			await failedApp.locator("text=View").click();

			// Click retry button
			await page.click("text=Retry");

			// Verify retry started
			await expect(page.locator("text=Retrying...")).toBeVisible();
			await expect(page.locator("text=PENDING")).toBeVisible();
		}
	});
});

test.describe("Mock ATS Integration", () => {
	test("access mock ATS page", async ({ page }) => {
		await page.goto("http://localhost:3000");
		await page.click("text=Mock ATS");
		await expect(page).toHaveURL(/.*ats/);

		// Verify ATS page elements
		await expect(page.locator("text=Mock ATS")).toBeVisible();
		await expect(page.locator("text=Open ATS")).toBeVisible();
	});

	test("view ATS applications", async ({ page }) => {
		await page.goto("http://localhost:3000/ats");

		// Wait for applications to load
		await page.waitForSelector("text=Recent Applications");

		// Verify applications list
		const applications = page.locator('[data-testid="ats-application"]');
		await expect(applications).toBeVisible();
	});
});
