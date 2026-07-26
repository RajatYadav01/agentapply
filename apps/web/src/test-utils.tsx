import type { ReactElement } from "react";
import { render, type RenderOptions, type RenderResult } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/styles/theme-provider";
import { createTestQueryClient } from "../vitest.setup";

const queryClient = createTestQueryClient();

interface WrapperProps {
	children: React.ReactNode;
}

function TestWrapper({ children }: WrapperProps) {
	return (
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider defaultTheme="light" storageKey="test-theme">
					{children}
				</ThemeProvider>
			</QueryClientProvider>
		</BrowserRouter>
	);
}

export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">): RenderResult {
	return render(ui, { wrapper: TestWrapper, ...options });
}

export * from "@testing-library/react";
export { TestWrapper };
