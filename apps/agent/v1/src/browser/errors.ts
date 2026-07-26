export class BrowserError extends Error {
	constructor(
		message: string,
		public readonly selector?: string,
	) {
		super(message);
	}
}

export class ElementNotFoundError extends BrowserError {}

export class NavigationTimeoutError extends BrowserError {}

export class UploadFailedError extends BrowserError {}
