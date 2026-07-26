import type { Request, Response } from "express";
import { ApplicationService } from "../services/application.service.ts";
import { created, ok } from "../utils/index.ts";

export class ApplicationController {
	static async getAll(_req: Request, res: Response) {
		const applications = await ApplicationService.getAll();

		res.json(ok(applications));
	}

	static async getById(req: Request, res: Response) {
		const { id } = req.params;
		const application = await ApplicationService.getById(id as string);
		res.json(ok(application));
	}

	static async create(req: Request, res: Response) {
		const application = await ApplicationService.create(req.body);

		res.status(201).json(created(application));
	}

	static async retry(req: Request, res: Response) {
		const { id } = req.params;
		const result = await ApplicationService.retry(id as string);
		res.json(ok(result));
	}

	static async run(req: Request, res: Response) {
		const { id } = req.params;
		const result = await ApplicationService.run(id as string);
		res.json(ok(result));
	}

	static async updateStatus(req: Request, res: Response) {
		const { id } = req.params;
		const data = await ApplicationService.updateStatus(id as string, req.body);
		res.json(ok(data));
	}

	static async addTimeline(req: Request, res: Response) {
		const timeline = await ApplicationService.addTimeline(req.body);

		res.status(201).json(ok(timeline));
	}

	static async addFailure(req: Request, res: Response) {
		const failure = await ApplicationService.addFailure(req.body);

		res.status(201).json(ok(failure));
	}
}
