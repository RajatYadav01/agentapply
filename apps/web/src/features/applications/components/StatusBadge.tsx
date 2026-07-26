import { Badge } from "@/components/ui/Badge";
import type { ApplicationStatus } from "@agentapply/types";

interface StatusBadgeProps {
	status: ApplicationStatus;
	className?: string;
}

const statusConfig = {
	PENDING: { variant: "warning" as const, icon: "⏳" },
	RUNNING: { variant: "info" as const, icon: "🔄" },
	SUCCESS: { variant: "success" as const, icon: "✅" },
	FAILED: { variant: "error" as const, icon: "❌" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
	const config = statusConfig[status];

	return (
		<Badge variant={config.variant} className={className}>
			<span className="mr-1">{config.icon}</span>
			{status}
		</Badge>
	);
}
