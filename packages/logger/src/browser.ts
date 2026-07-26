import { logger } from "./logger.ts";

export const browserLogger = logger.child({
	component: "browser",
});
