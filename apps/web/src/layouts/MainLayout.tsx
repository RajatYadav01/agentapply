import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface MainLayoutProps {
	children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
	return (
		<div className="flex flex-col min-h-full bg-background">
			<Header />
			<main className="flex-[1_0_auto]">
				<div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">{children}</div>
			</main>
            <Footer />
		</div>
	);
}
