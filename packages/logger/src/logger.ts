import pino from "pino";
import { config } from "@agentapply/config";

const isDevelopment = config.app.environment === "development";

export const logger = pino({
	level: config.logging.level,
	transport: isDevelopment
		? {
				target: "pino-pretty",
				options: {
					colorize: true,
					translateTime: "SYS:standard",
					ignore: "pid,hostname",
				},
			}
		: undefined,
	base: {
		application: config.app.name,
	},
	timestamp: pino.stdTimeFunctions.isoTime,
});
