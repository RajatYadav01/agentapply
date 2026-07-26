import { defineConfig } from "prisma/config";
import { config } from "@agentapply/config";

export default defineConfig({
	schema: "prisma/schema.prisma",
	migrations: {
		path: "prisma/migrations",
	},
	datasource: {
		url: config.database.url,
	},
});
