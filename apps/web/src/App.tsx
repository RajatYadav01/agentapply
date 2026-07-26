import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/styles/theme-provider";
import { AppRoutes } from "@/routes";
import { Toaster } from "@/components/ui/Toaster";
import "@/styles/globals.css";

export default function App() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
				retry: 1,
			},
		},
	});

	return (
		<ThemeProvider defaultTheme="system" storageKey="agentapply-theme">
			<QueryClientProvider client={queryClient}>
				<BrowserRouter basename={import.meta.env.VITE_BASE_URL}>
					<AppRoutes />
				</BrowserRouter>
				<Toaster />
			</QueryClientProvider>
		</ThemeProvider>
	);
}
