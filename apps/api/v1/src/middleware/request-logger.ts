import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import { logger } from "@agentapply/logger";

/**
 * Extend Express Request type to include requestId
 */
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Express {
		interface Request {
			requestId?: string;
			startTime?: number;
		}
	}
}

/**
 * Request Logger Middleware
 *
 * Adds:
 * - requestId (for traceability across logs)
 * - timing information
 * - structured logging for each request lifecycle
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
	const requestId = randomUUID();
	const startTime = Date.now();

	req.requestId = requestId;
	req.startTime = startTime;

	/**
	 * Attach requestId to response headers for debugging
	 */
	res.setHeader("x-request-id", requestId);

	logger.info(
		{
			requestId,
			method: req.method,
			path: req.originalUrl,
			userAgent: req.headers["user-agent"],
		},
		"Incoming request",
	);

	/**
	 * Capture response finish event
	 */
	res.on("finish", () => {
		const duration = Date.now() - startTime;

		logger.info(
			{
				requestId,
				method: req.method,
				path: req.originalUrl,
				statusCode: res.statusCode,
				durationMs: duration,
			},
			"Request completed",
		);
	});

	next();
}
