import { ApiClient } from "./api-client.ts";
import { ApplicationService } from "./application.service.ts";
import { TimelineService } from "./timeline.service.ts";
import { FailureService } from "./failure.service.ts";

export class WorkflowService {
	public readonly applications;
	public readonly timeline;
	public readonly failures;

	constructor(api: ApiClient) {
		this.applications = new ApplicationService(api);
		this.timeline = new TimelineService(api);
		this.failures = new FailureService(api);
	}
}
