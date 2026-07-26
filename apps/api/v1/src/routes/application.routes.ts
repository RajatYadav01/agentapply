import { Router } from "express";
import { asyncHandler } from "../middleware/async-handler.ts";
import { validate } from "../middleware/validate.ts";
import { ApplicationController } from "../controllers/application.controller.ts";
import { CreateApplicationSchema } from "../validation/application.schema.ts";
import { UpdateApplicationStatusSchema } from "../validation/application-status.schema.ts";
import { TimelineSchema } from "../validation/timeline.schema.ts";
import { FailureSchema } from "../validation/failure.schema.ts";

export const applicationRouter: Router = Router();

/**
 * POST /api/applications
 * Create new application
 */
applicationRouter.post("/", validate(CreateApplicationSchema), asyncHandler(ApplicationController.create));

/**
 * GET /api/applications
 * Fetch all applications
 */
applicationRouter.get("/", asyncHandler(ApplicationController.getAll));

/**
 * GET /api/applications/:id
 * Fetch single application
 */
applicationRouter.get("/:id", asyncHandler(ApplicationController.getById));

/**
 * POST /api/applications/:id/run
 * Manually trigger agent for an application
 */
applicationRouter.post("/:id/run", asyncHandler(ApplicationController.run));

/**
 * POST /api/applications/:id/retry
 * Reset application to PENDING state
 * (Actual browser automation will come in Stagehand milestone)
 */
applicationRouter.post("/:id/retry", asyncHandler(ApplicationController.retry));

/**
 * PATCH /api/applications/:id/status
 * Update application status (used by agent)
 */
applicationRouter.patch("/:id/status", validate(UpdateApplicationStatusSchema), asyncHandler(ApplicationController.updateStatus));

/**
 * POST /api/timeline
 * Add timeline event (used by agent)
 */
applicationRouter.post("/timeline", validate(TimelineSchema), asyncHandler(ApplicationController.addTimeline));

/**
 * POST /api/failures
 * Add failure log (used by agent)
 */
applicationRouter.post("/failures", validate(FailureSchema), asyncHandler(ApplicationController.addFailure));
