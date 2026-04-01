// import { Button } from "@kont/ui/components/button";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarTrigger,
} from "@kont/ui/components/sidebar";
import { cn } from "@kont/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import {
	Bell,
	Clock,
	Container,
	Layers,
	LayoutDashboard,
	Search,
	Settings,
	// Star,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { UserSection } from "../sidebar/user-section";

const navItems = [
	{
		title: "Search",
		icon: Search,
		to: "/",
		iconColor: "text-muted-foreground",
	},
	{
		title: "Overview",
		icon: LayoutDashboard,
		isActive: true,
		to: "/dashboard",
		iconColor: "text-violet-500",
	},
	{
		title: "Contacts",
		icon: Layers,
		to: "/dashboard/contacts",
		iconColor: "text-blue-500",
	},
	{
		title: "Meetings",
		icon: Bell,
		to: "/dashboard/meetings",
		iconColor: "text-amber-500",
	},
	{
		title: "Reminders",
		icon: Clock,
		to: "/dashboard/reminders",
		iconColor: "text-green-500",
	},
	{
		title: "Settings",
		icon: Settings,
		to: "/dashboard/settings",
		iconColor: "text-orange-500",
	},
];

export function DashboardSidebar(props: React.ComponentProps<typeof Sidebar>) {
	// const router = useRouter();
	const { data: session } = authClient.useSession();
	const user = session?.user;
	const isCollapsed = props.collapsible === "icon";

	// const handleSignOut = async () => {
	// 	await authClient.signOut({
	// 		fetchOptions: {
	// 			onSuccess: () => {
	// 				router.navigate({ to: "/sign-in" });
	// 			},
	// 		},
	// 	});
	// };

	return (
		<Sidebar className="lg:border-r-0!" collapsible="icon" {...props}>
			<SidebarHeader className="px-3 py-4">
				<div className="flex w-full items-center justify-between">
					<SidebarMenu className="flex-1">
						<SidebarMenuItem>
							<SidebarMenuButton
								className="group-data-[state=collapsed]:hidden"
								size="lg"
							>
								<Link className="flex flex-row gap-3" to="/dashboard">
									<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
										<Container className="size-4" />
									</div>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-semibold">Kont</span>
										<span className="truncate text-xs">Dashboard</span>
									</div>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
					<SidebarTrigger className="-mr-1" />
				</div>
			</SidebarHeader>
			<SidebarContent className="px-2">
				<SidebarGroup className="p-0">
					<SidebarGroupContent>
						<SidebarMenu>
							{navItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										className="h-9"
										isActive={item.isActive}
										render={<Link to={item.to} />}
									>
										<item.icon
											className={cn("size-4 shrink-0", item.iconColor)}
										/>
										<span className="text-sm">{item.title}</span>
										{/* {item.shortcut && (
											<span className="ml-auto flex size-5 items-center justify-center rounded bg-muted font-medium text-[10px] text-muted-foreground">
												{item.shortcut}
											</span>
										)} */}
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className="px-2 pb-3 group-data-[collapsible=icon]:hidden">
				<UserSection isCollapsed={isCollapsed} user={user} />
				{/* <div className="group/sidebar relative flex w-full flex-col gap-2 rounded-lg border bg-background p-4 text-sm">
					<Button onClick={handleSignOut}>Log Out</Button>
				</div> */}
			</SidebarFooter>
		</Sidebar>
	);
}
