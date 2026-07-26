import { config } from "@agentapply/config";
import type { Application } from "@agentapply/types";
import type { WorkflowContext } from "../context.ts";

export async function NavigateStep(context: WorkflowContext, application: Application) {
	await context.services.timeline.info(application.id, "NAVIGATE", `Opening Mock ATS at ${config.ats.url}`);

	await context.browser.goto(config.ats.url);
}
