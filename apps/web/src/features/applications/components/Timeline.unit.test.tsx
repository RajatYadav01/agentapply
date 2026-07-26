import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils";
import { Timeline } from "./Timeline";
import type { TimelineEvent } from "@agentapply/types";

const mockEvents: TimelineEvent[] = [
	{
		id: "1",
		applicationId: "app-1",
		step: "Application Started",
		status: "INFO",
		message: "Workflow initiated",
		timestamp: new Date().toISOString(),
	},
	{
		id: "2",
		applicationId: "app-1",
		step: "Form Filled",
		status: "SUCCESS",
		message: "All fields filled successfully",
		timestamp: new Date().toISOString(),
	},
	{
		id: "3",
		applicationId: "app-1",
		step: "Submission Failed",
		status: "ERROR",
		message: "Network error occurred",
		timestamp: new Date().toISOString(),
	},
];

describe("Timeline", () => {
	it("renders all timeline events", () => {
		render(<Timeline events={mockEvents} />);

		expect(screen.getByText("Application Started")).toBeInTheDocument();
		expect(screen.getByText("Form Filled")).toBeInTheDocument();
		expect(screen.getByText("Submission Failed")).toBeInTheDocument();
	});

	it("displays messages for events", () => {
		render(<Timeline events={mockEvents} />);

		expect(screen.getByText("Workflow initiated")).toBeInTheDocument();
		expect(screen.getByText("All fields filled successfully")).toBeInTheDocument();
		expect(screen.getByText("Network error occurred")).toBeInTheDocument();
	});

	it("shows empty state when no events", () => {
		render(<Timeline events={[]} />);
		expect(screen.getByText("No timeline events yet.")).toBeInTheDocument();
	});
});
