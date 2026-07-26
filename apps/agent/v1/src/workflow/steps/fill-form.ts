import { browserLogger } from "@agentapply/logger";
import type { Application } from "@agentapply/types";
import type { WorkflowContext } from "../context.ts";
import { Selectors } from "../../browser/selectors.ts";

export async function FillFormStep(context: WorkflowContext, app: Application) {
	await context.services.timeline.info(app.id, "FILL_FORM", "Filling application form");

	// Wait for the delayed field to appear (simulates real ATS behavior)
	try {
		await context.browser.waitFor("#companyGroup.visible", 3000);
		browserLogger.info({ applicationId: app.id }, "Delayed field appeared");
	} catch (error) {
		browserLogger.warn({ applicationId: app.id, error: String(error) }, "Delayed field didn't appear, continuing anyway");
	}

	// Fill full name
	await context.browser.fillSelectors(Selectors.fullName.getSelectors(), app.applicantName);
	await context.services.timeline.info(app.id, "FILL_FORM", "Filled full name");

	// Fill email
	await context.browser.fillSelectors(Selectors.email.getSelectors(), app.email);
	await context.services.timeline.info(app.id, "FILL_FORM", "Filled email");

	// Fill phone
	if (app.phone) {
		await context.browser.fillSelectors(Selectors.phone.getSelectors(), app.phone);
		await context.services.timeline.info(app.id, "FILL_FORM", "Filled phone");
	}

	// Fill company (optional - appears after delay)
	if (app.currentCompany) {
		try {
			await context.browser.fillSelectors(Selectors.company.getSelectors(), app.currentCompany);
			await context.services.timeline.info(app.id, "FILL_FORM", "Filled current company");
		} catch (error) {
			browserLogger.warn({ applicationId: app.id, error: String(error) }, "Company field not available yet, skipping");
		}
	}

	// Fill LinkedIn (optional)
	if (app.linkedinUrl) {
		await context.browser.fillSelectors(Selectors.linkedin.getSelectors(), app.linkedinUrl);
		await context.services.timeline.info(app.id, "FILL_FORM", "Filled LinkedIn URL");
	}

	// The job is selected via the dropdown in the ATS form
	// The agent doesn't need to fill it manually as it's pre-selected

	await context.services.timeline.success(app.id, "FILL_FORM", "Form filled successfully");
}
