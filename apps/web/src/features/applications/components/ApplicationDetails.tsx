import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatDate, formatDuration } from "@/utils";
import { ExternalLink } from "lucide-react";
import type { Application } from "@agentapply/types";

interface ApplicationDetailsProps {
	application: Application;
}

export function ApplicationDetails({ application }: ApplicationDetailsProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Application Details</CardTitle>
			</CardHeader>
			<CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<dt className="text-sm font-medium text-gray-500">Email</dt>
					<dd className="mt-1 text-gray-900">{application.email}</dd>
				</div>

				{application.phone && (
					<div>
						<dt className="text-sm font-medium text-gray-500">Phone</dt>
						<dd className="mt-1 text-gray-900">{application.phone}</dd>
					</div>
				)}

				{application.currentCompany && (
					<div>
						<dt className="text-sm font-medium text-gray-500">Current Company</dt>
						<dd className="mt-1 text-gray-900">{application.currentCompany}</dd>
					</div>
				)}

				{application.linkedinUrl && (
					<div>
						<dt className="text-sm font-medium text-gray-500">LinkedIn</dt>
						<dd className="mt-1">
							<a
								href={application.linkedinUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary inline-flex items-center hover:underline">
								View Profile
								<ExternalLink className="ml-1 h-3 w-3" />
							</a>
						</dd>
					</div>
				)}

				<div>
					<dt className="text-sm font-medium text-gray-500">Duration</dt>
					<dd className="mt-1 text-gray-900">{application.duration ? formatDuration(application.duration) : ""}</dd>
				</div>

				<div>
					<dt className="text-sm font-medium text-gray-500">Created</dt>
					<dd className="mt-1 text-gray-900">{formatDate(application.createdAt)}</dd>
				</div>

				{application.finishedAt && (
					<div>
						<dt className="text-sm font-medium text-gray-500">Finished</dt>
						<dd className="mt-1 text-gray-900">{formatDate(application.finishedAt)}</dd>
					</div>
				)}

				{application.retryCount > 0 && (
					<div>
						<dt className="text-sm font-medium text-gray-500">Retry Count</dt>
						<dd className="mt-1 text-gray-900">{application.retryCount}</dd>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
