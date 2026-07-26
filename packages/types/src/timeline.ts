export type TimelineStatus = "INFO" | "SUCCESS" | "ERROR";

export interface TimelineEvent {
	id: string;
	applicationId: string;
	step: string;
	status: TimelineStatus;
	message: string | null;
	timestamp: Date | string;
}
