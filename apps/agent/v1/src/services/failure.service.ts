import { ApiClient } from "./api-client.ts";

export class FailureService {
	constructor(private readonly api: ApiClient) {}

	create(data: { applicationId: string; step: string; message: string; screenshot?: string; currentUrl?: string }) {
		return this.api.addFailure(data);
	}
}
