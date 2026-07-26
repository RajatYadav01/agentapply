import { z } from "zod";

export const CreateApplicationSchema = z.object({
	applicantName: z.string().min(2),
	email: z.email(),
	phone: z.string().optional(),
	currentCompany: z.string().optional(),
	linkedinUrl: z.url().optional(),
    jobId: z.uuid("Invalid job ID"),
});

export type CreateApplicationDto = z.infer<typeof CreateApplicationSchema>;
