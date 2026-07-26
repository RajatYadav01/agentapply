import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/features/applications/components/StatusBadge";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatDuration, formatRelativeTime, truncateText } from "@/utils";
import { Eye, Clock, ArrowUpRight, ShieldAlert } from "lucide-react";
import type { Application } from "@agentapply/types";

interface RecentApplicationsTableProps {
	applications: Application[];
}

export function RecentApplicationsTable({ applications }: RecentApplicationsTableProps) {
	if (applications.length === 0) {
		return (
			<Card className="border-dashed border-2 border-gray-200 shadow-none">
				<CardContent>
					<div className="py-12 text-center flex flex-col items-center justify-center max-w-sm mx-auto">
						<div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
							<ArrowUpRight className="h-6 w-6" />
						</div>
						<h3 className="text-md font-semibold text-gray-900">No active sessions found</h3>
						<p className="text-gray-500 text-sm mt-1">
							You haven't dispatched any browser automation sessions yet. Setup a profile path to track runtime operations here.
						</p>
						<Link to="/applications/new" className="mt-4 w-full">
							<Button className="w-full shadow-sm">Spawn First Agent</Button>
						</Link>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="shadow-sm border-gray-200 overflow-hidden">
			<CardHeader className="bg-white pb-4 border-b">
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="text-lg font-bold text-gray-900">Job Pipeline Engine</CardTitle>
						<CardDescription className="text-xs text-gray-500">Live operational execution threads managed across your running driver nodes</CardDescription>
					</div>
					<Badge variant="outline" className="font-mono text-xs px-2.5 py-1 bg-gray-50 text-gray-600 border-gray-200">
						Active Contexts: {applications.length}
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="p-0">
				<div className="overflow-x-auto">
					<table className="w-full text-sm text-left">
						<thead>
							<tr className="bg-gray-50/70 border-b border-gray-100 text-gray-500 font-medium select-none">
								<th className="px-6 py-3.5 tracking-wide text-xs uppercase">Target Context Instance</th>
								<th className="px-6 py-3.5 tracking-wide text-xs uppercase">Automation State</th>
								<th className="px-6 py-3.5 tracking-wide text-xs uppercase">Execution Profile</th>
								<th className="px-6 py-3.5 tracking-wide text-xs uppercase">Dispatched Time</th>
								<th className="px-6 py-3.5 tracking-wide text-xs uppercase text-right">Console</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 bg-white">
							{applications.map((app) => {
								const hasFailures = app.failures && app.failures.length > 0;
								
								return (
									<tr key={app.id} className="hover:bg-gray-50/80 transition-colors group">
										<td className="px-6 py-4 font-medium">
											<Link to={`/applications/${app.id}`} className="flex flex-col">
												<span className="text-gray-900 group-hover:text-primary font-semibold transition-colors">
													{truncateText(app.applicantName, 35)}
												</span>
												<span className="text-xs text-gray-400 font-mono mt-0.5 max-w-55 truncate">
													ID: {app.id}
												</span>
											</Link>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center gap-2">
												<StatusBadge status={app.status} />
												{app.retryCount > 0 && (
													<Badge variant="warning" className="text-[10px] px-1.5 py-0 font-mono">
														R-{app.retryCount}
													</Badge>
												)}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-gray-600 font-mono text-xs">
											<div className="flex items-center gap-1.5 text-gray-500">
												<Clock className="h-3.5 w-3.5 text-gray-400" />
												{app.duration ? formatDuration(app.duration) : ""}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs">
											<span className="border-b border-dotted border-gray-300 cursor-help" title={formatDate(app.createdAt)}>
												{formatRelativeTime(app.createdAt)}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right">
											<div className="flex items-center justify-end gap-2">
												{hasFailures && (
													<span title="Incident reports available" className="text-destructive/80 p-1">
														<ShieldAlert className="h-4 w-4" />
													</span>
												)}
												<Link to={`/applications/${app.id}`}>
													<Button variant="outline" size="sm" className="h-8 gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
														<Eye className="h-3.5 w-3.5" />
														Inspect
													</Button>
												</Link>
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</CardContent>
		</Card>
	);
}