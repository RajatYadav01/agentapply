import { apiClient } from "@/services/api-client";
import type { Application, CreateApplicationRequest, Job } from "@agentapply/types";

export const applicationsApi = {
	getApplications: async (): Promise<Application[]> => {
		const response = await apiClient.get<{ data: Application[] }>("/applications");
		return response.data.data;
	},

	getApplication: async (id: string): Promise<Application> => {
		const response = await apiClient.get<{ data: Application }>(`/applications/${id}`);
		return response.data.data;
	},

	createApplication: async (data: CreateApplicationRequest): Promise<Application> => {
		const response = await apiClient.post<{ data: Application }>("/applications", data);
		return response.data.data;
	},

	retryApplication: async (id: string): Promise<{ message: string }> => {
		const response = await apiClient.post<{ data: { message: string } }>(`/applications/${id}/retry`);
		return response.data.data;
	},

	runApplication: async (id: string): Promise<{ message: string }> => {
		const response = await apiClient.post<{ data: { message: string } }>(`/applications/${id}/run`);
		return response.data.data;
	},

	getJobs: async (): Promise<Job[]> => {
		const response = await apiClient.get<{ data: Job[] }>("/ats/jobs");
		return response.data.data;
	},
};
