import { describe, it, expect, vi } from "vitest";
import { ApplicationController } from "./application.controller.ts";
import { ApplicationService } from "../services/application.service.ts";

vi.mock("@/services/application.service");

describe("ApplicationController", () => {
	const mockRequest = (params = {}, body = {}) =>
		({
			params,
			body,
		}) as any;

	const mockResponse = () => {
		const res: any = {};
		res.status = vi.fn().mockReturnValue(res);
		res.json = vi.fn().mockReturnValue(res);
		return res;
	};

	describe("getAll", () => {
		it("returns all applications", async () => {
			const mockApplications = [
				{ id: "1", applicantName: "John" },
				{ id: "2", applicantName: "Jane" },
			];
			vi.spyOn(ApplicationService, "getAll").mockResolvedValue(mockApplications as any);

			const req = mockRequest();
			const res = mockResponse();

			await ApplicationController.getAll(req, res);

			expect(res.json).toHaveBeenCalledWith({
				success: true,
				data: mockApplications,
			});
		});
	});

	describe("create", () => {
		it("creates application and triggers agent", async () => {
			const mockApplication = { id: "app-1", applicantName: "John Doe" };
			const mockBody = { applicantName: "John Doe", email: "john@example.com", jobId: "job-1" };

			vi.spyOn(ApplicationService, "create").mockResolvedValue(mockApplication as any);
			vi.spyOn(ApplicationService, "run").mockResolvedValue({
				message: "Agent triggered",
				application: mockApplication as any,
			});

			const req = mockRequest({}, mockBody);
			const res = mockResponse();

			await ApplicationController.create(req, res);

			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				data: mockApplication,
			});
		});
	});
});
