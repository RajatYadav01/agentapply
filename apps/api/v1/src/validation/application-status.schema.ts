import { z } from "zod";

export const UpdateApplicationStatusSchema = z.object({
	status: z.enum(["PENDING", "RUNNING", "SUCCESS", "FAILED"]),
	duration: z.number().optional(),
});

export type UpdateApplicationStatusDto = z.infer<typeof UpdateApplicationStatusSchema>;
