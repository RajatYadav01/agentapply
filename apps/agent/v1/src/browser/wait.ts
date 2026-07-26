import { browserLogger } from "@agentapply/logger";
import { retry } from "./retry.ts";
import { StagehandClient } from "./stagehand-client.ts";

export async function waitForSelector(client: StagehandClient, selector: string, timeout = 10000) {
	await retry(async () => {
		await client.page.waitForSelector(selector, { timeout });
	}, `waitFor ${selector}`);
}

export async function waitForFunction(client: StagehandClient, fn: () => Promise<boolean>, timeout = 10000, interval = 1000) {
	const startTime = Date.now();

	while (Date.now() - startTime < timeout) {
		try {
			if (await fn()) {
				return true;
			}
		} catch (error) {
			// Function threw error, continue waiting
			browserLogger.debug({ error }, "Wait function threw error");
		}
		await new Promise((resolve) => setTimeout(resolve, interval));
	}

	throw new Error(`Wait function timed out after ${timeout}ms`);
}
