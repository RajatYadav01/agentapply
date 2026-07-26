export interface ApiSuccess<T> {
	success: true;
	data: T;
}

export interface ApiFailure {
	success: false;
	error: {
		message: string;
		code?: string;
		requestId?: string;
	};
}

export function ok<T>(data: T): ApiSuccess<T> {
	return {
		success: true,
		data,
	};
}

export function created<T>(data: T): ApiSuccess<T> {
	return {
		success: true,
		data,
	};
}

export function failure(message: string, requestId?: string, code?: string): ApiFailure {
	return {
		success: false,
		error: {
			message,
			requestId,
			code,
		},
	};
}
