import { logger } from "@agentapply/logger";
import { ApplicationRepository } from "../repositories/application.repository.ts";
import { BadRequestError, NotFoundError } from "../utils/index.ts";
import { RetryPolicy } from "../utils/retry-policy.ts";
import { AgentService } from "./agent.service.ts";

export class RetryService {
	private static repository = new ApplicationRepository();

	static async retry(id: string) {
		const validation = await RetryPolicy.validate(id);

		if (!validation.ok) {
			throw new BadRequestError(validation.reason!);
		}

		const application = await this.repository.findById(id);

		if (!application) {
			throw new NotFoundError("Application not found");
		}

		await this.repository.reset(id);

		logger.warn(
			{
				applicationId: id,
			},
			"Retry started",
		);

		await AgentService.run(id).catch((error) =>
			logger.error(
				{
					error,
					applicationId: id,
				},
				"Retry failed",
			),
		);

		return {
			message: "Retry started",
		};
	}
}
