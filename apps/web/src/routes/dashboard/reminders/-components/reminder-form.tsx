import { convexQuery } from "@convex-dev/react-query";
import { api } from "@kont/backend/convex/_generated/api";
import type { Id } from "@kont/backend/convex/_generated/dataModel";
import { Button } from "@kont/ui/components/button";
import { Calendar } from "@kont/ui/components/calendar";
import { Checkbox } from "@kont/ui/components/checkbox";
import { Field, FieldGroup, FieldLabel } from "@kont/ui/components/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@kont/ui/components/input-group";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@kont/ui/components/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@kont/ui/components/select";
import { Textarea } from "@kont/ui/components/textarea";
import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMutation } from "convex/react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { useEffect } from "react";

function formatDate(date: Date | undefined): string {
	return date ? format(date, "MMM dd, yyyy") : "";
}

function isValidDate(date: Date): boolean {
	return date instanceof Date && !Number.isNaN(date.getTime());
}

interface ReminderFormProps {
	onClose: () => void;
	reminderId?: Id<"reminders"> | null;
}

export function ReminderForm({ reminderId, onClose }: ReminderFormProps) {
	const [open, setOpen] = React.useState(false);
	const [date, setDate] = React.useState<Date | undefined>(
		new Date("2025-06-01")
	);
	const [month, setMonth] = React.useState<Date | undefined>(date);
	const [value, setValue] = React.useState(formatDate(date));

	const contactsQuery = useSuspenseQuery(
		convexQuery(api.functions.contacts.getAllContacts, {})
	);
	const meetingsQuery = useSuspenseQuery(
		convexQuery(api.functions.meetings.getAllMeetings, {})
	);

	const remindersQuery = useSuspenseQuery(
		convexQuery(api.functions.reminders.getAllReminders, {})
	);
	const reminders = remindersQuery.data;
	const reminder = reminders?.find((c) => c._id === reminderId);
	const createReminder = useMutation(api.functions.reminders.createReminder);
	const updateReminder = useMutation(api.functions.reminders.updateReminder);

	const form = useForm({
		defaultValues: {
			contactId: "",
			meetingId: "",
			title: "",
			description: "",
			dueDate: "",
			priority: "medium" as "low" | "medium" | "high",
			completed: false,
		},
		onSubmit: async ({ value }) => {
			const dueDateTimestamp = new Date(value.dueDate).getTime();

			const reminderData = {
				contactId: value.contactId
					? (value.contactId as Id<"contacts">)
					: undefined,
				meetingId: value.meetingId
					? (value.meetingId as Id<"meetings">)
					: undefined,
				title: value.title,
				description: value.description || undefined,
				dueDate: dueDateTimestamp,
				priority: value.priority,
				completed: value.completed,
			};

			try {
				if (reminderId) {
					await updateReminder({ id: reminderId, ...reminderData });
				} else {
					await createReminder(reminderData);
				}
				onClose();
			} catch (error) {
				console.error("Error saving reminder:", error);
			}
		},
	});

	// Update form values when reminder data is loaded
	useEffect(() => {
		if (reminder) {
			const dueDate = new Date(reminder.dueDate);

			form.setFieldValue("contactId", reminder.contactId || "");
			form.setFieldValue("meetingId", reminder.meetingId || "");
			form.setFieldValue("title", reminder.title);
			form.setFieldValue("description", reminder.description || "");
			form.setFieldValue("dueDate", dueDate.toISOString().split("T")[0]);
			form.setFieldValue("priority", reminder.priority);
			form.setFieldValue("completed", reminder.completed);
		}
	}, [reminder, form]);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
			<div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white shadow-xl">
				<div className="p-6">
					<div className="mb-6 flex items-center justify-between">
						<h2 className="font-bold text-gray-900 text-xl">
							{reminderId ? "Edit Reminder" : "Add Reminder"}
						</h2>
						<Button
							className="text-gray-400 hover:text-gray-600"
							onClick={onClose}
						>
							✕
						</Button>
					</div>

					<form className="space-y-4" onSubmit={form.handleSubmit}>
						<FieldGroup>
							<form.Field
								name="title"
								validators={{
									onChange: ({ value }) => {
										if (!value) {
											return "Title is required";
										}
										return undefined;
									},
								}}
							>
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel>Title</FieldLabel>
											<input
												aria-invalid={isInvalid}
												autoComplete="off"
												className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
												id={field.name}
												name={field.name}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Enter reminder title"
												type="text"
												value={field.state.value}
											/>
											{isInvalid && (
												<p className="mt-1 text-red-600 text-sm">
													{field.state.meta.errors.join(", ")}
												</p>
											)}
										</Field>
									);
								}}
							</form.Field>

							<form.Field
								name="dueDate"
								validators={{
									onChange: ({ value }) => {
										if (!value) {
											return "Due date is required";
										}
										return undefined;
									},
								}}
							>
								{() => (
									<Field className="mx-auto w-full max-w-lg">
										<FieldLabel htmlFor="date-required">Due Date</FieldLabel>
										<InputGroup>
											<InputGroupInput
												id="date-required"
												onChange={(e) => {
													const dateVal = new Date(e.target.value);
													setValue(e.target.value);
													if (isValidDate(dateVal)) {
														setDate(dateVal);
														setMonth(dateVal);
													}
													form.setFieldValue("dueDate", e.target.value);
												}}
												onKeyDown={(e) => {
													if (e.key === "ArrowDown") {
														e.preventDefault();
														setOpen(true);
													}
												}}
												placeholder="June 01, 2025"
												value={value}
											/>
											<InputGroupAddon align="inline-end">
												<Popover onOpenChange={setOpen} open={open}>
													<PopoverTrigger
														id="date-picker"
														render={
															<InputGroupButton
																aria-label="Select date"
																id="date-picker"
																size="icon-xs"
																variant="ghost"
															>
																<CalendarIcon />
																<span className="sr-only">Select date</span>
															</InputGroupButton>
														}
													/>
													<PopoverContent
														align="end"
														alignOffset={-8}
														className="w-auto overflow-hidden p-0"
														sideOffset={10}
													>
														<Calendar
															mode="single"
															month={month}
															onMonthChange={setMonth}
															onSelect={(selectedDate) => {
																if (selectedDate) {
																	setDate(selectedDate);
																	setValue(formatDate(selectedDate));
																	const dateStr = selectedDate
																		.toISOString()
																		.split("T")[0];
																	form.setFieldValue("dueDate", dateStr);
																	setOpen(false);
																}
															}}
															selected={date}
														/>
													</PopoverContent>
												</Popover>
											</InputGroupAddon>
										</InputGroup>
									</Field>
								)}
							</form.Field>

							<form.Field name="priority">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Priority</FieldLabel>
											<Select
												aria-invalid={isInvalid}
												name={field.name}
												onValueChange={(value) => {
													if (value) {
														field.handleChange(
															value as "low" | "medium" | "high"
														);
													}
												}}
												value={field.state.value}
											>
												<SelectTrigger id={field.name}>
													<SelectValue placeholder="Select" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="high">High</SelectItem>
													<SelectItem value="medium">Medium</SelectItem>
													<SelectItem value="low">Low</SelectItem>
												</SelectContent>
											</Select>
											{field.state.meta.isTouched &&
											field.state.meta.errors.length ? (
												<p className="mt-1 text-red-600 text-sm">
													{field.state.meta.errors.join(", ")}
												</p>
											) : null}
										</Field>
									);
								}}
							</form.Field>

							<form.Field name="contactId">
								{(field) => (
									<Field>
										<FieldLabel htmlFor={field.name}>
											Related Contact
										</FieldLabel>
										<Select
											name={field.name}
											onValueChange={(value) => {
												if (value) {
													field.handleChange(value);
												}
											}}
											value={field.state.value}
										>
											<SelectTrigger id={field.name}>
												<SelectValue placeholder="Select a contact (optional)" />
											</SelectTrigger>
											<SelectContent>
												{Array.isArray(contactsQuery.data) &&
													contactsQuery.data.map((contact) => (
														<SelectItem key={contact._id} value={contact._id}>
															{contact.fullName}
														</SelectItem>
													))}
											</SelectContent>
										</Select>
									</Field>
								)}
							</form.Field>

							<form.Field name="meetingId">
								{(field) => (
									<div>
										<label
											className="mb-1 block font-medium text-gray-700 text-sm"
											htmlFor="meetingId"
										>
											Related Meeting
										</label>
										<select
											className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
											id="meetingId"
											name={field.name}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											value={field.state.value}
										>
											<option value="">Select a meeting (optional)</option>
											{Array.isArray(meetingsQuery.data) &&
												meetingsQuery.data.map((meeting) => (
													<option key={meeting._id} value={meeting._id}>
														{meeting.title}
													</option>
												))}
										</select>
									</div>
								)}
							</form.Field>

							<form.Field name="description">
								{(field) => (
									<Field>
										<FieldLabel htmlFor="feedback">Description</FieldLabel>
										<Textarea
											name={field.name}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											rows={3}
											value={field.state.value}
										/>
									</Field>
								)}
							</form.Field>

							{reminderId && (
								<form.Field name="completed">
									{(field) => (
										<Field orientation="horizontal">
											<Checkbox
												checked={field.state.value}
												id="finder-pref-9k2-hard-disks-ljj"
												onBlur={field.handleBlur}
												onCheckedChange={field.handleChange}
											/>
											<FieldLabel
												className="font-normal"
												defaultChecked
												htmlFor="finder-pref-9k2-hard-disks-ljj"
											>
												Mark as completed
											</FieldLabel>
										</Field>
									)}
								</form.Field>
							)}

							<div className="flex gap-3 pt-4">
								<form.Subscribe
									selector={(state) => [state.canSubmit, state.isSubmitting]}
								>
									{([canSubmit, isSubmitting]) => {
										let buttonText: string;
										if (isSubmitting) {
											buttonText = "Saving...";
										} else if (reminderId) {
											buttonText = "Update";
										} else {
											buttonText = "Create";
										}
										return (
											<Button
												className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
												disabled={!canSubmit}
												type="submit"
											>
												{buttonText} Reminder
											</Button>
										);
									}}
								</form.Subscribe>
								<Button
									className="flex-1 rounded-md bg-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-400"
									onClick={onClose}
									type="button"
								>
									Cancel
								</Button>
							</div>
						</FieldGroup>
					</form>
				</div>
			</div>
		</div>
	);
}
