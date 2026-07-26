import { describe, it, expect, beforeEach } from "vitest";
import { prisma } from "@agentapply/db";
import { ApplicationRepository } from "./application.repository.ts";

describe("ApplicationRepository", () => {
	const repository = new ApplicationRepository();
	let createdApplicationId: string;

	beforeEach(async () => {
		// Clean up before each test
		await prisma.application.deleteMany();
		await prisma.failureLog.deleteMany();
		await prisma.timelineEvent.deleteMany();
	});

	it("creates an application", async () => {
		const data = {
			applicantName: "Test User",
			email: "test@example.com",
			phone: "+1234567890",
			currentCompany: "Test Corp",
			linkedinUrl: "https://linkedin.com/in/testuser",
			jobId: "job-1",
		};

		const result = await repository.create(data);
		expect(result).toBeDefined();
		expect(result.id).toBeDefined();
		expect(result.applicantName).toBe(data.applicantName);
		expect(result.email).toBe(data.email);
		expect(result.status).toBe("PENDING");

		createdApplicationId = result.id;
	});

	it("finds all applications", async () => {
		// Create test data
		await repository.create({
			applicantName: "User 1",
			email: "user1@example.com",
			jobId: "job-1",
		});
		await repository.create({
			applicantName: "User 2",
			email: "user2@example.com",
			jobId: "job-1",
		});

		const results = await repository.findAll();
		expect(results).toHaveLength(2);
		expect(results[0].applicantName).toBeDefined();
	});

	it("finds application by id", async () => {
		const created = await repository.create({
			applicantName: "Find Me",
			email: "findme@example.com",
			jobId: "job-1",
		});

		const found = await repository.findById(created.id);
		expect(found).toBeDefined();
		expect(found?.applicantName).toBe("Find Me");
	});

	it("updates application status", async () => {
		const created = await repository.create({
			applicantName: "Status Update",
			email: "status@example.com",
			jobId: "job-1",
		});

		const updated = await repository.updateStatus(created.id, "SUCCESS", 30);
		expect(updated.status).toBe("SUCCESS");
		expect(updated.duration).toBe(30);
	});

	it("adds timeline event", async () => {
		const created = await repository.create({
			applicantName: "Timeline User",
			email: "timeline@example.com",
			jobId: "job-1",
		});

		const event = await repository.addTimeline({
			applicationId: created.id,
			step: "TEST_STEP",
			status: "INFO",
			message: "Test timeline event",
		});

		expect(event).toBeDefined();
		expect(event.step).toBe("TEST_STEP");
		expect(event.status).toBe("INFO");
	});
});
