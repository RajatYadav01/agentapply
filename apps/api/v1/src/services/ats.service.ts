import { randomUUID } from "crypto";
import { atsRepository } from "../repositories/ats.repository.ts";

export class atsService {
	private static repository = new atsRepository();

	static async login(data: { email: string; password: string }) {
		if (!data.email || !data.password) {
			throw new Error("Invalid credentials");
		}

		return {
			token: randomUUID(),
			user: {
				email: data.email,
			},
			expiresIn: 3600,
		};
	}

	static async getJobs() {
		return this.repository.getJobs();
	}

	static async createJob(data: { title: string; company: string; location: string; description?: string }) {
		return this.repository.createJob({
			id: randomUUID(),
			...data,
		});
	}

	static async apply(data: { jobId: string; applicationId: string }) {
		const job = this.repository.findJob(data.jobId);

		if (!job) {
			throw new Error("Job not found");
		}

		return this.repository.createApplication({
			id: randomUUID(),
			status: "SUBMITTED",
			appliedAt: new Date(),
			...data,
		});
	}

	static async getApplications() {
		return this.repository.getApplications();
	}

	static async reset() {
		this.repository.reset();
	}
}
