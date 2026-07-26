import type { SerializerFn } from "pino";

export const errSerializer: SerializerFn = (err) => {
	return {
		type: err.constructor.name,
		message: err.message,
		stack: err.stack,
		code: err.code,
	};
};

export const applicationSerializer: SerializerFn = (app) => {
	return {
		id: app.id,
		status: app.status,
		retryCount: app.retryCount,
	};
};