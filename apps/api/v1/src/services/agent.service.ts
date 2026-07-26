import { config } from "@agentapply/config";
import { logger } from "@agentapply/logger";

export class AgentService {
	/**
	 * Trigger the agent to run for a specific application
	 */
	static async run(applicationId: string): Promise<{ queued: boolean; applicationId: string; agentUrl: string }> {
		const agentUrl = config.agent.url;

		try {
			// Updated path from /run to /start to match the Express service route
			const response = await fetch(`${agentUrl}/start`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ applicationId }),
				signal: AbortSignal.timeout(5000), // 5 second timeout
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Agent service returned ${response.status}: ${errorText}`);
			}

			const result = await response.json();
			logger.info({ applicationId, result }, "Agent triggered successfully via internal HTTP");

			return {
				queued: false, // Set to false since it's executing immediately on-demand
				applicationId,
				agentUrl,
			};
		} catch (error) {
			logger.error(
				{
					applicationId,
					error: error instanceof Error ? error.message : String(error),
					agentUrl,
				},
				"CRITICAL: Failed to communicate with the private Agent service.",
			);

			// Throw the error back to your controller/router so the API can
			// return a 503/500 status to the frontend instead of masking it as "queued".
			throw new Error(`Failed to initialize browser agent node: ${error instanceof Error ? error.message : "Service Unavailable"}`);
		}
	}

	/**
	 * Check if agent is healthy (Render calls this or your dashboard can monitor it)
	 */
	static async health(): Promise<boolean> {
		try {
			const response = await fetch(`${config.agent.url}/`, {
				signal: AbortSignal.timeout(3000),
			});
			return response.ok;
		} catch {
			return false;
		}
	}
}
