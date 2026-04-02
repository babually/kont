import { Separator } from "@kont/ui/components/separator";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Palette, UserCog, Wrench } from "lucide-react";
import { SettingsSidebarNav } from "./-components/settings-sidebar";

export const Route = createFileRoute("/dashboard/settings")({
	component: SettingsLayout,
});

const sidebarNavItems = [
	{
		title: "Profile",
		icon: <UserCog size={18} />,
		href: "/dashboard/settings",
	},
	{
		title: "Account",
		icon: <Wrench size={18} />,
		href: "/dashboard/settings/account",
	},
	{
		title: "Appearance",
		icon: <Palette size={18} />,
		href: "/dashboard/settings/appearance",
	},
];

function SettingsLayout() {
	return (
		<div className="min-h-svh w-full p-6 md:p-10">
			<div className="space-y-1.5 pb-1.5">
				<h1 className="font-bold text-2xl tracking-tight md:text-3xl">
					Settings
				</h1>
				<p className="text-muted-foreground">
					Manage your account settings and set e-mail preferences.
				</p>
			</div>
			<Separator />
			<div className="flex flex-col space-y-8 pt-6 lg:flex-row lg:space-x-12 lg:space-y-0">
				<aside className="-mx-4 lg:w-1/5">
					<SettingsSidebarNav items={sidebarNavItems} />
				</aside>
				<div className="flex-1 space-x-7 lg:max-w-2xl">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
