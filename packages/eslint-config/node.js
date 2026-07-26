import base from "./index.js";
import { nodeGlobals } from "./globals.js";

export default [
	...base,

	{
		files: ["**/*.ts"],

		languageOptions: {
			globals: nodeGlobals,
		},

		rules: {
			"no-process-exit": "error",
		},
	},
];
