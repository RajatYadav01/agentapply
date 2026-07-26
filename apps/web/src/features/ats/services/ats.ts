import type { ATSApplication } from "@agentapply/types";

const ATS_URL = import.meta.env.VITE_ATS_URL;

export const atsServer = {
	// Fetch applications from the ATS server
	fetchATSApplications: async (): Promise<ATSApplication[]> => {
		const response = await fetch(`${ATS_URL}/applications`);
		const data = await response.json();
		if (!data.success) {
			throw new Error(data.error || "Failed to fetch applications");
		}
		return data.data || [];
	},

	// Reset the ATS server
	resetATS: async (): Promise<void> => {
		const response = await fetch(`${ATS_URL}/reset`, {
			method: "DELETE",
		});
		const data = await response.json();
		if (!data.success) {
			throw new Error(data.error || "Failed to reset ATS");
		}
	},
};
