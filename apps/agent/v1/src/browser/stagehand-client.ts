import { Stagehand } from "@browserbasehq/stagehand";
import { browserLogger } from "@agentapply/logger";
import { retry } from "./retry.ts";
import { screenshotPath } from "./screenshot.ts";

export class StagehandClient {
	private readonly browser = new Stagehand({
		env: "LOCAL",
	});

	public get page() {
		return this.browser.context.pages()[0];
	}

	async launch() {
		await this.browser.init();
		browserLogger.info("Browser instance initialized");
	}

	async close() {
		await this.browser.close();
	}

	async goto(url: string) {
		await retry(async () => {
			await this.browser.context.pages()[0].goto(url, { waitUntil: "networkidle" });
		}, `goto ${url}`);
	}

	async fill(selector: string, value: string) {
		await retry(() => this.browser.context.pages()[0].locator(selector).fill(value), `fill ${selector}`);
	}

	async click(selector: string) {
		await retry(() => this.browser.context.pages()[0].locator(selector).click(), `click ${selector}`);
	}

	async upload(selector: string, file: string) {
		await retry(() => this.browser.context.pages()[0].locator(selector).setInputFiles(file), `upload ${selector}`);
	}

	async url() {
		return this.browser.context.pages()[0].url();
	}

	async waitFor(selector: string, timeout = 10000) {
		const page = this.page;
		await retry(async () => {
			await page.waitForSelector(selector, { timeout });
		}, `waitFor ${selector}`);
	}

	async screenshot(applicationId: string, name: string) {
		const file = await screenshotPath(applicationId, name);
		await this.browser.context.pages()[0].screenshot({
			path: file,
			fullPage: true,
		});
		return file;
	}

	async fillSelectors(selectors: string[], value: string) {
		for (const selector of selectors) {
			try {
				await this.fill(selector, value);
				return;
			} catch (err) {
				console.error(`Failed to fill selector ${selector}:`, err);
				browserLogger.debug({ selector }, "Selector fill attempt bypassed");
			}
		}
		throw new Error("No selector matched for form filling step");
	}

	async clickSelectors(selectors: string[]) {
		for (const selector of selectors) {
			try {
				await this.click(selector);
				return;
			} catch (err) {
				console.error(`Failed to click selector ${selector}:`, err);
				browserLogger.debug({ selector }, "Selector click attempt bypassed");
			}
		}
		throw new Error("Unable to click any matched selector targets");
	}

	async uploadSelectors(selectors: string[], file: string) {
		for (const selector of selectors) {
			try {
				await this.upload(selector, file);
				return;
			} catch (err) {
				console.error(`Failed to upload file using selector ${selector}:`, err);
				browserLogger.debug({ selector }, "Selector upload attempt bypassed");
			}
		}
		throw new Error("Upload failed across all targeted selectors");
	}
}
