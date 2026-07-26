import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@/test-utils";
import { NewApplicationPage } from "./NewApplicationPage";
import { useApplications } from "../hooks/useApplications";

vi.mock("../hooks/useApplications", () => ({
	useApplications: vi.fn(),
}));

const mockJobs = [
	{
		id: "job-1",
		title: "Software Engineer",
		company: "Tech Corp",
		location: "Remote",
	},
	{
		id: "job-2",
		title: "Product Manager",
		company: "Innovation Labs",
		location: "San Francisco",
	},
];

describe("NewApplicationPage", () => {
	const mockCreateApplication = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(useApplications).mockReturnValue({
			createApplication: mockCreateApplication,
			jobs: mockJobs,
			isLoadingJobs: false,
			applications: [],
			isLoading: false,
			error: null,
			refetch: vi.fn(),
			isCreating: false,
			isRetrying: false,
			isRunning: false,
			retryApplication: vi.fn(),
			runApplication: vi.fn(),
		});
	});

	it("renders the form with job dropdown", () => {
		render(<NewApplicationPage />);

		expect(screen.getByText("Submit New Application")).toBeInTheDocument();
		expect(screen.getByText("Select Job")).toBeInTheDocument();
		expect(screen.getByLabelText(/Full Name/)).toBeInTheDocument();
		expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
	});

	it("displays jobs in dropdown", async () => {
		render(<NewApplicationPage />);

		const trigger = screen.getByRole("combobox");
		fireEvent.click(trigger);

		await waitFor(() => {
			expect(screen.getByText("Software Engineer")).toBeInTheDocument();
			expect(screen.getByText("Product Manager")).toBeInTheDocument();
		});
	});

	it("submits form with valid data", async () => {
		render(<NewApplicationPage />);

		// Fill form
		fireEvent.change(screen.getByLabelText(/Full Name/), {
			target: { value: "John Doe" },
		});
		fireEvent.change(screen.getByLabelText(/Email/), {
			target: { value: "john@example.com" },
		});

		// Select job
		const trigger = screen.getByRole("combobox");
		fireEvent.click(trigger);
		const jobOption = await screen.findByText("Software Engineer");
		fireEvent.click(jobOption);

		// Submit
		const submitButton = screen.getByRole("button", { name: /Submit Application/ });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(mockCreateApplication).toHaveBeenCalledWith({
				applicantName: "John Doe",
				email: "john@example.com",
				jobId: "job-1",
				phone: "",
				currentCompany: "",
				linkedinUrl: "",
			});
		});
	});
});
