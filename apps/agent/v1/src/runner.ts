import { ApplicationWorkflow } from "./workflow/application-workflow.ts";

export async function runApplicationAgent(applicationId: string) {
	const workflow = new ApplicationWorkflow();

	try {
		console.log(`[Agent Cluster] Initializing automated thread for ID: ${applicationId}`);
		await workflow.run(applicationId);
		console.log(`[Agent Cluster] Automated thread finished safely for ID: ${applicationId}`);
	} catch (error) {
		// Log it internally but don't rethrow it aggressively unless you want
		// your express global error handler to capture it.
		console.error(`[Agent Cluster] Operational crash on session ${applicationId}:`, error);

		// Ideally, your workflow.run() internal code should catch this,
		// write a 'FAILED' status to the shared database, and capture a screenshot.
	}
}
