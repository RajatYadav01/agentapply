import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { logger } from "@agentapply/logger";
import { requestLogger } from "./middleware/request-logger.ts";
import { notFoundHandler } from "./middleware/not-found.ts";
import { errorHandler } from "./middleware/error-handler.ts";
import { router } from "./routes/index.ts";

/**
 * Creates and configures the Express application
 */
export function createApp(): Express {
	const app = express();

	/**
	 * Trust proxy (important for deployment behind reverse proxies)
	 */
	app.set("trust proxy", 1);

	/**
	 * Core middleware
	 */
	app.use(helmet());

	app.use(
		cors({
			origin: true,
			credentials: true,
		}),
	);

	app.use(express.json({ limit: "2mb" }));
	app.use(express.urlencoded({ extended: true }));

	/**
	 * HTTP request logging (basic)
	 * We still use structured logger for business events
	 */
	app.use(
		morgan("dev", {
			stream: {
				write: (message: string) => {
					logger.info({ context: "http" }, message.trim());
				},
			},
		}),
	);

	/**
	 * Custom structured request logger
	 */
	app.use(requestLogger);

	/**
	 * Routes
	 */
	app.use("/api", router);

	/**
	 * 404 handler
	 */
	app.use(notFoundHandler);

	/**
	 * Error handler (must be last)
	 */
	app.use(errorHandler);

	return app;
}
