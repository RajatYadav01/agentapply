import globals from "globals";

export const browserGlobals = globals.browser;

export const nodeGlobals = globals.node;

export const sharedGlobals = {
	...globals.es2024,
};
