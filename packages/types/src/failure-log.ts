export interface FailureLog {
	id: string;
	applicationId: string;
	step: string;
	message: string;
	screenshot?: string | null;
	currentUrl?: string | null;
	timestamp: Date | string;
}
