import { z } from "zod";

export const LoginSchema = z.object({
	email: z.email(),
	password: z.string().min(6),
});

export const CreateJobSchema = z.object({
	title: z.string().min(2),
	company: z.string().min(2),
	location: z.string().min(2),
	description: z.string().optional(),
});

export const ApplySchema = z.object({
	jobId: z.uuid(),
	applicationId: z.uuid(),
});

export type LoginDto = z.infer<typeof LoginSchema>;
export type CreateJobDto = z.infer<typeof CreateJobSchema>;
export type ApplyDto = z.infer<typeof ApplySchema>;
