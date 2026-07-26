import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationsApi } from "../services/applications-api";
import { useToast } from "@/components/ui/use-toast";

export const APPLICATION_KEYS = {
	all: ["applications"] as const,
	lists: () => [...APPLICATION_KEYS.all, "list"] as const,
	list: () => [...APPLICATION_KEYS.lists()] as const,
	details: () => [...APPLICATION_KEYS.all, "detail"] as const,
	detail: (id: string) => [...APPLICATION_KEYS.details(), id] as const,
	jobs: () => [...APPLICATION_KEYS.all, "jobs"] as const,
};

export function useApplications() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	const {
		data: applications,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: APPLICATION_KEYS.list(),
		queryFn: applicationsApi.getApplications,
	});

	const { data: jobs = [], isLoading: isLoadingJobs } = useQuery({
		queryKey: APPLICATION_KEYS.jobs(),
		queryFn: applicationsApi.getJobs,
	});

	const createApplication = useMutation({
		mutationFn: applicationsApi.createApplication,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.list() });
			toast({
				title: "Application created",
				description: "The application has been submitted successfully.",
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

	const retryApplication = useMutation({
		mutationFn: applicationsApi.retryApplication,
		onSuccess: (_, applicationId) => {
			queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.list() });
			queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.detail(applicationId) });
			toast({
				title: "Retry started",
				description: "The application is being retried.",
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

	const runApplication = useMutation({
		mutationFn: applicationsApi.runApplication,
		onSuccess: (_, applicationId) => {
			queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.list() });
			queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.detail(applicationId) });
			toast({
				title: "Agent started",
				description: "The browser agent is processing the application.",
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

	return {
		applications: applications || [],
		jobs,
		isLoading,
		isLoadingJobs,
		error,
		refetch,
		createApplication: createApplication.mutate,
		isCreating: createApplication.isPending,
		retryApplication: retryApplication.mutate,
		isRetrying: retryApplication.isPending,
		runApplication: runApplication.mutate,
		isRunning: runApplication.isPending,
	};
}
