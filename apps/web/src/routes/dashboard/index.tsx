import { convexQuery } from "@convex-dev/react-query";
import { api } from "@kont/backend/convex/_generated/api";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@kont/ui/components/card";
import {
	Dialog,
	DialogContent,
	DialogTrigger,
} from "@kont/ui/components/dialog";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	Activity,
	Bell,
	Clock,
	CreditCard,
	DollarSign,
	UserCog,
	Users,
} from "lucide-react";
import { useState } from "react";
import { ContactForm } from "./contacts/-components/contact-form";

export const Route = createFileRoute("/dashboard/")({
	component: DashboardIndexPage,
});

// const stats = [
// 	{
// 		title: "Total Revenue",
// 		value: "$45,231.89",
// 		icon: DollarSign,
// 		description: "+20.1% from last month",
// 		trend: "up",
// 		color: "text-emerald-600",
// 		bgColor: "bg-emerald-50",
// 	},
// 	{
// 		title: "Subscriptions",
// 		value: "+2,350",
// 		icon: Users,
// 		description: "+180.1% from last month",
// 		trend: "up",
// 		color: "text-blue-600",
// 		bgColor: "bg-blue-50",
// 	},
// 	{
// 		title: "Sales",
// 		value: "+12,234",
// 		icon: CreditCard,
// 		description: "+19% from last month",
// 		trend: "up",
// 		color: "text-purple-600",
// 		bgColor: "bg-purple-50",
// 	},
// 	{
// 		title: "Active Now",
// 		value: "+573",
// 		icon: Activity,
// 		description: "+201 since last hour",
// 		trend: "up",
// 		color: "text-orange-600",
// 		bgColor: "bg-orange-50",
// 	},
// ];

function DashboardIndexPage() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const contactsQuery = useSuspenseQuery(
		convexQuery(api.functions.contacts.getAllContacts, {})
	);
	const contacts = contactsQuery.data;

	const meetingsQuery = useSuspenseQuery(
		convexQuery(api.functions.meetings.getAllMeetings, {})
	);
	const meetings = meetingsQuery.data;

	const remindersQuery = useSuspenseQuery(
		convexQuery(api.functions.reminders.getAllReminders, {})
	);
	const reminders = remindersQuery.data;

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "high":
				return "bg-green-100";
			case "medium":
				return "bg-yellow-100";
			case "low":
				return "bg-red-100";
			default:
				return "bg-gray-100";
		}
	};

	return (
		<div className="min-h-svh w-full space-y-8 p-6 md:p-10">
			{/* Header Section */}
			<div className="flex flex-col gap-2">
				<h1 className="font-bold text-4xl tracking-tight">Dashboard</h1>
				<p className="text-lg text-muted-foreground">
					Welcome back! Here&apos;s an overview of your data.
				</p>
			</div>

			{/* Stats Grid */}
			<div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Contacts</CardTitle>
						<UserCog size={18} />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">{contacts.length}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Meetings</CardTitle>
						<Bell size={18} />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">{meetings.length}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Reminders</CardTitle>
						<Clock size={18} />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">{reminders.length}</div>
					</CardContent>
				</Card>
			</div>

			{/* Additional Content Sections */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Recent Activity Card */}
				<Card>
					<CardHeader>
						<CardTitle className="font-semibold text-xl">
							Recent Meetings
						</CardTitle>
						<p className="text-muted-foreground">
							Latest updates from your dashboard
						</p>
					</CardHeader>
					<CardContent className="space-y-4">
						{reminders.slice(0, 3).map((reminder) => (
							<div
								className="flex items-center gap-4 rounded-lg border p-4"
								key={reminder._id}
							>
								<div
									className={`h-2 w-2 rounded-full ${getPriorityColor(
										reminder.priority
									)}`}
								/>
								<div className="flex-1">
									<p className="font-medium">{reminder.title}</p>
									<p className="text-muted-foreground text-sm">
										{new Date(reminder.dueDate).toDateString()}
									</p>
								</div>
							</div>
						))}
					</CardContent>
				</Card>

				{/* Quick Actions Card */}
				<Card>
					<CardHeader>
						<CardTitle className="font-semibold text-xl">
							Quick Actions
						</CardTitle>
						<p className="text-muted-foreground">Commonly used features</p>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
								<DialogTrigger>
									<button
										className="flex flex-col items-center justify-center gap-2 rounded-lg border p-6 transition-colors hover:bg-muted"
										type="button"
									>
										<Users className="h-6 w-6" />
										<span className="font-medium text-sm">Add Contacts</span>
									</button>
								</DialogTrigger>
								<DialogContent>
									<ContactForm onClose={() => setIsDialogOpen(false)} />
								</DialogContent>
							</Dialog>

							<button
								className="flex flex-col items-center justify-center gap-2 rounded-lg border p-6 transition-colors hover:bg-muted"
								type="button"
							>
								<CreditCard className="h-6 w-6" />
								<span className="font-medium text-sm">New Sale</span>
							</button>
							<button
								className="flex flex-col items-center justify-center gap-2 rounded-lg border p-6 transition-colors hover:bg-muted"
								type="button"
							>
								<Activity className="h-6 w-6" />
								<span className="font-medium text-sm">Reports</span>
							</button>
							<button
								className="flex flex-col items-center justify-center gap-2 rounded-lg border p-6 transition-colors hover:bg-muted"
								type="button"
							>
								<DollarSign className="h-6 w-6" />
								<span className="font-medium text-sm">Analytics</span>
							</button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
