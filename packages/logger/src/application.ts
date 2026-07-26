import { logger } from "./logger.ts";

export const applicationLogger = logger.child({
	component: "application",
});
