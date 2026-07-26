import type { FailureLog } from "./failure-log.ts";
import type { TimelineEvent } from "./timeline.ts";

export type ApplicationStatus = "SUCCESS" | "PENDING" | "RUNNING" | "FAILED";

export interface Application {
	id: string;
	applicantName: string;
	email: string;
	phone?: string | null;
	currentCompany?: string | null;
	linkedinUrl?: string | null;
	jobId?: string;
	jobTitle?: string;
	retryCount: number;
	status: ApplicationStatus;
	startedAt?: Date | null;
	finishedAt?: Date | null;
	duration?: number | null;
	createdAt: Date;
	updatedAt: Date;
	failures?: FailureLog[];
	timeline?: TimelineEvent[];
}

export interface ApplicationStats {
	total: number;
	successful: number;
	failed: number;
	pending: number;
	successRate: number;
}

export interface ApplicationSummary {
	total: number;
	successful: number;
	failed: number;
	successRate: number;
}

export interface CreateApplicationRequest {
	applicantName: string;
	email: string;
	phone?: string;
	currentCompany?: string;
	linkedinUrl?: string;
	jobId: string;
}

export interface Job {
	id: string;
	title: string;
	company: string;
	location: string;
	description?: string;
}

export interface ATSApplication {
	id: string;
	fullName: string;
	email: string;
	phone: string;
	currentCompany: string;
	linkedinUrl: string;
	submittedAt: string;
}

export interface ATSStats {
	total: number;
	successful: number;
	failed: number;
}
