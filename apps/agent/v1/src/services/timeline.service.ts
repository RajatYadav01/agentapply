import type { TimelineStatus } from "@agentapply/config";
import { ApiClient } from "./api-client.ts";

export class TimelineService {
	constructor(private readonly api: ApiClient) {}

	add(applicationId: string, step: string, status: TimelineStatus, message: string) {
		return this.api.addTimeline({
			applicationId,
			step,
			status,
			message,
		});
	}

	info(applicationId: string, step: string, message: string) {
		return this.add(applicationId, step, "INFO", message);
	}

	success(applicationId: string, step: string, message: string) {
		return this.add(applicationId, step, "SUCCESS", message);
	}

	error(applicationId: string, step: string, message: string) {
		return this.add(applicationId, step, "ERROR", message);
	}
}
