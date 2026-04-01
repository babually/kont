import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
	component: DashboardIndexPage,
});

function DashboardIndexPage() {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
			<h2 className="font-bold text-2xl text-primary">
				This is the Dashboard Page
			</h2>
		</div>
	);
}
