import { createApp } from "./app.ts";
import { config } from "@agentapply/config";
import { logger } from "@agentapply/logger";

/**
 * Create Express app
 */
export const app = createApp();

/**
 * Start API
 */
const server = app.listen(config.api.port, () => {
	logger.info(
		{
			port: config.api.port,
			environment: config.app.environment,
		},
		"API v1 started on configured port",
	);
});

/**
 * Graceful shutdown handler
 */
function shutdown(signal: string) {
	logger.warn({ signal }, "Shutdown signal received");

	server.close((err) => {
		if (err) {
			logger.error(err, "Error during server shutdown");
			process.exit(1);
		}

		logger.info("API v1 closed gracefully");
		process.exit(0);
	});
}

/**
 * Handle termination signals
 */
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

/**
 * Handle unexpected errors
 */
process.on("uncaughtException", (err) => {
	logger.fatal(err, "Uncaught Exception");
	shutdown("uncaughtException");
});

process.on("unhandledRejection", (reason) => {
	logger.fatal(reason, "Unhandled Rejection");
	shutdown("unhandledRejection");
});
