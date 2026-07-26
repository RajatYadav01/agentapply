import express, { type Express } from "express";
import { config } from "@agentapply/config";
import { logger } from "@agentapply/logger";
import { runApplicationAgent } from "./runner.ts";

export const app: Express = express();
app.use(express.json());

app.get("/agent/", (req, res) => {
	res.status(200).json({
		status: "healthy",
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
		service: "agent-apply-driver-node",
	});
});

app.post("/agent/start", (req, res) => {
	const { applicationId } = req.body;

	if (!applicationId) {
		logger.warn({ path: "/agent/start" }, "Rejected request: missing applicationId");
		return res.status(400).json({ error: "Missing applicationId in request body" });
	}

	logger.info({ applicationId }, "Received valid trigger. Dispatching browser context thread...");

	// Hand off to the background execution layer without blocking the response thread
	runApplicationAgent(applicationId).catch((error) => {
		logger.error(
			{
				applicationId,
				error: error instanceof Error ? error.message : String(error),
			},
			"Asynchronous agent execution crash",
		);
	});

	// Return 202 Accepted to acknowledge the worker has assumed processing control
	return res.status(202).json({
		message: "Agent workflow dispatched successfully",
		applicationId,
	});
});

app.listen(config.agent.port, () => {
	logger.info({ port: config.agent.port, environment: config.app.environment }, `Agent v1 started on configured port`);
});
