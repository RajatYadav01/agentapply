export default {
	// Frontend JavaScript/TypeScript Linting
	"**/*.{js,jsx,ts,tsx,mjs,cjs}": ["pnpm eslint --fix --"],

	// Code Formatting for All Shared Web/Config Files
	"**/*.{json,md,html,css,scss,js,jsx,ts,tsx,mjs,cjs,yaml,yml}": ["pnpm prettier --write --ignore-unknown --log-level warn --"],
};
