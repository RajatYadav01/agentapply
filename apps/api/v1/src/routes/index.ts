import { Router } from "express";
import { healthRouter } from "./health.routes.ts";
import { applicationRouter } from "./application.routes.ts";
import { atsRouter } from "./ats.routes.ts";

export const router: Router = Router();

/**
 * Health routes
 */
router.use("/", healthRouter);

/**
 * Application routes (core domain)
 */
router.use("/applications", applicationRouter);

/**
 * ATS routes
 */
router.use("/ats", atsRouter);
