import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils";
import { StatusBadge } from "./StatusBadge";

describe("StatusBadge", () => {
	it("renders PENDING status correctly", () => {
		render(<StatusBadge status="PENDING" />);
		const badge = screen.getByText("PENDING");
		expect(badge).toBeInTheDocument();
		expect(badge).toHaveClass("bg-yellow-100");
		expect(badge.textContent).toContain("⏳");
	});

	it("renders SUCCESS status correctly", () => {
		render(<StatusBadge status="SUCCESS" />);
		const badge = screen.getByText("SUCCESS");
		expect(badge).toBeInTheDocument();
		expect(badge).toHaveClass("bg-green-100");
		expect(badge.textContent).toContain("✅");
	});

	it("renders FAILED status correctly", () => {
		render(<StatusBadge status="FAILED" />);
		const badge = screen.getByText("FAILED");
		expect(badge).toBeInTheDocument();
		expect(badge).toHaveClass("bg-red-100");
		expect(badge.textContent).toContain("❌");
	});
});
