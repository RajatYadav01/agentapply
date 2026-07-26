import { StagehandClient } from "../browser/stagehand-client.ts";
import { WorkflowService } from "../services/index.ts";

export interface WorkflowContext {
	applicationId: string;
	browser: StagehandClient;
	services: WorkflowService;
	startedAt: number;
}
