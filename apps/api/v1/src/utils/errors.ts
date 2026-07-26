export class ApiError extends Error {
	constructor(
		public readonly status: number,
		message: string,
		public readonly code?: string,
	) {
		super(message);

		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export class BadRequestError extends ApiError {
	constructor(message: string) {
		super(400, message);
	}
}

export class NotFoundError extends ApiError {
	constructor(message: string) {
		super(404, message);
	}
}

export class ConflictError extends ApiError {
	constructor(message: string) {
		super(409, message);
	}
}

export class UnauthorizedError extends ApiError {
	constructor(message = "Unauthorized") {
		super(401, message);
	}
}
