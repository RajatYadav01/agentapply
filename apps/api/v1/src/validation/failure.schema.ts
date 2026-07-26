import { z } from "zod";

export const FailureSchema = z.object({
	applicationId: z.uuid(),
	step: z.string(),
	message: z.string(),
	screenshot: z.string().optional(),
	url: z.string().optional(),
});

export type FailureDto = z.infer<typeof FailureSchema>;
