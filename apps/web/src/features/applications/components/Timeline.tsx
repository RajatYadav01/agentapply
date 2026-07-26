import { CheckCircle, AlertCircle, Info } from "lucide-react";
import type { TimelineEvent, TimelineStatus } from "@agentapply/types";
import { formatDate } from "@/utils";

interface TimelineProps {
	events: TimelineEvent[];
}

const statusConfig: Record<TimelineStatus, { icon: React.ReactNode; borderColor: string }> = {
	SUCCESS: { icon: <CheckCircle className="h-4 w-4 text-green-500" />, borderColor: "border-green-500" },
	ERROR: { icon: <AlertCircle className="h-4 w-4 text-red-500" />, borderColor: "border-red-500" },
	INFO: { icon: <Info className="h-4 w-4 text-blue-500" />, borderColor: "border-blue-500" },
};

export function Timeline({ events }: TimelineProps) {
	if (events.length === 0) {
		return <p className="py-8 text-center text-gray-500">No timeline events yet.</p>;
	}

	return (
		<div className="flow-root">
			<ul className="-mb-8">
				{events.map((event, index) => {
					const config = statusConfig[event.status as TimelineStatus] || statusConfig.INFO;

					return (
						<li key={event.id}>
							<div className="relative pb-8">
								{index < events.length - 1 && <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />}
								<div className="relative flex space-x-3">
									<div>
										<span className={`flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white ${config.borderColor}`}>
											{config.icon}
										</span>
									</div>
									<div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
										<div>
											<p className="text-sm text-gray-900">{event.step}</p>
											{event.message && <p className="mt-1 text-sm text-gray-500">{event.message}</p>}
										</div>
										<div className="text-right text-sm whitespace-nowrap text-gray-500">
											<time dateTime={event.timestamp.toString()}>{formatDate(event.timestamp)}</time>
										</div>
									</div>
								</div>
							</div>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
