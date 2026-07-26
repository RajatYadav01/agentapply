import { beforeAll, afterAll, afterEach } from "vitest";
import { prisma } from "@agentapply/db";

// Clean database before and after tests
beforeAll(async () => {
	// Ensure clean state
});

afterEach(async () => {
	// Clean up after each test
	await prisma.application.deleteMany();
	await prisma.failureLog.deleteMany();
	await prisma.timelineEvent.deleteMany();
});

afterAll(async () => {
	await prisma.$disconnect();
});