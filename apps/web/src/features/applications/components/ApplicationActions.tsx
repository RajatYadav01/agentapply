import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { RefreshCw, Play, RotateCcw } from "lucide-react";
import type { Application } from "@agentapply/types";

interface ApplicationActionsProps {
	application: Application;
	onRetry: () => void;
	onRun: () => void;
	onRefresh: () => void;
	isRetrying: boolean;
	isRunning: boolean;
}

export function ApplicationActions({ application, onRetry, onRun, onRefresh, isRetrying, isRunning }: ApplicationActionsProps) {
	const isPending = application.status === "PENDING";
	const isFailed = application.status === "FAILED";

	return (
		<div className="flex space-x-2">
			<Button variant="outline" size="sm" onClick={onRefresh}>
				<RefreshCw className="mr-2 h-4 w-4" />
				Refresh
			</Button>
			{isPending && (
				<Button size="sm" onClick={onRun} disabled={isRunning}>
					<Play className="mr-2 h-4 w-4" />
					Run
				</Button>
			)}
			{isFailed && (
				<Button size="sm" onClick={onRetry} disabled={isRetrying}>
					<RotateCcw className="mr-2 h-4 w-4" />
					{isRetrying ? "Retrying..." : "Retry"}
				</Button>
			)}
			{application.retryCount > 0 && <Badge variant="secondary">Retry #{application.retryCount}</Badge>}
		</div>
	);
}
