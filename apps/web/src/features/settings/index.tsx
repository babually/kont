import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@kont/ui/components/ui/tabs";
import { Palette, UserCog, Wrench } from "lucide-react";
import { SettingsAccount } from "./account";
import { SettingsAppearance } from "./appearance";
import { SettingsProfile } from "./profile";

const tabs = [
	{
		name: "Profile",
		value: "profile",
		icon: <UserCog size={18} />,
		content: <SettingsProfile />,
	},
	{
		name: "Account",
		value: "account",
		icon: <Wrench size={18} />,
		content: <SettingsAccount />,
	},
	{
		name: "Appearance",
		value: "appearance",
		icon: <Palette size={18} />,
		content: <SettingsAppearance />,
	},
];

export function Settings() {
	return (
		<div className="w-full max-w-md">
			<Tabs defaultValue="explore" orientation="vertical">
				<TabsList className="h-full flex-col">
					{tabs.map(({ icon, name, value }) => (
						<TabsTrigger
							className="flex w-full items-center justify-start gap-1.5 px-2.5 sm:px-3"
							key={value}
							value={value}
						>
							{icon}
							{name}
						</TabsTrigger>
					))}
				</TabsList>

				{tabs.map((tab) => (
					<TabsContent key={tab.value} value={tab.value}>
						<p className="text-muted-foreground text-sm">{tab.content}</p>
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
}
