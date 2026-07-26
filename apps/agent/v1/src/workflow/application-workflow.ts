import { config } from "@agentapply/config";
import { applicationLogger } from "@agentapply/logger";
import { ApiClient } from "../services/api-client.ts";
import { StagehandClient } from "../browser/stagehand-client.ts";
import { WorkflowService } from "../services/index.ts";
import type { WorkflowContext } from "./context.ts";
import { NavigateStep } from "./steps/navigate.ts";
import { FillFormStep } from "./steps/fill-form.ts";
import { SubmitStep } from "./steps/submit.ts";
import { VerifySuccessStep } from "./steps/verify-success.ts";
import { CaptureScreenshotStep } from "./steps/capture-screenshot.ts";

export class ApplicationWorkflow {
	private readonly api = new ApiClient(config.api.url);
	private readonly services = new WorkflowService(this.api);
	private readonly browser = new StagehandClient();

	async run(applicationId: string) {
		const startedAt = Date.now();

		const context: WorkflowContext = {
			applicationId,
			browser: this.browser,
			services: this.services,
			startedAt,
		};

		await this.browser.launch();

		try {
			// Get application details
			const application = await context.services.applications.get(applicationId);

			// Update status to running
			await context.services.applications.setRunning(applicationId);
			await context.services.timeline.info(applicationId, "INIT", "Workflow started");

			// Execute workflow steps
			await NavigateStep(context, application);
			await FillFormStep(context, application);
			await SubmitStep(context);
			await VerifySuccessStep(context);

			const duration = Date.now() - startedAt;

			// Capture success screenshot
			const successScreenshot = await CaptureScreenshotStep.execute(context, "success");
			await context.services.timeline.success(context.applicationId, "SCREENSHOT", `Captured success screenshot: ${successScreenshot}`);

			// Update status to success
			await context.services.applications.setSuccess(applicationId, duration);
			await context.services.timeline.success(applicationId, "COMPLETE", "Application submitted successfully");

			applicationLogger.info({ applicationId, duration }, "Workflow completed successfully");
		} catch (error) {
			await this.handleFailure(context, error);
			throw error;
		} finally {
			await this.browser.close();
		}
	}

	private async handleFailure(context: WorkflowContext, error: unknown) {
		const duration = Date.now() - context.startedAt;
		const message = error instanceof Error ? error.message : "Unknown error";

		let screenshot = null;
		try {
			screenshot = await CaptureScreenshotStep.execute(context, "failure");
		} catch (screenshotError) {
			applicationLogger.error({ applicationId: context.applicationId, error: screenshotError }, "Failed to capture failure screenshot");
		}

		// Get current URL
		let currentUrl = null;
		try {
			currentUrl = await context.browser.url();
		} catch (urlError) {
			// Ignore URL errors
		}

		// Create failure log
		await context.services.failures.create({
			applicationId: context.applicationId,
			step: "WORKFLOW",
			message,
			screenshot: screenshot || undefined,
			currentUrl: currentUrl || undefined,
		});

		// Add timeline error
		await context.services.timeline.error(context.applicationId, "FAILED", message);

		// Update status to failed
		await context.services.applications.setFailed(context.applicationId, duration);

		applicationLogger.error({ applicationId: context.applicationId, error: message, duration }, "Workflow failed");
	}
}
