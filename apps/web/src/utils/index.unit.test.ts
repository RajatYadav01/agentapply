import { describe, it, expect } from "vitest";
import { cn, formatDuration, formatDate, formatRelativeTime, truncateText } from "./index";

describe("Utility Functions", () => {
	describe("cn (className merger)", () => {
		it("merges class names correctly", () => {
			expect(cn("class1", "class2")).toBe("class1 class2");
			expect(cn("class1", { class2: true, class3: false })).toBe("class1 class2");
			expect(cn("class1", ["class2", "class3"])).toBe("class1 class2 class3");
		});
	});

	describe("formatDuration", () => {
		it("formats seconds correctly", () => {
			expect(formatDuration(30)).toBe("30s");
			expect(formatDuration(90)).toBe("1m 30s");
			expect(formatDuration(120)).toBe("2m 0s");
			expect(formatDuration(null)).toBe("—");
		});
	});

	describe("formatDate", () => {
		it("formats date correctly", () => {
			const date = new Date("2024-01-15T10:30:00");
			expect(formatDate(date)).toContain("Jan 15, 2024");
		});
	});

	describe("formatRelativeTime", () => {
		it("formats relative time correctly", () => {
			const now = new Date();
			expect(formatRelativeTime(now)).toBe("Just now");

			const fiveMinsAgo = new Date(now.getTime() - 5 * 60 * 1000);
			expect(formatRelativeTime(fiveMinsAgo)).toBe("5m ago");

			const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
			expect(formatRelativeTime(twoHoursAgo)).toBe("2h ago");
		});
	});

	describe("truncateText", () => {
		it("truncates text correctly", () => {
			const longText = "This is a very long text that needs truncation";
			expect(truncateText(longText, 20)).toBe("This is a very long...");
			expect(truncateText("Short text")).toBe("Short text");
		});
	});
});
