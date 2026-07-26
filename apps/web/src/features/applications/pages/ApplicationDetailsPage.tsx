import { useParams, useNavigate } from "react-router";
import { useApplication } from "../hooks/useApplication";
import { useApplications } from "../hooks/useApplications";
import { StatusBadge } from "../components/StatusBadge";
import { Timeline } from "../components/Timeline";
import { ApplicationDetails } from "../components/ApplicationDetails";
import { FailureList } from "../components/FailureList";
import { ApplicationActions } from "../components/ApplicationActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ApplicationDetailsPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { application, isLoading, error, refetch } = useApplication(id);
	const { retryApplication, isRetrying, runApplication, isRunning } = useApplications();

	if (isLoading) {
		return (
			<div className="flex h-64 flex-col items-center justify-center gap-4">
				<Loader2 className="text-primary h-8 w-8 animate-spin" />
				<p className="text-muted-foreground">Loading application details...</p>
			</div>
		);
	}

	if (error || !application) {
		return (
			<div className="bg-destructive/10 border-destructive/20 text-destructive rounded-xl border px-4 py-6">
				<p className="font-medium">Error loading application</p>
				<p className="mt-1 text-sm">{error?.message || "Application not found"}</p>
				<Button variant="outline" className="mt-3" onClick={() => navigate("/dashboard")}>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Dashboard
				</Button>
			</div>
		);
	}

	const handleRetry = () => retryApplication(application.id);
	const handleRun = () => runApplication(application.id);

	return (
		<div className="animate-in space-y-6">
			<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<div className="flex items-center gap-3">
					<Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="gap-2">
						<ArrowLeft className="h-4 w-4" />
						Back
					</Button>
					<div>
						<h1 className="text-2xl font-bold tracking-tight">{application.applicantName}</h1>
						<div className="mt-1 flex items-center gap-2">
							<StatusBadge status={application.status} />
							<span className="text-muted-foreground text-sm">• ID: {application.id.slice(0, 8)}</span>
						</div>
					</div>
				</div>
				<ApplicationActions
					application={application}
					onRetry={handleRetry}
					onRun={handleRun}
					isRetrying={isRetrying}
					isRunning={isRunning}
					onRefresh={refetch}
				/>
			</div>

			<Tabs defaultValue="details" className="space-y-6">
				<TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
					<TabsTrigger value="details">Details</TabsTrigger>
					<TabsTrigger value="timeline">Timeline</TabsTrigger>
					{application.failures && application.failures.length > 0 && (
						<TabsTrigger value="failures">Failures ({application.failures.length})</TabsTrigger>
					)}
				</TabsList>

				<TabsContent value="details" className="animate-in">
					<ApplicationDetails application={application} />
				</TabsContent>

				<TabsContent value="timeline" className="animate-in">
					<Card className="border-0 shadow-lg">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Sparkles className="text-primary h-5 w-5" />
								Timeline
							</CardTitle>
						</CardHeader>
						<CardContent>{application.timeline && <Timeline events={application.timeline} />}</CardContent>
					</Card>
				</TabsContent>

				{application.failures && application.failures.length > 0 && (
					<TabsContent value="failures" className="animate-in">
						<FailureList failures={application.failures} />
					</TabsContent>
				)}
			</Tabs>
		</div>
	);
}
