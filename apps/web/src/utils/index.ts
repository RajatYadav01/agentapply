import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number | null): string {
	if (!seconds) return "—";
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	if (minutes === 0) {
		return `${remainingSeconds}s`;
	}
	return `${minutes}m ${remainingSeconds}s`;
}

export function formatDate(date: string | Date): string {
	return new Date(date).toLocaleString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

export function formatRelativeTime(date: string | Date): string {
	const now = new Date();
	const target = new Date(date);
	const diffMs = now.getTime() - target.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMs / 3600000);
	const diffDays = Math.floor(diffMs / 86400000);

	if (diffMins < 1) return "Just now";
	if (diffMins < 60) return `${diffMins}m ago`;
	if (diffHours < 24) return `${diffHours}h ago`;
	if (diffDays < 7) return `${diffDays}d ago`;
	return formatDate(date);
}

export function truncateText(text: string, maxLength: number = 50): string {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength) + "...";
}
