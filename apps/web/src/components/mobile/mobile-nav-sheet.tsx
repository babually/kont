import { Link, useNavigate } from "@tanstack/react-router";
import { Key, Link2, LogOut, Settings, Users, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface MobileNavSheetProps {
	isOpen: boolean;
	onClose: () => void;
}

const NAV_ICON_SIZE = 20;

export function MobileNavSheet({ isOpen, onClose }: MobileNavSheetProps) {
	const navigate = useNavigate();
	//   const location = useLocation();
	const { data: session } = authClient.useSession();
	const user = session?.user;

	const handleLogout = async () => {
		await authClient.signOut();
		navigate({ to: "/", search: { redirect: undefined } });
	};

	const moreNavItems = [
		{
			to: "/$orgSlug/domains",
			icon: <Link2 size={NAV_ICON_SIZE} />,
			label: "Domains",
		},
		{
			to: "/$orgSlug/members",
			icon: <Users size={NAV_ICON_SIZE} />,
			label: "Members",
		},
		{
			to: "/$orgSlug/tokens",
			icon: <Key size={NAV_ICON_SIZE} />,
			label: "API Tokens",
		},
		{
			to: "/$orgSlug/settings",
			icon: <Settings size={NAV_ICON_SIZE} />,
			label: "Settings",
		},
	].filter(Boolean) as { to: string; icon: React.ReactNode; label: string }[];

	return (
		<>
			{/* Backdrop */}
			<div
				className={`fixed inset-0 z-50 bg-black/90 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
					isOpen ? "opacity-100" : "pointer-events-none opacity-0"
				}`}
				onClick={onClose}
			/>

			{/* Sheet */}
			<div
				className={`fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-white/10 border-t bg-[#0a0a0a] transition-transform duration-300 ease-out md:hidden ${
					isOpen ? "translate-y-0" : "translate-y-full"
				}`}
			>
				{/* Handle bar */}
				<div className="flex justify-center py-3">
					<div className="h-1 w-10 rounded-full bg-white/20" />
				</div>

				{/* Header */}
				<div className="flex items-center justify-between px-6 pb-4">
					<div className="flex items-center gap-3">
						{user && (
							<>
								<div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-linear-to-br from-gray-800 to-black">
									<span className="font-bold text-sm text-white">
										{user.name?.charAt(0).toUpperCase() ||
											user.email?.charAt(0).toUpperCase()}
									</span>
								</div>
								<div>
									<p className="font-medium text-white">{user.name}</p>
									<p className="text-gray-500 text-xs">{user.email}</p>
								</div>
							</>
						)}
					</div>
					<button
						className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
						onClick={onClose}
					>
						<X size={20} />
					</button>
				</div>

				{/* Nav items */}
				<div className="space-y-1 px-4 pb-4">
					{moreNavItems.map((item) => (
						<Link
							activeProps={{
								className: "bg-accent/10 text-accent border-accent/20",
							}}
							className="flex w-full items-center gap-4 rounded-xl border px-4 py-3.5 text-sm transition-colors"
							inactiveProps={{
								className: "text-gray-400 border-transparent hover:bg-white/5",
							}}
							key={item.to}
							onClick={onClose}
							to={item.to}
						>
							{item.icon}
							<span>{item.label}</span>
						</Link>
					))}
				</div>

				{/* Footer actions */}
				<div className="space-y-1 border-white/5 border-t px-4 pt-2 pb-6">
					<button
						className="flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-red-400 text-sm transition-colors hover:bg-red-500/10 hover:text-red-300"
						onClick={handleLogout}
					>
						<LogOut size={NAV_ICON_SIZE} />
						<span>Logout</span>
					</button>
				</div>
			</div>
		</>
	);
}
