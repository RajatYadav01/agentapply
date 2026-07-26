import { randomUUID } from "crypto";
import type { Application, FailureLog, TimelineEvent, ApplicationStatus, TimelineStatus } from "@agentapply/types";
import type { CreateApplicationDto } from "../validation/application.schema.ts";
import { BaseRepository } from "./base.repository.ts";

export class ApplicationRepository extends BaseRepository {
	async create(data: CreateApplicationDto): Promise<Application> {
		return this.db.application.create({
			data: {
				id: randomUUID(),
				status: "PENDING",
				...data,
			},
		});
	}

	async findAll(): Promise<Application[]> {
		return this.db.application.findMany({
			orderBy: {
				createdAt: "desc",
			},
		});
	}

	async findById(id: string): Promise<(Application & { failures: FailureLog[]; timeline: TimelineEvent[] }) | null> {
		return this.db.application.findUnique({
			where: { id },
			include: {
				failures: true,
				timeline: {
					orderBy: { timestamp: "asc" },
				},
			},
		});
	}

	async reset(id: string): Promise<Application> {
		return this.db.application.update({
			where: { id },
			data: {
				status: "PENDING",
				startedAt: new Date(),
				finishedAt: null,
				duration: null,
			},
		});
	}

	async incrementRetry(id: string): Promise<Application> {
		return this.db.application.update({
			where: { id },
			data: {
				retryCount: { increment: 1 },
			},
		});
	}

	async updateStatus(id: string, status: ApplicationStatus, duration?: number): Promise<Application> {
		return this.db.application.update({
			where: { id },
			data: {
				status,
				finishedAt: status === "SUCCESS" || status === "FAILED" ? new Date() : undefined,
				duration,
			},
		});
	}

	async addTimeline(data: { applicationId: string; step: string; status: string; message: string }): Promise<TimelineEvent> {
		return this.db.timelineEvent.create({
			data: {
				applicationId: data.applicationId,
				step: data.step,
				status: data.status as TimelineStatus,
				message: data.message,
			},
		});
	}

	async addFailure(data: { applicationId: string; step: string; message: string; screenshot?: string; url?: string }): Promise<FailureLog> {
		return this.db.failureLog.create({
			data: {
				applicationId: data.applicationId,
				step: data.step,
				message: data.message,
				screenshot: data.screenshot,
				currentUrl: data.url,
			},
		});
	}
}
