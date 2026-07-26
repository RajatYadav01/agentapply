import { describe, it, expect, afterEach } from "vitest";
import request from "supertest";
import { prisma } from "@agentapply/db";
import { createApp } from "../app.ts";

const app = createApp();

describe("Applications API Integration", () => {
	let createdApplicationId: string;

	afterEach(async () => {
		// Clean up after each test
		await prisma.application.deleteMany();
		await prisma.failureLog.deleteMany();
		await prisma.timelineEvent.deleteMany();
	});

	describe("POST /api/applications", () => {
		it("creates a new application", async () => {
			const response = await request(app).post("/api/applications").send({
				applicantName: "Integration Test User",
				email: "integration@example.com",
				phone: "+1234567890",
				currentCompany: "Test Corp",
				linkedinUrl: "https://linkedin.com/in/testuser",
				jobId: "123e4567-e89b-12d3-a456-426614174000",
			});

			expect(response.status).toBe(201);
			expect(response.body.success).toBe(true);
			expect(response.body.data).toBeDefined();
			expect(response.body.data.applicantName).toBe("Integration Test User");
			expect(response.body.data.status).toBe("PENDING");

			createdApplicationId = response.body.data.id;
		});

		it("fails with invalid data", async () => {
			const response = await request(app).post("/api/applications").send({
				applicantName: "Invalid",
				email: "invalid-email",
				// Missing jobId
			});

			expect(response.status).toBe(400);
			expect(response.body.success).toBe(false);
		});
	});

	describe("GET /api/applications", () => {
		it("returns all applications", async () => {
			// Create test data
			await request(app).post("/api/applications").send({
				applicantName: "User 1",
				email: "user1@example.com",
				jobId: "123e4567-e89b-12d3-a456-426614174000",
			});

			await request(app).post("/api/applications").send({
				applicantName: "User 2",
				email: "user2@example.com",
				jobId: "123e4567-e89b-12d3-a456-426614174000",
			});

			const response = await request(app).get("/api/applications");

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data).toHaveLength(2);
		});
	});

	describe("GET /api/applications/:id", () => {
		it("returns application by id", async () => {
			// Create application
			const createResponse = await request(app).post("/api/applications").send({
				applicantName: "Detail Test",
				email: "detail@example.com",
				jobId: "123e4567-e89b-12d3-a456-426614174000",
			});

			const appId = createResponse.body.data.id;

			const response = await request(app).get(`/api/applications/${appId}`);

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data.id).toBe(appId);
			expect(response.body.data.applicantName).toBe("Detail Test");
		});

		it("returns 404 for non-existent application", async () => {
			const response = await request(app).get("/api/applications/non-existent-id");

			expect(response.status).toBe(404);
		});
	});

	describe("PATCH /api/applications/:id/status", () => {
		it("updates application status", async () => {
			// Create application
			const createResponse = await request(app).post("/api/applications").send({
				applicantName: "Status Test",
				email: "status@example.com",
				jobId: "123e4567-e89b-12d3-a456-426614174000",
			});

			const appId = createResponse.body.data.id;

			const response = await request(app).patch(`/api/applications/${appId}/status`).send({
				status: "RUNNING",
			});

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data.status).toBe("RUNNING");
		});
	});
});
