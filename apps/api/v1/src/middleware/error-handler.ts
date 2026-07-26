import type { NextFunction, Request, Response } from "express";
import { logger } from "@agentapply/logger";
import { ApiError, failure } from "../utils/index.ts";

/**
 * Global error handler middleware
 */
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
	const requestId = req.requestId;

	const error = err instanceof Error ? err : new Error("Unknown error");

	logger.error(
		{
			requestId,
			message: error.message,
			stack: error.stack,
			path: req.originalUrl,
			method: req.method,
		},
		"Unhandled API error",
	);

	if (error instanceof ApiError) {
		res.status(error.status).json(failure(error.message, requestId, error.code));

		return;
	}

	res.status(500).json(failure("Internal Server Error", requestId));
}
