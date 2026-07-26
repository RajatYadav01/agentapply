import { browserLogger } from "@agentapply/logger";

export async function retry<T>(action: () => Promise<T>, description: string, maxAttempts = 3, delay = 1000): Promise<T> {
	let lastError: unknown;

	for (let attempt = 1; attempt <= maxAttempts; attempt++) {
		try {
			return await action();
		} catch (error) {
			lastError = error;

			browserLogger.warn(
				{
					attempt,
					description,
				},
				"Retrying browser action",
			);

			if (attempt < maxAttempts) {
				await new Promise((r) => setTimeout(r, delay));
			}
		}
	}

	throw lastError;
}
