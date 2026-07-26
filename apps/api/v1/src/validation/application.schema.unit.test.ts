import { describe, it, expect } from "vitest";
import { CreateApplicationSchema } from "./application.schema.ts";

describe("Application Schema Validation", () => {
	it("validates valid application data", () => {
		const validData = {
			applicantName: "John Doe",
			email: "john@example.com",
			phone: "+1234567890",
			currentCompany: "Tech Corp",
			linkedinUrl: "https://linkedin.com/in/johndoe",
			jobId: "123e4567-e89b-12d3-a456-426614174000",
		};

		const result = CreateApplicationSchema.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it("fails validation with invalid email", () => {
		const invalidData = {
			applicantName: "John Doe",
			email: "invalid-email",
			jobId: "123e4567-e89b-12d3-a456-426614174000",
		};

		const result = CreateApplicationSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		expect(result.error?.issues[0].path).toContain("email");
	});

	it("fails validation with missing required fields", () => {
		const invalidData = {
			email: "john@example.com",
		};

		const result = CreateApplicationSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("validates optional fields correctly", () => {
		const minimalValidData = {
			applicantName: "Jane Doe",
			email: "jane@example.com",
			jobId: "123e4567-e89b-12d3-a456-426614174000",
		};

		const result = CreateApplicationSchema.safeParse(minimalValidData);
		expect(result.success).toBe(true);
	});
});
