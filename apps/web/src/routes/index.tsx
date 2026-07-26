import { Routes, Route } from "react-router";
import { MainLayout } from "@/layouts/MainLayout";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { ApplicationDetailsPage } from "@/features/applications/pages/ApplicationDetailsPage";
import { NewApplicationPage } from "@/features/applications/pages/NewApplicationPage";
import { AtsPage } from "@/features/ats/pages/AtsPage";
import { HomePage } from "@/pages/HomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export const AppRoutes: React.FC = () => {
	return (
		<MainLayout>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/dashboard" element={<DashboardPage />} />
				<Route path="/applications/new" element={<NewApplicationPage />} />
				<Route path="/applications/:id" element={<ApplicationDetailsPage />} />
				<Route path="/ats" element={<AtsPage />} />
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</MainLayout>
	);
};
