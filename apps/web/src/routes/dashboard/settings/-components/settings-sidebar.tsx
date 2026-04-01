import { cn } from "@kont/ui/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";

interface SettingsSidebarNavProps extends React.HTMLAttributes<HTMLElement> {
	items: {
		href: string;
		title: string;
		icon: React.ReactNode;
	}[];
}

export function SettingsSidebarNav({
	className,
	items,

	...props
}: SettingsSidebarNavProps) {
	const location = useLocation();
	const pathname = location.pathname;

	return (
		<nav
			className={cn(
				"flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
				className
			)}
			{...props}
		>
			{items.map((item) => (
				<Link
					className={cn(
						"w-34",
						"inline-flex items-center justify-start gap-2 whitespace-nowrap rounded-md px-3 py-2 font-medium text-sm transition-colors",
						"focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
						pathname === item.href
							? "bg-muted hover:bg-muted"
							: "hover:bg-transparent hover:underline"
					)}
					key={item.href}
					to={item.href}
				>
					{item.icon}
					{item.title}
				</Link>
			))}
		</nav>
	);
}
