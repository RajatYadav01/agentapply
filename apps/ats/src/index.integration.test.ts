import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "./index.ts";

describe("Mock ATS Integration", () => {
	describe("GET /", () => {
		it("serves the ATS form", async () => {
			const response = await request(app).get("/");
			expect(response.status).toBe(200);
			expect(response.text).toContain("Apply for Position");
			expect(response.text).toContain("Software Engineer at TechCorp");
		});
	});

	describe("POST /api/apply", () => {
		it("submits application successfully", async () => {
			const response = await request(app)
				.post("/api/apply")
				.field("fullName", "Test User")
				.field("email", "test@example.com")
				.field("phone", "+1234567890")
				.field("currentCompany", "Test Corp")
				.field("linkedinUrl", "https://linkedin.com/in/testuser")
				.attach("resume", Buffer.from("test resume content"), "resume.pdf");

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.applicationId).toBeDefined();
		});

		it("fails without required fields", async () => {
			const response = await request(app)
				.post("/api/apply")
				.field("email", "test@example.com")
				.attach("resume", Buffer.from("test"), "resume.pdf");

			expect(response.status).toBe(400);
			expect(response.body.success).toBe(false);
			expect(response.body.error).toBe("Missing required fields");
		});

		it("fails without resume file", async () => {
			const response = await request(app)
				.post("/api/apply")
				.field("fullName", "Test User")
				.field("email", "test@example.com")
				.field("phone", "+1234567890");

			expect(response.status).toBe(400);
			expect(response.body.success).toBe(false);
			expect(response.body.error).toBe("Resume file is required");
		});
	});

	describe("GET /api/applications", () => {
		it("returns all applications", async () => {
			const response = await request(app).get("/api/applications");
			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(Array.isArray(response.body.data)).toBe(true);
		});
	});

	describe("DELETE /api/reset", () => {
		it("resets the ATS", async () => {
			const response = await request(app).delete("/api/reset");
			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.message).toBe("ATS reset successfully");
		});
	});
});
