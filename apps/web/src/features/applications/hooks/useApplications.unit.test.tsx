import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ApplicationStatus } from "@agentapply/types";
import { createTestQueryClient } from "../../../../vitest.setup";
import { applicationsApi } from "../services/applications-api";
import { useApplications } from "./useApplications";

// Mock the API
vi.mock("../api/applications.api", () => ({
	applicationsApi: {
		getApplications: vi.fn(),
		getJobs: vi.fn(),
		createApplication: vi.fn(),
		retryApplication: vi.fn(),
		runApplication: vi.fn(),
	},
}));

const mockApplications = [
	{
		id: "1",
		applicantName: "John Doe",
		email: "john@example.com",
		status: "PENDING" as ApplicationStatus,
		createdAt: new Date(),
		updatedAt: new Date(),
		retryCount: 0,
	},
	{
		id: "2",
		applicantName: "Jane Doe",
		email: "jane@example.com",
		status: "SUCCESS" as ApplicationStatus,
		createdAt: new Date(),
		updatedAt: new Date(),
		retryCount: 0,
	},
];

const mockJobs = [
	{
		id: "job-1",
		title: "Software Engineer",
		company: "Tech Corp",
		location: "Remote",
	},
];

describe("useApplications", () => {
	const queryClient = createTestQueryClient();

	const wrapper = ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);

	beforeEach(() => {
		vi.clearAllMocks();
		queryClient.clear();
	});

	it("fetches applications successfully", async () => {
		vi.mocked(applicationsApi.getApplications).mockResolvedValue(mockApplications);
		vi.mocked(applicationsApi.getJobs).mockResolvedValue(mockJobs);

		const { result } = renderHook(() => useApplications(), { wrapper });

		expect(result.current.isLoading).toBe(true);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.applications).toEqual(mockApplications);
		expect(result.current.jobs).toEqual(mockJobs);
	});

	it("handles error when fetching applications", async () => {
		const error = new Error("Failed to fetch");
		vi.mocked(applicationsApi.getApplications).mockRejectedValue(error);
		vi.mocked(applicationsApi.getJobs).mockResolvedValue(mockJobs);

		const { result } = renderHook(() => useApplications(), { wrapper });

		await waitFor(() => {
			expect(result.current.error).toBeDefined();
		});

		expect(result.current.error?.message).toBe("Failed to fetch");
	});
});
