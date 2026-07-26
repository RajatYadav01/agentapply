import { prisma } from "@agentapply/db";

const MAX_RETRIES = 3;

export class RetryPolicy {
	static async validate(applicationId: string) {
		const application = await prisma.application.findUnique({
			where: {
				id: applicationId,
			},
		});

		if (!application) {
			return {
				ok: false,
				reason: "Application not found",
			};
		}

		if (application.status !== "FAILED") {
			return {
				ok: false,
				reason: "Only failed applications may be retried",
			};
		}

		const failures = await prisma.failureLog.count({
			where: {
				applicationId,
			},
		});

		if (failures >= MAX_RETRIES) {
			return {
				ok: false,
				reason: "Maximum retries exceeded",
			};
		}

		return {
			ok: true,
		};
	}
}
