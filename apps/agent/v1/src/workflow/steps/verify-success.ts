import { browserLogger } from "@agentapply/logger";
import { Selectors } from "../../browser/selectors.ts";
import type { WorkflowContext } from "../context.ts";

export async function VerifySuccessStep(context: WorkflowContext) {
	await context.services.timeline.info(context.applicationId, "VERIFY", "Verifying application submission");

	// Try multiple success indicators
	const successSelectors = [
		...Selectors.successMessage.getSelectors(),
		"#successMessage.show",
		"text=Application Submitted",
		"text=Your application has been received",
	];

	let found = false;
	for (const selector of successSelectors) {
		try {
			await context.browser.waitFor(selector, 5000);
			browserLogger.info({ applicationId: context.applicationId, selector }, "Found success indicator");
			found = true;
			break;
		} catch (error) {
			// Continue to next selector
			browserLogger.debug({ applicationId: context.applicationId, selector }, "Success indicator not found");
		}
	}

	if (!found) {
		// Check if form was hidden (indicating success)
		try {
			await context.browser.waitFor('form[style*="display: none"]', 3000);
			found = true;
			browserLogger.info({ applicationId: context.applicationId }, "Form hidden, indicating success");
		} catch (error) {
			// Still not found
		}
	}

	if (!found) {
		// Check URL for success indicators
		const currentUrl = await context.browser.url();
		if (currentUrl.includes("success") || currentUrl.includes("thank")) {
			found = true;
			browserLogger.info({ applicationId: context.applicationId, url: currentUrl }, "URL indicates success");
		}
	}

	if (!found) {
		throw new Error("Could not verify application submission success");
	}

	await context.services.timeline.success(context.applicationId, "VERIFY", "Application submission verified");
}
