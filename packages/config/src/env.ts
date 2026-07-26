import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { z } from "zod";
import {
	APP_NAME,
	DEFAULT_LOG_LEVEL,
	DEFAULT_API_PORT,
	DEFAULT_AGENT_PORT,
	DEFAULT_ATS_PORT,
	DEFAULT_SCREENSHOT_DIRECTORY,
} from "./constants.ts";

export const envSchema = z.object({
	APP_NAME: z.string().default(APP_NAME),
	NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
	DATABASE_URL: z.string(),
	API_PORT: z.coerce.number().default(DEFAULT_API_PORT),
	API_URL: z.url(),
	AGENT_PORT: z.coerce.number().default(DEFAULT_AGENT_PORT),
	AGENT_URL: z.url(),
	ATS_PORT: z.coerce.number().default(DEFAULT_ATS_PORT),
	ATS_URL: z.url(),
	LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default(DEFAULT_LOG_LEVEL),
	STAGEHAND_HEADLESS: z
		.string()
		.default("false")
		.transform((value) => value === "true"),
	SCREENSHOT_DIRECTORY: z.string().default(DEFAULT_SCREENSHOT_DIRECTORY),
});

/**
 * Traverses up the directory tree to locate the monorepo root .env file.
 * This guarantees variables are injected regardless of which application CWD executes the thread.
 */
function loadRootEnv() {
	const __filename = fileURLToPath(import.meta.url);
	let currentDir = path.dirname(__filename);

	while (currentDir !== path.parse(currentDir).root) {
		const envPath = path.join(currentDir, ".env");
		if (fs.existsSync(envPath)) {
			dotenv.config({ path: envPath });
			return;
		}
		currentDir = path.dirname(currentDir);
	}

	// Fallback to standard process.env mapping if no root file is discovered (e.g., in production)
	dotenv.config();
}

// Execute environment side-effects BEFORE parsing the schema
loadRootEnv();

export const env = envSchema.parse(process.env);
