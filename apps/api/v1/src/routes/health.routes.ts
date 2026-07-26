import { Router } from "express";
import { HealthController } from "../controllers/health.controller.ts";

export const healthRouter: Router = Router();

/**
 * GET /api/health
 */
healthRouter.get("/", HealthController.get);
