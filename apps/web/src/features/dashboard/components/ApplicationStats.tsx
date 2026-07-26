import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { ApplicationStats } from "@agentapply/types";
import { TrendingUp, Users, CheckCircle, XCircle, Clock } from "lucide-react";

interface ApplicationStatsProps {
	stats: ApplicationStats;
}

export function ApplicationStats({ stats }: ApplicationStatsProps) {
	const statItems = [
		{
			label: "Total Applications",
			value: stats.total,
			icon: Users,
			color: "text-primary",
			bg: "bg-primary/10",
			gradient: "from-primary/5 to-primary/10",
		},
		{
			label: "Successful",
			value: stats.successful,
			icon: CheckCircle,
			color: "text-green-500",
			bg: "bg-green-500/10",
			gradient: "from-green-500/5 to-green-500/10",
		},
		{
			label: "Failed",
			value: stats.failed,
			icon: XCircle,
			color: "text-red-500",
			bg: "bg-red-500/10",
			gradient: "from-red-500/5 to-red-500/10",
		},
		{
			label: "Pending",
			value: stats.pending,
			icon: Clock,
			color: "text-yellow-500",
			bg: "bg-yellow-500/10",
			gradient: "from-yellow-500/5 to-yellow-500/10",
		},
		{
			label: "Success Rate",
			value: `${stats.successRate}%`,
			icon: TrendingUp,
			color: "text-primary",
			bg: "bg-primary/10",
			gradient: "from-primary/5 to-primary/10",
		},
	];

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
			{statItems.map((item) => {
				const Icon = item.icon;
				return (
					<Card
						key={item.label}
						className="dark:from-background/50 dark:to-background/30 border-0 bg-gradient-to-br shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-xl">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-muted-foreground text-sm font-medium">{item.label}</CardTitle>
							<div className={`rounded-full p-2 ${item.bg}`}>
								<Icon className={`h-4 w-4 ${item.color}`} />
							</div>
						</CardHeader>
						<CardContent>
							<div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
							<p className="text-muted-foreground mt-1 text-xs">
								{item.label === "Success Rate" ? "of total applications" : "total applications"}
							</p>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
