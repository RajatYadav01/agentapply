import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import type { WorkflowContext } from "../context.ts";

export class CaptureScreenshotStep {
	static async execute(context: WorkflowContext, name: string) {
		const path = `screenshots/${context.applicationId}/${name}.png`;

		await mkdir(dirname(path), {
			recursive: true,
		});

		await context.browser.screenshot(context.applicationId, path);

		return path;
	}
}
