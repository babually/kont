import { Link } from "@tanstack/react-router";
import { Bell, Clock, Layers, LayoutDashboard, Menu } from "lucide-react";
import { useState } from "react";
import { MobileNavSheet } from "./mobile-nav-sheet";

const NAV_ICON_SIZE = 22;

export function MobileBottomNav() {
	const [isSheetOpen, setIsSheetOpen] = useState(false);

	const mainNavItems = [
		{
			icon: <LayoutDashboard size={NAV_ICON_SIZE} />,
			to: "/dashboard",
			iconColor: "text-violet-500",
			activeOptions: { exact: true },
		},
		{
			icon: <Layers size={NAV_ICON_SIZE} />,
			to: "/dashboard/contacts",
			iconColor: "text-blue-500",
		},
		{
			icon: <Bell size={NAV_ICON_SIZE} />,
			to: "/dashboard/meetings",
			iconColor: "text-amber-500",
		},
		{
			icon: <Clock size={NAV_ICON_SIZE} />,
			to: "/dashboard/reminders",
			iconColor: "text-green-500",
		},
	];

	return (
		<>
			<nav className="fixed right-0 bottom-0 left-0 z-50 h-16 border-t bg-background pb-env(safe-area-inset-bottom) md:hidden">
				<div className="flex h-16 items-center justify-around">
					{mainNavItems.map((item) => (
						<Link
							activeOptions={item.activeOptions}
							activeProps={{
								className: "text-blue-400",
							}}
							className="flex h-full w-full flex-col items-center justify-center transition-colors"
							inactiveProps={{
								className: "text-black-500",
							}}
							key={item.to}
							to={item.to}
						>
							{item.icon}
						</Link>
					))}
					<button
						className="flex h-full w-full flex-col items-center justify-center text-gray-900 transition-colors hover:text-primary"
						onClick={() => setIsSheetOpen(true)}
					>
						<Menu size={NAV_ICON_SIZE} />
					</button>
				</div>
			</nav>

			<MobileNavSheet
				isOpen={isSheetOpen}
				onClose={() => setIsSheetOpen(false)}
			/>
		</>
	);
}
