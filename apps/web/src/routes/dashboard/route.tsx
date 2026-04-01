import { SidebarProvider } from "@kont/ui/components/sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
// import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { MobileBottomNav } from "@/components/mobile/mobile-bottom-nav";
import { MobileHeader } from "@/components/mobile/mobile-header";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (!context.isAuthenticated) {
			throw redirect({ to: "/sign-in" });
		}
	},
});

function RouteComponent() {
	return (
		<SidebarProvider className="bg-sidebar">
			<DashboardSidebar />
			<div className="h-svh w-full overflow-hidden lg:p-2">
				<div className="flex h-full w-full flex-col overflow-hidden bg-background lg:rounded-md lg:border">
					{/* <div className="hidden h-full lg:flex">
						<DashboardHeader />
					</div> */}
					<MobileHeader />
					<main className="w-full flex-1 overflow-auto">
						<Outlet />
					</main>
					<MobileBottomNav />
				</div>
			</div>
		</SidebarProvider>
	);
}
