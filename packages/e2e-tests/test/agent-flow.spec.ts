import { test, expect } from "@playwright/test";
import { chromium } from "playwright";
import { prisma } from "@agentapply/db";

test.describe("Agent Workflow", () => {
	let applicationId: string;
	let browser: any;
	let page: any;

	test.beforeEach(async () => {
		// Create test application
		const application = await prisma.application.create({
			data: {
				applicantName: "Agent Test User",
				email: "agent@example.com",
				phone: "+1234567890",
				currentCompany: "Agent Corp",
				linkedinUrl: "https://linkedin.com/in/agentuser",
				jobId: "test-job-1",
				status: "PENDING",
			},
		});
		applicationId = application.id;

		// Launch browser
		browser = await chromium.launch();
		page = await browser.newPage();
	});

	test.afterEach(async () => {
		await browser?.close();
		await prisma.application.deleteMany({
			where: { id: applicationId },
		});
	});

	test("agent fills and submits application", async () => {
		// Navigate to ATS
		await page.goto("http://localhost:3001");

		// Fill form
		await page.fill("#fullName", "Agent Test User");
		await page.fill("#email", "agent@example.com");
		await page.fill("#phone", "+1234567890");

		// Wait for delayed field
		await page.waitForSelector("#currentCompany:not([disabled])", { timeout: 5000 });
		await page.fill("#currentCompany", "Agent Corp");
		await page.fill("#linkedinUrl", "https://linkedin.com/in/agentuser");

		// Upload resume
		await page.setInputFiles("#resume", "test-resume.pdf");

		// Wait for submit button to enable
		await page.waitForSelector("#submitBtn:not([disabled])", { timeout: 5000 });

		// Submit
		await page.click("#submitBtn");

		// Verify success
		await expect(page.locator("#successMessage.show")).toBeVisible();
	});

	test("agent handles errors gracefully", async () => {
		// Navigate to ATS
		await page.goto("http://localhost:3001");

		// Try to submit without filling required fields
		await page.fill("#fullName", "Test User");
		await page.fill("#email", "invalid-email");

		// Upload resume
		await page.setInputFiles("#resume", "test-resume.pdf");

		// Wait for submit button to enable
		await page.waitForSelector("#submitBtn:not([disabled])", { timeout: 5000 });

		// Submit
		await page.click("#submitBtn");

		// Verify error handling
		const errorMessage = await page.locator("text=Error").count();
		expect(errorMessage).toBeGreaterThan(0);
	});
});
