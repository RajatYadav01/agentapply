import type { APPLICATION_STATUSES, TIMELINE_STATUSES } from "./constants.ts";

export type LogLevel = "fatal" | "error" | "warn" | "info" | "debug" | "trace";

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export type TimelineStatus = (typeof TIMELINE_STATUSES)[number];
