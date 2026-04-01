import { convexQuery } from "@convex-dev/react-query";
import { api } from "@kont/backend/convex/_generated/api";
import type { Id } from "@kont/backend/convex/_generated/dataModel";
import { Button } from "@kont/ui/components/button";
import { Dialog, DialogContent } from "@kont/ui/components/dialog";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { Plus, User2 } from "lucide-react";
import { useState } from "react";

import { ReminderForm } from "./-components/reminder-form";

export const Route = createFileRoute("/dashboard/reminders/")({
	component: RouteComponent,
});

function RouteComponent() {
	const remindersQuery = useSuspenseQuery(
		convexQuery(api.functions.reminders.getAllReminders, {})
	);

	const reminders = remindersQuery.data;

	// Transform reminders to have the correct shape for the UI
	const transformedReminders = reminders.map((reminder) => ({
		...reminder,
		contact: reminder.contact
			? { fullName: reminder.contact.fullName }
			: undefined,
		meeting: reminder.meeting ? { title: reminder.meeting.title } : undefined,
	}));

	const deleteReminder = useMutation(api.functions.reminders.deleteReminder);
	const toggleComplete = useMutation(api.functions.reminders.toggleComplete);
	const [showForm, setShowForm] = useState(false);
	const [editingReminder, setEditingReminder] =
		useState<Id<"reminders"> | null>(null);

	const handleDelete = async (id: Id<"reminders">) => {
		// biome-ignore lint/suspicious/noAlert: Using native confirm for simplicity
		if (confirm("Are you sure you want to delete this reminder?")) {
			await deleteReminder({ id });
		}
	};

	const handleEdit = (id: Id<"reminders">) => {
		setEditingReminder(id);
		setShowForm(true);
	};

	const handleToggleComplete = async (id: Id<"reminders">) => {
		await toggleComplete({ id });
	};

	const handleCloseForm = () => {
		setShowForm(false);
		setEditingReminder(null);
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
		return (
			new Date(dueDate) < new Date() &&
			!reminders.find((r) => r.dueDate === dueDate)?.completed
		);
	};

	return (
		<div className="flex min-h-svh flex-col gap-6 bg-muted p-6 md:p-10">
			<div className="mx-auto w-full max-w-4xl space-y-6">
				<div className="flex items-center justify-between">
					<h2 className="font-bold text-2xl text-primary">Reminders</h2>
					<Button onClick={() => setShowForm(true)}>
						<Plus className="mr-2 h-4 w-4" />
						Add Reminder
					</Button>
				</div>

				{showForm && (
					<Dialog onOpenChange={setShowForm} open={showForm}>
						<DialogContent>
							<ReminderForm
								onClose={handleCloseForm}
								reminderId={editingReminder}
							/>
						</DialogContent>
					</Dialog>
				)}

				{transformedReminders.length === 0 ? (
					<div className="flex flex-col items-center justify-center gap-4 rounded-lg border bg-background py-10">
						<p className="text-muted-foreground">No reminders yet</p>
						<p className="text-muted-foreground text-sm">
							Create your first reminder to get started
						</p>
					</div>
				) : (
					<div className="space-y-4">
						{transformedReminders.map((reminder) => (
							<div
								className={`rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${
									reminder.completed ? "opacity-75" : ""
								} ${
									isOverdue(reminder.dueDate)
										? "border-red-200 bg-red-50"
										: "border-gray-200"
								}`}
								key={reminder._id}
							>
								<div className="flex items-start gap-4">
									<button
										className={`mt-1 flex h-5 w-5 items-center justify-center rounded border-2 ${
											reminder.completed
												? "border-green-500 bg-green-500 text-white"
												: "border-gray-300 hover:border-green-500"
										}`}
										onClick={() => handleToggleComplete(reminder._id)}
										type="button"
									>
										{reminder.completed && "✓"}
									</button>

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
												className={`rounded-full px-2 py-1 font-medium text-xs ${getPriorityColor(
													reminder.priority
												)}`}
											>
												{reminder.priority}
											</span>
											{isOverdue(reminder.dueDate) && !reminder.completed && (
												<span className="rounded-full bg-red-100 px-2 py-1 font-medium text-red-800 text-xs">
													Overdue
												</span>
											)}
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

									<div className="flex gap-2">
										<Button
											className="text-blue-600 text-sm hover:text-blue-800"
											onClick={() => handleEdit(reminder._id)}
										>
											Edit
										</Button>
										<Button
											className="text-red-600 text-sm hover:text-red-800"
											onClick={() => handleDelete(reminder._id)}
										>
											Delete
										</Button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
