import type { Request, Response } from "express";
import { atsService } from "../services/ats.service.ts";
import { ok, created } from "../utils/index.ts";

export class AtsController {
	static async getJobs(_req: Request, res: Response) {
		res.json(ok(await atsService.getJobs()));
	}

	static async createJob(req: Request, res: Response) {
		res.status(201).json(created(await atsService.createJob(req.body)));
	}

	static async apply(req: Request, res: Response) {
		res.json(ok(await atsService.apply(req.body)));
	}

	static async login(req: Request, res: Response) {
		res.json(ok(await atsService.login(req.body)));
	}

	static async reset(_req: Request, res: Response) {
		await atsService.reset();

		res.json(
			ok({
				message: "Mock ATS reset successfully",
			}),
		);
	}

	static async getApplications(_req: Request, res: Response) {
		const applications = await atsService.getApplications();

		res.json(ok(applications));
	}
}
