import { Link } from "react-router";
import { FilePlus, FileUser, Building2, LayoutDashboard, ArrowRight, Sparkles, Zap, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function HomePage() {
	return (
		<div className="space-y-12">
			<section className="py-12 text-center">
				<div className="mb-6 flex justify-center">
					<div className="bg-primary/10 rounded-full p-4">
						<FileUser className="text-primary h-16 w-16" />
					</div>
				</div>
				<h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl md:text-6xl">
					<span className="block">AI-Powered Job Applications</span>
					<span className="text-primary block">Automated with Precision</span>
				</h1>
				<p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
					AgentApply automates job applications using intelligent browser agents. Submit applications reliably with high success rates.
				</p>
				<div className="mt-8 flex flex-wrap justify-center gap-4">
					<Link to="/applications/new">
						<Button size="lg" className="gap-2">
							<FilePlus className="h-5 w-5" />
							Submit Application
						</Button>
					</Link>
					<Link to="/dashboard">
						<Button size="lg" variant="outline" className="gap-2">
							<LayoutDashboard className="h-5 w-5" />
							View Dashboard
						</Button>
					</Link>
				</div>
			</section>

			<section>
				<h2 className="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-gray-100">Why Choose AgentApply?</h2>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
					<Card>
						<CardHeader>
							<div className="flex items-center gap-2">
								<Sparkles className="text-primary h-5 w-5" />
								<CardTitle>Smart Automation</CardTitle>
							</div>
							<CardDescription>Intelligent browser agents that handle complex form filling with precision.</CardDescription>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2 text-sm text-gray-600">
								<li>• Automatic field detection</li>
								<li>• Smart selector fallbacks</li>
								<li>• Dynamic form handling</li>
							</ul>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<div className="flex items-center gap-2">
								<Zap className="text-primary h-5 w-5" />
								<CardTitle>Fast & Reliable</CardTitle>
							</div>
							<CardDescription>Process applications quickly with built-in retry mechanisms and error recovery.</CardDescription>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2 text-sm text-gray-600">
								<li>• &lt;60s average processing</li>
								<li>• Automatic retry logic</li>
								<li>• Failure diagnosis</li>
							</ul>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<div className="flex items-center gap-2">
								<Shield className="text-primary h-5 w-5" />
								<CardTitle>Full Visibility</CardTitle>
							</div>
							<CardDescription>Complete transparency into every step of the application process.</CardDescription>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2 text-sm text-gray-600">
								<li>• Detailed timeline</li>
								<li>• Screenshot capture</li>
								<li>• Failure logging</li>
							</ul>
						</CardContent>
					</Card>
				</div>
			</section>

			<section className="rounded-lg bg-background p-8">
				<h2 className="mb-6 text-center text-xl font-bold text-gray-900 dark:text-gray-100">Quick Actions</h2>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<Link to="/applications/new">
						<Card className="cursor-pointer transition-shadow hover:shadow-md">
							<CardContent className="flex items-center gap-4 pt-6">
								<FilePlus className="text-primary h-8 w-8" />
								<div>
									<p className="font-medium">New Application</p>
									<p className="text-sm text-gray-500">Submit a new job application</p>
								</div>
								<ArrowRight className="ml-auto h-4 w-4 text-gray-400" />
							</CardContent>
						</Card>
					</Link>

					<Link to="/dashboard">
						<Card className="cursor-pointer transition-shadow hover:shadow-md">
							<CardContent className="flex items-center gap-4 pt-6">
								<LayoutDashboard className="text-primary h-8 w-8" />
								<div>
									<p className="font-medium">Dashboard</p>
									<p className="text-sm text-gray-500">View all applications</p>
								</div>
								<ArrowRight className="ml-auto h-4 w-4 text-gray-400" />
							</CardContent>
						</Card>
					</Link>

					<Link to="/ats">
						<Card className="cursor-pointer transition-shadow hover:shadow-md">
							<CardContent className="flex items-center gap-4 pt-6">
								<Building2 className="text-primary h-8 w-8" />
								<div>
									<p className="font-medium">Mock ATS</p>
									<p className="text-sm text-gray-500">Test the applicant tracking system</p>
								</div>
								<ArrowRight className="ml-auto h-4 w-4 text-gray-400" />
							</CardContent>
						</Card>
					</Link>
				</div>
			</section>
		</div>
	);
}
