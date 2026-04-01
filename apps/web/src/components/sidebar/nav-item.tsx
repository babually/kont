import { Link } from "@tanstack/react-router";
import type { LucideProps } from "lucide-react";
import { cloneElement } from "react";

interface NavItemProps {
	activeOptions?: { exact: boolean };
	icon: React.ReactNode;
	isCollapsed: boolean;
	label: string;
	params?: Record<string, string>;
	to: string;
}

export function NavItem({
	icon,
	label,
	to,
	activeOptions,
	isCollapsed,
	params,
}: NavItemProps) {
	// Clone icon with dynamic size based on collapsed state
	const dynamicIcon = cloneElement(icon as React.ReactElement<LucideProps>, {
		size: isCollapsed ? 20 : 14,
	});

	return (
		<Link
			activeOptions={activeOptions}
			activeProps={{
				className:
					"bg-accent/10 text-accent font-medium border border-accent/20 shadow-[0_0_15px_rgba(255,166,43,0.1)]",
			}}
			className={`flex items-center ${isCollapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-1"} group relative w-full rounded-xl text-sm transition-all duration-200`}
			inactiveProps={{
				className:
					"text-gray-400 hover:text-white hover:bg-white/5 border border-transparent",
			}}
			params={params}
			title={isCollapsed ? label : undefined}
			to={to}
		>
			{dynamicIcon}
			{!isCollapsed && <span>{label}</span>}
		</Link>
	);
}
