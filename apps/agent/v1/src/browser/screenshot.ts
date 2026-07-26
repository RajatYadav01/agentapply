import { mkdir } from "fs/promises";
import path from "node:path";
import { config } from "@agentapply/config";

export async function screenshotPath(applicationId: string, name: string) {
	const directory = path.join(config.storage.screenshots, applicationId);

	await mkdir(directory, {
		recursive: true,
	});

	return path.join(directory, `${Date.now()}-${name}.png`);
}
