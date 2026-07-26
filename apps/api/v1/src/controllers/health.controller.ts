import type { Request, Response } from "express";
import { config } from "@agentapply/config";
import { ok } from "../utils/index.ts";

export class HealthController {
	static get(_req: Request, res: Response) {
		res.json(
			ok({
				status: "ok",
				service: config.app.name,
				environment: config.app.environment,
				timestamp: new Date().toISOString(),
			}),
		);
	}
}
