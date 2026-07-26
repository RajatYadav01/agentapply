import type { ApplicationStatus, TimelineStatus } from "@agentapply/config";

export interface TimelineEventInput {
	step: string;
	status: TimelineStatus;
	message: string;
}

export interface FailureEventInput {
	step: string;
	message: string;
	screenshot?: string;
	currentUrl?: string;
}

export interface StatusEventInput {
	status: ApplicationStatus;
	duration?: number;
}
