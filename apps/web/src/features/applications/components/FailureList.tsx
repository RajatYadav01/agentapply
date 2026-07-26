import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatDate } from "@/utils";
import type { FailureLog } from "@agentapply/types";

interface FailureListProps {
	failures: FailureLog[];
}

export function FailureList({ failures }: FailureListProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-red-600">Failures</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{failures.map((failure) => (
						<div key={failure.id} className="border-l-4 border-red-500 py-2 pl-4">
							<div className="flex items-start justify-between">
								<div>
									<p className="font-medium text-gray-900">{failure.step}</p>
									<p className="mt-1 text-sm text-gray-600">{failure.message}</p>
									{failure.currentUrl && <p className="mt-1 text-xs text-gray-400">URL: {failure.currentUrl}</p>}
								</div>
								<span className="text-xs text-gray-400">{formatDate(failure.timestamp)}</span>
							</div>
							{failure.screenshot && (
								<div className="mt-2">
									<img
										src={`/screenshots/${failure.screenshot}`}
										alt="Failure screenshot"
										className="h-auto max-h-48 max-w-full rounded-lg border object-contain shadow-sm"
									/>
								</div>
							)}
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
