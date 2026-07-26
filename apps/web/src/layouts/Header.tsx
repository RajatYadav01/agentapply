import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Home, LayoutDashboard, FilePlus, FileUser, Building2, Menu, X, Sun, Moon, Laptop } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/DropdownMenu";
import { cn } from "@/utils";
import { useTheme } from "@/styles/theme-provider";

const navigation = [
    { name: "Home", href: "/", icon: Home },
	{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
	{ name: "New Application", href: "/applications/new", icon: FilePlus },
	{ name: "Mock ATS", href: "/ats", icon: Building2 },
];

export function Header() {
	const location = useLocation();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const { setTheme } = useTheme();

	return (
		<nav className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 justify-between">
					<div className="flex">
						<Link to="/" className="group flex shrink-0 items-center">
							<div className="relative">
								<div className="bg-primary/20 absolute inset-0 rounded-full opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
								<FileUser className="text-primary relative h-8 w-8" />
							</div>
							<span className="from-primary to-primary/60 ml-2 bg-linear-to-r bg-clip-text text-xl font-bold text-transparent">
								AgentApply
							</span>
						</Link>

						<div className="hidden sm:ml-8 sm:flex sm:space-x-1">
							{navigation.map((item) => {
								const Icon = item.icon;
								const isActive = location.pathname === item.href;
								return (
									<Link
										key={item.name}
										to={item.href}
										className={cn(
											"inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
											isActive
												? "bg-primary text-primary-foreground shadow-primary/25 shadow-lg"
												: "text-muted-foreground hover:text-foreground hover:bg-accent",
										)}>
										<Icon className={cn("mr-2 h-4 w-4 transition-transform duration-200", isActive && "scale-110")} />
										{item.name}
									</Link>
								);
							})}
						</div>
					</div>

					<div className="hidden sm:flex sm:items-center sm:space-x-3">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-lg">
									<Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
									<Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
									<span className="sr-only">Toggle theme</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-40">
								<DropdownMenuItem onClick={() => setTheme("light")} className="gap-2">
									<Sun className="h-4 w-4" />
									<span>Light</span>
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2">
									<Moon className="h-4 w-4" />
									<span>Dark</span>
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setTheme("system")} className="gap-2">
									<Laptop className="h-4 w-4" />
									<span>System</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<div className="flex items-center sm:hidden">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
									<Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
									<Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
									<span className="sr-only">Toggle theme</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-40">
								<DropdownMenuItem onClick={() => setTheme("light")} className="gap-2">
									<Sun className="h-4 w-4" />
									<span>Light</span>
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2">
									<Moon className="h-4 w-4" />
									<span>Dark</span>
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setTheme("system")} className="gap-2">
									<Laptop className="h-4 w-4" />
									<span>System</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						<Button
							variant="ghost"
							size="icon"
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							aria-label="Toggle menu"
							className="ml-2 h-9 w-9 rounded-lg">
							{mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
						</Button>
					</div>
				</div>

				{mobileMenuOpen && (
					<div className="animate-in border-t py-4 sm:hidden">
						<div className="space-y-1">
							{navigation.map((item) => {
								const Icon = item.icon;
								const isActive = location.pathname === item.href;
								return (
									<Link
										key={item.name}
										to={item.href}
										className={cn(
											"flex items-center rounded-lg px-3 py-2.5 text-base font-medium transition-all duration-200",
											isActive
												? "bg-primary text-primary-foreground shadow-primary/25 shadow-lg"
												: "text-muted-foreground hover:text-foreground hover:bg-accent",
										)}
										onClick={() => setMobileMenuOpen(false)}>
										<Icon className={cn("mr-3 h-5 w-5 transition-transform duration-200", isActive && "scale-110")} />
										{item.name}
									</Link>
								);
							})}
						</div>
					</div>
				)}
			</div>
		</nav>
	);
}
