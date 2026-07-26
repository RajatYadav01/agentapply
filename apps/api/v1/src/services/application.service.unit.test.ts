import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApplicationService } from "./application.service.ts";
import { ApplicationRepository } from "../repositories/application.repository.ts";

vi.mock("@/repositories/application.repository");

describe("ApplicationService", () => {
	const mockApplication = {
		id: "app-1",
		applicantName: "John Doe",
		email: "john@example.com",
		status: "PENDING",
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("create", () => {
		it("creates a new application", async () => {
			const createData = {
				applicantName: "John Doe",
				email: "john@example.com",
				jobId: "job-1",
			};

			vi.spyOn(ApplicationRepository.prototype, "create").mockResolvedValue(mockApplication as any);

			const result = await ApplicationService.create(createData);
			expect(result).toEqual(mockApplication);
		});
	});

	describe("getById", () => {
		it("returns application when found", async () => {
			vi.spyOn(ApplicationRepository.prototype, "findById").mockResolvedValue(mockApplication as any);

			const result = await ApplicationService.getById("app-1");
			expect(result).toEqual(mockApplication);
		});

		it("throws error when application not found", async () => {
			vi.spyOn(ApplicationRepository.prototype, "findById").mockResolvedValue(null);

			await expect(ApplicationService.getById("non-existent")).rejects.toThrow("Application not found");
		});
	});
});
