import type { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wraps async route handlers and forwards errors to Express error middleware.
 *
 * Without this, async errors are silently ignored in Express v4.
 *
 * Usage:
 *   router.get("/health", asyncHandler(async (req, res) => {
 *     res.json({ ok: true });
 *   }));
 */
export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler {
	return function asyncUtilWrap(req, res, next) {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
}
