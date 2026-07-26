import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Building2, Users, FileText, ExternalLink, RefreshCw, Server, CheckCircle, Clock, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { atsServer } from "@/features/ats/services/ats";

export function AtsPage() {
	const [isIframeLoaded, setIsIframeLoaded] = useState(false);
	const { toast } = useToast();
	const queryClient = useQueryClient();

	const {
		data: applications = [],
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["ats-applications"],
		queryFn: atsServer.fetchATSApplications,
		refetchInterval: 10000,
	});

	const resetMutation = useMutation({
		mutationFn: atsServer.resetATS,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["ats-applications"] });
			toast({
				title: "ATS Reset",
				description: "All applications have been cleared from the mock ATS.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Error",
				description: error.message,
				variant: "destructive",
			});
		},
	});

	const stats = {
		total: applications.length,
		recent: applications.slice(0, 5),
	};

	return (
		<div className="animate-in space-y-6">
			<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Mock ATS</h1>
					<p className="text-muted-foreground mt-1">Applicant Tracking System for testing browser automation</p>
				</div>
				<div className="flex items-center gap-3">
					<Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
						<RefreshCw className="h-4 w-4" />
						Refresh
					</Button>
					<Button
						variant="destructive"
						size="sm"
						onClick={() => resetMutation.mutate()}
						disabled={resetMutation.isPending}
						className="gap-2">
						<Trash2 className="h-4 w-4" />
						{resetMutation.isPending ? "Resetting..." : "Reset ATS"}
					</Button>
					<Button
						size="sm"
						onClick={() => window.open(import.meta.env.VITE_ATS_URL, "_blank")}
						className="shadow-primary/25 gap-2 shadow-lg">
						<ExternalLink className="h-4 w-4" />
						Open ATS
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<Card className="from-primary/5 to-primary/10 border-0 bg-linear-to-br shadow-lg">
					<CardContent className="pt-6">
						<div className="flex items-center gap-4">
							<div className="bg-primary/20 rounded-full p-3">
								<Building2 className="text-primary h-5 w-5" />
							</div>
							<div>
								<p className="text-muted-foreground text-sm">Total Applications</p>
								<p className="text-2xl font-bold">{stats.total}</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-0 bg-linear-to-br from-green-500/5 to-green-500/10 shadow-lg">
					<CardContent className="pt-6">
						<div className="flex items-center gap-4">
							<div className="rounded-full bg-green-500/20 p-3">
								<CheckCircle className="h-5 w-5 text-green-500" />
							</div>
							<div>
								<p className="text-muted-foreground text-sm">Status</p>
								<p className="text-2xl font-bold text-green-500">Active</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-0 bg-linear-to-br from-blue-500/5 to-blue-500/10 shadow-lg">
					<CardContent className="pt-6">
						<div className="flex items-center gap-4">
							<div className="rounded-full bg-blue-500/20 p-3">
								<Server className="h-5 w-5 text-blue-500" />
							</div>
							<div>
								<p className="text-muted-foreground text-sm">ATS URL</p>
								<p className="max-w-37.5 truncate font-mono text-sm text-blue-500">{import.meta.env.VITE_ATS_URL}</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<Card className="border-0 shadow-lg">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Users className="text-primary h-5 w-5" />
							Recent Applications
						</CardTitle>
						<CardDescription>Applications submitted through the mock ATS</CardDescription>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<div className="flex items-center justify-center py-8">
								<div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
							</div>
						) : error ? (
							<div className="text-destructive py-8 text-center">
								<p>Error loading applications</p>
								<Button variant="outline" size="sm" className="mt-2" onClick={() => refetch()}>
									Try Again
								</Button>
							</div>
						) : applications.length === 0 ? (
							<div className="text-muted-foreground py-8 text-center">
								<FileText className="mx-auto mb-3 h-12 w-12 opacity-50" />
								<p>No applications submitted yet</p>
								<p className="text-sm">Submit an application through the ATS form</p>
							</div>
						) : (
							<div className="space-y-3">
								{stats.recent.map((app) => (
									<div
										key={app.id}
										className="hover:bg-accent/50 flex items-center justify-between rounded-lg border p-3 transition-colors">
										<div>
											<p className="font-medium">{app.fullName}</p>
											<p className="text-muted-foreground text-sm">{app.email}</p>
										</div>
										<Badge variant="success" className="shrink-0">
											Submitted
										</Badge>
									</div>
								))}
								{applications.length > 5 && (
									<p className="text-muted-foreground text-center text-sm">+ {applications.length - 5} more applications</p>
								)}
							</div>
						)}
					</CardContent>
				</Card>

				<Card className="border-0 shadow-lg">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<ExternalLink className="text-primary h-5 w-5" />
							ATS Preview
						</CardTitle>
						<CardDescription>Live view of the mock ATS application form</CardDescription>
					</CardHeader>
					<CardContent className="p-0">
						<div className="relative aspect-4/3 w-full overflow-hidden rounded-lg">
							{!isIframeLoaded && (
								<div className="bg-muted absolute inset-0 flex items-center justify-center">
									<div className="text-center">
										<div className="border-primary mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-b-2"></div>
										<p className="text-muted-foreground text-sm">Loading ATS...</p>
									</div>
								</div>
							)}
							<iframe
								src={import.meta.env.VITE_ATS_URL}
								className="h-full w-full border-0"
								onLoad={() => setIsIframeLoaded(true)}
								title="Mock ATS"
								sandbox="allow-scripts allow-forms allow-same-origin"
							/>
						</div>
						<div className="bg-muted/30 p-4">
							<p className="text-muted-foreground text-xs">
								The ATS is running at <code className="bg-background rounded px-1 py-0.5">{import.meta.env.VITE_ATS_URL}</code> • Click
								"Open ATS" to view in a new tab
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			<Card className="from-primary/5 to-primary/10 border-0 bg-linear-to-br shadow-lg">
				<CardHeader>
					<CardTitle className="text-sm font-medium">Integration Status</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
						<div className="flex items-center gap-2">
							<CheckCircle className="h-4 w-4 text-green-500" />
							<span className="text-sm">
								ATS Server: <strong>Running</strong>
							</span>
						</div>
						<div className="flex items-center gap-2">
							<CheckCircle className="h-4 w-4 text-green-500" />
							<span className="text-sm">
								API: <strong>Connected</strong>
							</span>
						</div>
						<div className="flex items-center gap-2">
							{applications.length > 0 ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Clock className="h-4 w-4 text-yellow-500" />}
							<span className="text-sm">
								Applications: <strong>{applications.length}</strong>
							</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
