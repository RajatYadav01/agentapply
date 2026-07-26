import { Router } from "express";
import { asyncHandler } from "../middleware/async-handler.ts";
import { validate } from "../middleware/validate.ts";
import { AtsController } from "../controllers/ats.controller.ts";
import { ApplySchema, CreateJobSchema, LoginSchema } from "../validation/ats.schema.ts";

export const atsRouter: Router = Router();

atsRouter.get("/jobs", asyncHandler(AtsController.getJobs));

atsRouter.post("/jobs", validate(CreateJobSchema), asyncHandler(AtsController.createJob));

atsRouter.post("/login", validate(LoginSchema), asyncHandler(AtsController.login));

atsRouter.post("/apply", validate(ApplySchema), asyncHandler(AtsController.apply));

atsRouter.get("/applications", asyncHandler(AtsController.getApplications));

atsRouter.delete("/reset", asyncHandler(AtsController.reset));
