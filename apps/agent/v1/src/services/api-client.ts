import type { Application } from "@agentapply/types";

export class ApiClient {
	constructor(private readonly baseUrl: string) {}

	private async request<T>(path: string, options?: RequestInit): Promise<T> {
		const response = await fetch(`${this.baseUrl}${path}`, {
			headers: {
				"Content-Type": "application/json",
			},
			...options,
		});

		const json = await response.json();

		if (!response.ok) {
			throw new Error(json.error?.message ?? "API Error");
		}

		return json.data;
	}

	getApplication(id: string): Promise<Application> {
		return this.request<Application>(`/applications/${id}`);
	}

	getApplications(): Promise<Application[]> {
		return this.request<Application[]>("/applications");
	}

	updateStatus(id: string, status: string, duration?: number): Promise<Application> {
		return this.request<Application>(`/applications/${id}/status`, {
			method: "PATCH",
			body: JSON.stringify({
				status,
				...(duration !== undefined && { duration }),
			}),
		});
	}

	addTimeline(payload: unknown) {
		return this.request("/applications/timeline", {
			method: "POST",
			body: JSON.stringify(payload),
		});
	}

	addFailure(payload: unknown) {
		return this.request("/applications/failures", {
			method: "POST",
			body: JSON.stringify(payload),
		});
	}
}
