import { useQuery } from "@tanstack/react-query";
import { applicationsApi } from "../services/applications-api";
import { APPLICATION_KEYS } from "./useApplications";

export function useApplication(id: string | undefined) {
	const {
		data: application,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: APPLICATION_KEYS.detail(id!),
		queryFn: () => applicationsApi.getApplication(id!),
		enabled: !!id,
	});

	return {
		application,
		isLoading,
		error,
		refetch,
	};
}
