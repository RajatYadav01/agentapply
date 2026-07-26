import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import { useApplications } from "../hooks/useApplications";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Loader2, Briefcase, Building2, MapPin, ArrowLeft } from "lucide-react";

const applicationSchema = z.object({
	applicantName: z.string().min(2, "Name must be at least 2 characters"),
	email: z.email("Invalid email address"),
	phone: z.string().optional(),
	currentCompany: z.string().optional(),
	linkedinUrl: z.url("Invalid LinkedIn URL").optional().or(z.literal("")),
	jobId: z.string().min(1, "Please select a job"),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

export function NewApplicationPage() {
	const navigate = useNavigate();
	const { createApplication, isCreating, jobs, isLoadingJobs } = useApplications();

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm<ApplicationForm>({
		resolver: zodResolver(applicationSchema),
		defaultValues: {
			applicantName: "",
			email: "",
			phone: "",
			currentCompany: "",
			linkedinUrl: "",
			jobId: "",
		},
	});

	const selectedJobId = watch("jobId");
	const selectedJob = jobs.find((j) => j.id === selectedJobId);

	const onSubmit = async (data: ApplicationForm) => {
		createApplication(data, {
			onSuccess: (app) => {
				navigate(`/applications/${app.id}`);
			},
		});
	};

	return (
		<div className="mx-auto max-w-2xl px-4 sm:px-0">
			<button
				onClick={() => navigate("/dashboard")}
				className="text-muted-foreground hover:text-foreground mb-4 flex cursor-pointer items-center gap-2 text-sm font-medium transition-colors">
				<ArrowLeft className="h-4 w-4" /> Back to Dashboard
			</button>

			<Card className="border-gray-200/80 shadow-md">
				<CardHeader className="border-b bg-gray-50/50 pb-6">
					<CardTitle className="text-xl font-bold tracking-tight text-center text-gray-900 dark:text-gray-100">Submit New Application</CardTitle>
					<CardDescription className="mt-1 text-gray-600 dark:text-gray-300">
						Fill in the details below to submit a new job application. The browser agent will process it automatically.
					</CardDescription>
				</CardHeader>

				<CardContent className="pt-6">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="jobId">
								Select Job <span className="text-destructive">*</span>
							</Label>
							<Select onValueChange={(value) => setValue("jobId", value)} value={selectedJobId}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder={isLoadingJobs ? "Loading jobs..." : "Choose a position"} />
								</SelectTrigger>
								<SelectContent>
									{isLoadingJobs ? (
										<div className="flex items-center justify-center py-4">
											<Loader2 className="h-4 w-4 animate-spin" />
											<span className="text-muted-foreground ml-2 text-sm">Loading jobs...</span>
										</div>
									) : jobs.length === 0 ? (
										<div className="text-muted-foreground py-4 text-center text-sm">No jobs available</div>
									) : (
										jobs.map((job) => (
											<SelectItem key={job.id} value={job.id} className="py-3">
												<div className="flex flex-col">
													<span className="font-medium">{job.title}</span>
													<span className="text-muted-foreground mt-0.5 flex items-center gap-2 text-xs">
														<Building2 className="h-3 w-3" />
														{job.company}
														<MapPin className="ml-1 h-3 w-3" />
														{job.location}
													</span>
												</div>
											</SelectItem>
										))
									)}
								</SelectContent>
							</Select>
							{errors.jobId && <p className="text-destructive text-sm">{errors.jobId.message}</p>}

							{selectedJob && (
								<div className="bg-primary/5 border-primary/10 mt-2 rounded-lg border p-3">
									<div className="flex items-start gap-3">
										<div className="bg-primary/10 rounded-full p-2">
											<Briefcase className="text-primary h-4 w-4" />
										</div>
										<div>
											<p className="text-sm font-medium">{selectedJob.title}</p>
											<p className="text-muted-foreground text-xs">
												{selectedJob.company} • {selectedJob.location}
											</p>
											{selectedJob.description && (
												<p className="text-muted-foreground mt-1 line-clamp-2 text-xs">{selectedJob.description}</p>
											)}
										</div>
									</div>
								</div>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="applicantName">
								Full Name <span className="text-destructive">*</span>
							</Label>
							<Input id="applicantName" placeholder="John Doe" {...register("applicantName")} />
							{errors.applicantName && <p className="text-destructive text-sm">{errors.applicantName.message}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">
								Email <span className="text-destructive">*</span>
							</Label>
							<Input id="email" type="email" placeholder="john@example.com" {...register("email")} />
							{errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="phone">Phone</Label>
							<Input id="phone" type="tel" placeholder="+1 (555) 000-0000" {...register("phone")} />
							{errors.phone && <p className="text-destructive text-sm">{errors.phone.message}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="currentCompany">Current Company</Label>
							<Input id="currentCompany" placeholder="Acme Inc." {...register("currentCompany")} />
							{errors.currentCompany && <p className="text-destructive text-sm">{errors.currentCompany.message}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="linkedinUrl">LinkedIn URL</Label>
							<Input id="linkedinUrl" type="url" placeholder="https://linkedin.com/in/johndoe" {...register("linkedinUrl")} />
							{errors.linkedinUrl && <p className="text-destructive text-sm">{errors.linkedinUrl.message}</p>}
						</div>

						<div className="flex justify-end space-x-3 border-t pt-4">
							<Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>
								Cancel
							</Button>
							<Button type="submit" disabled={isCreating} className="shadow-primary/25 shadow-lg">
								{isCreating ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Submitting...
									</>
								) : (
									"Submit Application"
								)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
