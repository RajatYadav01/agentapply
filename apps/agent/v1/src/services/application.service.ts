import type { Application } from "@agentapply/types";
import { ApiClient } from "./api-client.ts";

export class ApplicationService {
	constructor(private readonly api: ApiClient) {}

	get(id: string): Promise<Application> {
		return this.api.getApplication(id);
	}

	getAll(): Promise<Application[]> {
		return this.api.getApplications();
	}

	setRunning(id: string): Promise<Application> {
		return this.api.updateStatus(id, "RUNNING");
	}

	setSuccess(id: string, duration: number): Promise<Application> {
		return this.api.updateStatus(id, "SUCCESS", duration);
	}

	setFailed(id: string, duration: number): Promise<Application> {
		return this.api.updateStatus(id, "FAILED", duration);
	}

	setPending(id: string): Promise<Application> {
		return this.api.updateStatus(id, "PENDING");
	}
}
