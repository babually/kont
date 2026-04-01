// import { convexQuery } from "@convex-dev/react-query";
// import { api } from "@kont/backend/convex/_generated/api";
// import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/layout/hero";
import { Navbar } from "@/components/layout/navbar";

export const Route = createFileRoute("/")({
	component: HomePage,
});

function HomePage() {
	// const healthCheck = useQuery(convexQuery(api.healthCheck.get, {}));

	return (
		<div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
			<Navbar />
			<main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<Hero />
			</main>

			{/* Footer simple */}
			<footer className="border-border/40 border-t py-12 text-center">
				<p className="text-muted-foreground text-sm">
					© {new Date().getFullYear()} Kont Personal CRM. All rights reserved.
				</p>
			</footer>
		</div>
	);
}
