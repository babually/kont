import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@kont/ui/components/avatar";
import { SidebarTrigger } from "@kont/ui/components/sidebar";

export function DashboardHeader() {
	return (
		<header className="sticky top-0 z-10 flex w-full shrink-0 items-center justify-between gap-4 border-b bg-card px-4 py-3 sm:px-6">
			<div className="flex items-center gap-3">
				<SidebarTrigger className="-ml-2" />
				{/* <div className="flex items-center gap-2 text-muted-foreground">
          <HugeiconsIcon icon={Folder01Icon} className="size-4" />
          <span className="text-sm font-medium">Dashboard</span>
        </div> */}
			</div>

			<div className="flex items-center gap-2 sm:gap-3">
				<div className="flex -space-x-2">
					<Avatar className="size-7 border-2 border-card">
						<AvatarImage src="https://api.dicebear.com/9.x/glass/svg?seed=a" />
						<AvatarFallback>A</AvatarFallback>
					</Avatar>
				</div>
				{/* <ModeToggle /> */}
			</div>
		</header>
	);
}
