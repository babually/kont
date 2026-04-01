import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface UserSectionProps {
	isCollapsed: boolean;
	user: any;
}

export function UserSection({ user, isCollapsed }: UserSectionProps) {
	const navigate = useNavigate();

	const handleLogout = async () => {
		await authClient.signOut();
		navigate({ to: "/", search: { redirect: undefined } });
	};

	return (
		<div
			className={`${isCollapsed ? "p-2" : "p-3"} space-y-2 border-white/5 border-t bg-black/20`}
		>
			<div
				className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"} ${isCollapsed ? "h-10 w-10" : "px-2 py-2"} group relative cursor-pointer rounded-xl border border-transparent transition-colors hover:border-white/5 hover:bg-white/5`}
			>
				<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-tr from-accent to-orange-600 font-bold text-black text-xs shadow-accent/20 shadow-lg">
					{user?.name?.substring(0, 2).toUpperCase() || "U"}
				</div>
				{!isCollapsed && (
					<>
						<div className="min-w-0 flex-1">
							<div className="truncate font-medium text-sm text-white transition-colors group-hover:text-accent">
								{user?.name || "User"}
							</div>
							<div className="truncate text-gray-500 text-xs">
								{user?.email || "user@example.com"}
							</div>
						</div>
						<button
							className="text-gray-500 transition-colors hover:text-white"
							onClick={handleLogout}
						>
							<LogOut size={16} />
						</button>
					</>
				)}
				{isCollapsed && (
					<div className="pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap rounded border border-white/10 bg-gray-800 px-2 py-1 text-white text-xs opacity-0 group-hover:opacity-100">
						{user?.name || "User"}
					</div>
				)}
			</div>
		</div>
	);
}
