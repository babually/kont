import { api } from "@kont/backend/convex/_generated/api";
import type { Id } from "@kont/backend/convex/_generated/dataModel";
import { Button } from "@kont/ui/components/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@kont/ui/components/card";
import { Checkbox } from "@kont/ui/components/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@kont/ui/components/dropdown-menu";
import { cn } from "@kont/ui/lib/utils";
import { useMutation } from "convex/react";
import { MoreHorizontal, Pencil, Trash2, User2 } from "lucide-react";

interface ReminderCardProps {
	onEdit: (id: Id<"reminders">) => void;
	reminder: {
		_id: Id<"reminders">;
		title: string;
		description?: string;
		dueDate: number;
		priority: "high" | "medium" | "low";
		completed: boolean;
		contact?: {
			fullName: string;
		};
		meeting?: {
			title: string;
		};
	};
}

export function ReminderCard({ reminder, onEdit }: ReminderCardProps) {
	const deleteReminder = useMutation(api.functions.reminders.deleteReminder);
	const toggleComplete = useMutation(api.functions.reminders.toggleComplete);

	const handleDelete = async (id: Id<"reminders">) => {
		if (confirm("Are you sure you want to delete this reminder?")) {
			await deleteReminder({ id });
		}
	};

	const handleToggleComplete = async (id: Id<"reminders">) => {
		await toggleComplete({ id });
	};

	const formatDate = (timestamp: number) => {
		return new Date(timestamp).toLocaleDateString();
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "high":
				return "bg-red-100 text-red-800";
			case "medium":
				return "bg-yellow-100 text-yellow-800";
			case "low":
				return "bg-green-100 text-green-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const isOverdue = (dueDate: number) => {
		return new Date(dueDate) < new Date() && !reminder.completed;
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-start gap-4">
					<Checkbox
						checked={reminder.completed}
						className="mt-1"
						id={`row-${reminder._id}-checkbox`}
						onCheckedChange={() => handleToggleComplete(reminder._id)}
					/>
					<div className="min-w-0 flex-1">
						<CardTitle>
							<h3
								className={cn(
									"truncate font-semibold text-lg",
									reminder.completed
										? "text-gray-500 line-through"
										: "text-gray-900"
								)}
							>
								{reminder.title}
							</h3>
						</CardTitle>
						<CardDescription className="mt-1 flex flex-wrap gap-2">
							<span
								className={cn(
									"rounded-full px-2 py-1 font-medium text-xs",
									getPriorityColor(reminder.priority)
								)}
							>
								{reminder.priority}
							</span>
							{isOverdue(reminder.dueDate) && !reminder.completed && (
								<span className="rounded-full bg-red-100 px-2 py-1 font-medium text-red-800 text-xs">
									Overdue
								</span>
							)}
						</CardDescription>
					</div>
				</div>
				<CardAction>
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Button
								className="h-8 w-8 rounded-full text-muted-foreground/50 opacity-0 transition-opacity hover:text-foreground group-hover/card:opacity-100"
								size="icon"
								variant="ghost"
							>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-32">
							<DropdownMenuItem onClick={() => onEdit(reminder._id)}>
								<Pencil className="mr-2 h-4 w-4" />
								Edit
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => handleDelete(reminder._id)}
								variant="destructive"
							>
								<Trash2 className="mr-2 h-4 w-4" />
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</CardAction>
			</CardHeader>
			<CardContent>
				<div className="space-y-1 text-gray-600 text-sm">
					<div className="flex items-center gap-2">
						<span>📅</span>
						<span>Due: {formatDate(reminder.dueDate)}</span>
					</div>

					{reminder.contact && (
						<div className="flex items-center gap-2">
							<User2 className="h-4 w-4" />
							<span>Contact: {reminder.contact.fullName}</span>
						</div>
					)}

					{reminder.meeting && (
						<div className="flex items-center gap-2">
							<span>📅</span>
							<span>Meeting: {reminder.meeting.title}</span>
						</div>
					)}
				</div>

				{reminder.description && (
					<div className="mt-3 text-gray-600 text-sm">
						<p>{reminder.description}</p>
					</div>
				)}
			</CardContent>
		</Card>
		/* <div
			className={`rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${
				reminder.completed ? "opacity-75" : ""
			} ${isOverdue(reminder.dueDate) ? "border-red-200 bg-red-50" : "border-gray-200"}`}
		>
			<div className="flex items-start gap-4">
				<Button
					className={`mt-1 flex h-5 w-5 items-center justify-center rounded border-2 ${
						reminder.completed
							? "border-green-500 bg-green-500 text-white"
							: "border-gray-300 hover:border-green-500"
					}`}
					onClick={() => handleToggleComplete(reminder._id)}
				>
					{reminder.completed && "✓"}
				</Button>

				<div className="flex-1">
					<div className="mb-2 flex items-center gap-3">
						<h3
							className={`font-semibold text-lg ${
								reminder.completed
									? "text-gray-500 line-through"
									: "text-gray-900"
							}`}
						>
							{reminder.title}
						</h3>
						<span
							className={`rounded-full px-2 py-1 font-medium text-xs ${getPriorityColor(reminder.priority)}`}
						>
							{reminder.priority}
						</span>

						{isOverdue(reminder.dueDate) && !reminder.completed && (
							<span className="rounded-full bg-red-100 px-2 py-1 font-medium text-red-800 text-xs">
								Overdue
							</span>
						)}

						<div className="">
							<DropdownMenu>
								<DropdownMenuTrigger>
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 rounded-full text-muted-foreground/50 hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
									>
										<MoreHorizontal className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-32">
									<DropdownMenuItem onClick={() => onEdit(reminder._id)}>
									<Pencil className="mr-2 h-4 w-4" />
										Edit
									</DropdownMenuItem>
									<DropdownMenuItem
										className="text-destructive focus:text-destructive"
										onClick={() => handleDelete(reminder._id)}
									>
									<Trash2 className="mr-2 h-4 w-4" />
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

					</div>

					<div className="space-y-1 text-gray-600 text-sm">
						<div className="flex items-center gap-2">
							<span>📅</span>
							<span>Due: {formatDate(reminder.dueDate)}</span>
						</div>

						{reminder.contact && (
							<div className="flex items-center gap-2">
								<User2 className="h-4 w-4" />
								<span>Contact: {reminder.contact.fullName}</span>
							</div>
						)}

						{reminder.meeting && (
							<div className="flex items-center gap-2">
								<span>📅</span>
								<span>Meeting: {reminder.meeting.title}</span>
							</div>
						)}
					</div>

					{reminder.description && (
						<div className="mt-3 text-gray-600 text-sm">
							<p>{reminder.description}</p>
						</div>
					)}
				</div>
			</div>
		</div> */
	);
}
