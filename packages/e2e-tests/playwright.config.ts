import { defineConfig, devices } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: "./test",
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: "html",
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('')`. */
		baseURL: "http://localhost:5173",

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: "on-first-retry",
	},

	/* Run the local dev server before starting the tests */
	webServer: [
		{
			command: "pnpm dev:web",
			url: "http://localhost:5173",
			reuseExistingServer: !process.env.CI,
			cwd: path.resolve(__dirname, "../../"),
			timeout: 120 * 1000,
			env: {
				VITE_BASE_URL: "/",
				VITE_API_URL: "http://localhost:3000/api/v1",
				VITE_ATS_URL: "http://localhost:5000/ats",
			},
			stdout: "pipe",
			stderr: "pipe",
		},
		{
			command: "pnpm dev:api",
			url: "http://localhost:3000/api",
			reuseExistingServer: !process.env.CI,
			cwd: path.resolve(__dirname, "../../"),
			timeout: 120 * 1000,
			env: {
				NODE_ENV: "production",
				DATABASE_URL: "postgres://postgres:password@localhost:5432/test_db",
				API_PORT: "3000",
				API_URL: "http://localhost:3000/api/v1",
				AGENT_URL: "http://localhost:4000/agent/v1",
				ATS_URL: "http://localhost:5000/ats",
			},
			stdout: "pipe",
			stderr: "pipe",
		},
		{
			command: "pnpm dev:agent",
			url: "http://localhost:4000/api",
			reuseExistingServer: !process.env.CI,
			cwd: path.resolve(__dirname, "../../"),
			timeout: 120 * 1000,
			env: {
				NODE_ENV: "production",
				DATABASE_URL: "postgres://postgres:password@localhost:5432/test_db",
				AGENT_PORT: "4000",
				API_URL: "http://localhost:3000/api/v1",
				AGENT_URL: "http://localhost:4000/agent/v1",
				ATS_URL: "http://localhost:5000/ats",
				STAGEHAND_HEADLESS: "true",
			},
			stdout: "pipe",
			stderr: "pipe",
		},
		{
			command: "pnpm dev:ats",
			url: "http://localhost:5000/api",
			reuseExistingServer: !process.env.CI,
			cwd: path.resolve(__dirname, "../../"),
			timeout: 120 * 1000,
			env: {
				NODE_ENV: "production",
				DATABASE_URL: "postgres://postgres:password@localhost:5432/test_db",
				ATS_PORT: "5000",
				API_URL: "http://localhost:3000/api/v1",
				AGENT_URL: "http://localhost:4000/agent/v1",
				ATS_URL: "http://localhost:5000/ats",
			},
			stdout: "pipe",
			stderr: "pipe",
		},
	],

	/* Configure projects for major browsers */
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},

		{
			name: "firefox",
			use: { ...devices["Desktop Firefox"] },
		},
		{
			name: "webkit",
			use: { ...devices["Desktop Safari"] },
		},

		/* Test against mobile viewports. */
		// {
		//   name: 'Mobile Chrome',
		//   use: { ...devices['Pixel 5'] },
		// },
		// {
		//   name: 'Mobile Safari',
		//   use: { ...devices['iPhone 12'] },
		// },

		/* Test against branded browsers. */
		// {
		//   name: 'Microsoft Edge',
		//   use: { ...devices['Desktop Edge'], channel: 'msedge' },
		// },
		// {
		//   name: 'Google Chrome',
		//   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
		// },
	],
});
