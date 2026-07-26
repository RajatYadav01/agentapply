export interface Job {
	id: string;
	title: string;
	company: string;
	location: string;
	description?: string;
}

export interface AtsApplication {
	id: string;
	jobId: string;
	applicationId: string;
	status: string;
	appliedAt: Date;
}

export class atsRepository {
	private readonly jobs: Job[] = [];
	private readonly applications: AtsApplication[] = [];

	getJobs(): Job[] {
		return this.jobs;
	}

	findJob(id: string): Job | undefined {
		return this.jobs.find((job) => job.id === id);
	}

	createJob(job: Job): Job {
		this.jobs.push(job);
		return job;
	}

	createApplication(application: AtsApplication): AtsApplication {
		this.applications.push(application);
		return application;
	}

	getApplications(): AtsApplication[] {
		return this.applications;
	}

	reset(): void {
		this.jobs.length = 0;
		this.applications.length = 0;
	}
}