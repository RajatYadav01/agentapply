import { z } from "zod";

export const TimelineSchema = z.object({
	applicationId: z.uuid(),
	step: z.string(),
	status: z.string(),
	message: z.string(),
});

export type TimelineDto = z.infer<typeof TimelineSchema>;
