import { Button } from "@/components/ui/Button";

interface DashboardErrorProps {
	error: Error;
	onRetry: () => void;
}

export function DashboardError({ error, onRetry }: DashboardErrorProps) {
	return (
		<div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
			<p>Error loading applications: {error.message}</p>
			<Button variant="outline" className="mt-2" onClick={onRetry}>
				Try Again
			</Button>
		</div>
	);
}
