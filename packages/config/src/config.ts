import { env } from "./env.ts";

export const config = {
	app: {
		name: env.APP_NAME,
		environment: env.NODE_ENV,
	},
	api: {
		url: env.API_URL,
        port: env.API_PORT,
	},
	agent: {
		url: env.AGENT_URL,
        port: env.AGENT_PORT,
	},
    ats: {
		url: env.ATS_URL,
        port: env.ATS_PORT,
	},
	database: {
		url: env.DATABASE_URL,
	},
	logging: {
		level: env.LOG_LEVEL,
	},
	browser: {
		headless: env.STAGEHAND_HEADLESS,
	},
	storage: {
		screenshots: env.SCREENSHOT_DIRECTORY,
	},
} as const;
