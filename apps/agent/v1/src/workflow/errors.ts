export class WorkflowError extends Error {
	constructor(
		message: string,
		public readonly step: string,
	) {
		super(message);
	}
}

export class NavigationError extends WorkflowError {
	constructor(message: string) {
		super(message, "NAVIGATE");
	}
}

export class FormFillError extends WorkflowError {
	constructor(message: string) {
		super(message, "FILL_FORM");
	}
}

export class SubmissionError extends WorkflowError {
	constructor(message: string) {
		super(message, "SUBMIT");
	}
}
