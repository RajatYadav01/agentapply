import { Selectors } from "../../browser/selectors.ts";
import type { WorkflowContext } from "../context.ts";

export async function SubmitStep(context: WorkflowContext) {
	await context.services.timeline.info(context.applicationId, "SUBMIT", "Submitting application");

	await context.browser.clickSelectors(Selectors.submit.asString().split(","));
}
