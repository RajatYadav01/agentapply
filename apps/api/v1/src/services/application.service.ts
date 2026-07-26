import { logger } from "@agentapply/logger";
import type { Application, FailureLog, TimelineEvent } from "@agentapply/types";
import type { CreateApplicationDto } from "../validation/application.schema.ts";
import type { UpdateApplicationStatusDto } from "../validation/application-status.schema.ts";
import type { TimelineDto } from "../validation/timeline.schema.ts";
import type { FailureDto } from "../validation/failure.schema.ts";
import { ApplicationRepository } from "../repositories/application.repository.ts";
import { AgentService } from "./agent.service.ts";
import { RetryService } from "./retry.service.ts";
import { NotFoundError } from "../utils/index.ts";

export class ApplicationService {
	private static repository = new ApplicationRepository();

	static async create(data: CreateApplicationDto): Promise<Application> {
		const application = await this.repository.create(data);
		logger.info({ applicationId: application.id }, "Application created");
		return application;
	}

	static async getAll(): Promise<Application[]> {
		return this.repository.findAll();
	}

	static async getById(id: string): Promise<Application & { failures: FailureLog[]; timeline: TimelineEvent[] }> {
		const application = await this.repository.findById(id);
		if (!application) {
			throw new NotFoundError("Application not found");
		}
		return application;
	}

	static async run(id: string): Promise<{ message: string; application: Application }> {
		const application = await this.getById(id);
		await AgentService.run(id).catch((error) => {
			logger.error({ error, applicationId: id }, "Agent failed");
		});
		return {
			message: "Application execution started",
			application,
		};
	}

	static retry(id: string) {
		return RetryService.retry(id);
	}

	static updateStatus(id: string, dto: UpdateApplicationStatusDto): Promise<Application> {
		return this.repository.updateStatus(id, dto.status, dto.duration);
	}

	static addTimeline(dto: TimelineDto): Promise<TimelineEvent> {
		return this.repository.addTimeline(dto);
	}

	static addFailure(dto: FailureDto): Promise<FailureLog> {
		return this.repository.addFailure(dto);
	}
}
