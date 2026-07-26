import type { RequestHandler } from "express";
import type { ZodObject } from "zod";
import { BadRequestError } from "../utils/index.ts";

export function validate(schema: ZodObject): RequestHandler {
	return (req, _res, next) => {
		const result = schema.safeParse(req.body);

		if (!result.success) {
			return next(new BadRequestError(result.error.issues.map((i) => i.message).join(", ")));
		}

		req.body = result.data;

		next();
	};
}
