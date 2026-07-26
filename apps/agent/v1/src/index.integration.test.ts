import supertest from "supertest";
import { describe, expect, it, vi } from "vitest";
import { app } from "./index.ts";
import * as runner from "./runner.ts";

// Mock the async runner execution so we don't spin up Playwright during integration runs
vi.spyOn(runner, "runApplicationAgent").mockResolvedValue(undefined);

describe("POST /start Agent Trigger Route", () => {
	it("should accept valid applicationId and trigger background agent asynchronously", async () => {
		const res = await supertest(app).post("/start").send({ applicationId: "app_123456" });

		expect(res.status).toBe(202);
		expect(res.body).toEqual({
			message: "Agent workflow dispatched",
			applicationId: "app_123456",
		});
		expect(runner.runApplicationAgent).toHaveBeenCalledWith("app_123456");
	});
});
