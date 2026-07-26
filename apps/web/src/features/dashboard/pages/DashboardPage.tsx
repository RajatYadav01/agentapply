import { useApplications } from "@/features/applications/hooks/useApplications";
import { ApplicationStats } from "../components/ApplicationStats";
import { RecentApplicationsTable } from "@/features/dashboard/components/RecentApplicationsTable";
import { DashboardSkeleton } from "@/features/dashboard/components/DashboardSkeleton";
import { DashboardError } from "@/features/dashboard/components/DashboardError";
import { Button } from "@/components/ui/Button";
import { RefreshCw, TrendingUp, Clock, CheckCircle, Sparkles, XCircle } from "lucide-react";

export function DashboardPage() {
	const { applications, isLoading, error, refetch } = useApplications();

	if (isLoading) {
		return <DashboardSkeleton />;
	}

	if (error) {
		return <DashboardError error={error} onRetry={() => refetch()} />;
	}

	const stats = {
		total: applications.length,
		successful: applications.filter((a) => a.status === "SUCCESS").length,
		failed: applications.filter((a) => a.status === "FAILED").length,
		pending: applications.filter((a) => a.status === "PENDING" || a.status === "RUNNING").length,
		successRate: applications.length
			? Math.round((applications.filter((a) => a.status === "SUCCESS").length / applications.length) * 100)
			: 0,
	};

	return (
		<div className="animate-in space-y-8">
			{/* Header with Stats Summary */}
			<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground mt-1">Overview of all applications and their status</p>
				</div>
				<div className="flex items-center gap-3">
					<Button variant="outline" size="sm" onClick={() => refetch()} className="hover:bg-primary/10 gap-2 transition-colors">
						<RefreshCw className="h-4 w-4" />
						Refresh
					</Button>
					<Button size="sm" onClick={() => (window.location.href = "/applications/new")} className="shadow-primary/25 gap-2 shadow-lg">
						<Sparkles className="h-4 w-4" />
						New Application
					</Button>
				</div>
			</div>

			{/* Stats Cards */}
			<ApplicationStats stats={stats} />

			{/* Quick Stats Summary - Glass morphism style */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<div className="from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 flex items-center gap-4 rounded-xl border bg-gradient-to-br p-4 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-[1.02]">
					<div className="bg-primary/20 rounded-full p-3">
						<TrendingUp className="text-primary h-5 w-5" />
					</div>
					<div>
						<p className="text-muted-foreground text-sm">Success Rate</p>
						<p className="text-primary text-2xl font-bold">{stats.successRate}%</p>
					</div>
				</div>
				<div className="flex items-center gap-4 rounded-xl border bg-gradient-to-br from-green-500/5 to-green-500/10 p-4 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] dark:from-green-500/10 dark:to-green-500/5">
					<div className="rounded-full bg-green-500/20 p-3">
						<CheckCircle className="h-5 w-5 text-green-500" />
					</div>
					<div>
						<p className="text-muted-foreground text-sm">Successful</p>
						<p className="text-2xl font-bold text-green-500">{stats.successful}</p>
					</div>
				</div>
				<div className="flex items-center gap-4 rounded-xl border bg-gradient-to-br from-red-500/5 to-red-500/10 p-4 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] dark:from-red-500/10 dark:to-red-500/5">
					<div className="rounded-full bg-red-500/20 p-3">
						<XCircle className="h-5 w-5 text-red-500" />
					</div>
					<div>
						<p className="text-muted-foreground text-sm">Failed</p>
						<p className="text-2xl font-bold text-red-500">{stats.failed}</p>
					</div>
				</div>
				<div className="flex items-center gap-4 rounded-xl border bg-gradient-to-br from-yellow-500/5 to-yellow-500/10 p-4 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] dark:from-yellow-500/10 dark:to-yellow-500/5">
					<div className="rounded-full bg-yellow-500/20 p-3">
						<Clock className="h-5 w-5 text-yellow-500" />
					</div>
					<div>
						<p className="text-muted-foreground text-sm">Pending</p>
						<p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
					</div>
				</div>
			</div>

			{/* Recent Applications Table */}
			<RecentApplicationsTable applications={applications} />
		</div>
	);
}
