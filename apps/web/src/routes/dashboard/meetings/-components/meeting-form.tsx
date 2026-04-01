import { convexQuery } from "@convex-dev/react-query";
import { api } from "@kont/backend/convex/_generated/api";
import type { Id } from "@kont/backend/convex/_generated/dataModel";
import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMutation } from "convex/react";
import type { GenericId } from "convex/values";
import { useEffect } from "react";

interface MeetingFormProps {
	meetingId?: Id<"meetings"> | null;
	onClose: () => void;
}

export function MeetingForm({ meetingId, onClose }: MeetingFormProps) {
	const contactsQuery = useSuspenseQuery(
		convexQuery(api.functions.contacts.getAllContacts, {})
	);
	const contacts = contactsQuery.data;

	const meetingsQuery = useSuspenseQuery(
		convexQuery(api.functions.meetings.getAllMeetings, {})
	);

	const meetings = meetingsQuery.data;
	const meeting = meetings?.find((c) => c._id === meetingId);
	const createMeeting = useMutation(api.functions.meetings.createMeeting);
	const updateMeeting = useMutation(api.functions.meetings.updateMeeting);

	const form = useForm({
		defaultValues: {
			contactId: "",
			title: "",
			description: "",
			startDate: "",
			startTime: "",
			endDate: "",
			endTime: "",
			location: "",
			status: "scheduled" as "scheduled" | "completed" | "cancelled",
		},
		onSubmit: async ({ value }) => {
			const startDateTime = new Date(
				`${value.startDate}T${value.startTime}`
			).getTime();
			const endDateTime = new Date(
				`${value.endDate}T${value.endTime}`
			).getTime();

			const meetingData = {
				contactId: value.contactId
					? (value.contactId as Id<"contacts">)
					: undefined,
				title: value.title,
				description: value.description || undefined,
				startTime: startDateTime,
				endTime: endDateTime,
				location: value.location || undefined,
				status: value.status,
			};

			try {
				if (meetingId) {
					await updateMeeting({ id: meetingId, ...meetingData });
				} else {
					await createMeeting(meetingData);
				}
				onClose();
			} catch (error) {
				console.error("Error saving meeting:", error);
			}
		},
	});

	// Update form values when meeting data is loaded
	useEffect(() => {
		if (meeting) {
			const startDate = new Date(meeting.startTime);
			const endDate = new Date(meeting.endTime);

			form.setFieldValue("contactId", meeting.contactId || "");
			form.setFieldValue("title", meeting.title);
			form.setFieldValue("description", meeting.description || "");
			form.setFieldValue("startDate", startDate.toISOString().split("T")[0]);
			form.setFieldValue("startTime", startDate.toTimeString().slice(0, 5));
			form.setFieldValue("endDate", endDate.toISOString().split("T")[0]);
			form.setFieldValue("endTime", endDate.toTimeString().slice(0, 5));
			form.setFieldValue("location", meeting.location || "");
			form.setFieldValue("status", meeting.status);
		}
	}, [meeting, form]);

	const getSubmitButtonText = (isSubmitting: boolean) => {
		if (isSubmitting) {
			return "Saving...";
		}
		return meetingId ? "Update Meeting" : "Schedule Meeting";
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
			<div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white shadow-xl">
				<div className="p-6">
					<div className="mb-6 flex items-center justify-between">
						<h2 className="font-bold text-gray-900 text-xl">
							{meetingId ? "Edit Meeting" : "Schedule Meeting"}
						</h2>
						<button
							className="text-gray-400 hover:text-gray-600"
							onClick={onClose}
							type="button"
						>
							✕
						</button>
					</div>

					<form
						className="space-y-4"
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
					>
						{/* Title Field */}
						<form.Field
							name="title"
							validators={{
								onChange: ({ value }) => {
									if (!value) {
										return { message: "Title is required" };
									}
									return undefined;
								},
							}}
						>
							{(field) => (
								<div>
									<label
										className="mb-1 block font-medium text-gray-700 text-sm"
										htmlFor={field.name}
									>
										Title *
									</label>
									<input
										className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										required
										type="text"
										value={field.state.value}
									/>
									{field.state.meta.isTouched &&
									field.state.meta.errors.length ? (
										<p className="mt-1 text-red-600 text-sm">
											{field.state.meta.errors.join(", ")}
										</p>
									) : null}
								</div>
							)}
						</form.Field>

						{/* Contact Field */}
						<form.Field name="contactId">
							{(field) => (
								<div>
									<label
										className="mb-1 block font-medium text-gray-700 text-sm"
										htmlFor={field.name}
									>
										Contact
									</label>
									<select
										className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										value={field.state.value}
									>
										<option value="">Select a contact (optional)</option>
										{contacts.map(
											(contact: {
												_id: GenericId<"contacts">;
												fullName: string;
											}) => (
												<option key={contact._id} value={contact._id}>
													{contact.fullName}
												</option>
											)
										)}
									</select>
								</div>
							)}
						</form.Field>

						{/* Start Date & Time */}
						<div className="grid grid-cols-2 gap-4">
							<form.Field
								name="startDate"
								validators={{
									onChange: ({ value }) => {
										if (!value) {
											return { message: "Start date is required" };
										}
										return undefined;
									},
								}}
							>
								{(field) => (
									<div>
										<label
											className="mb-1 block font-medium text-gray-700 text-sm"
											htmlFor={field.name}
										>
											Start Date *
										</label>
										<input
											className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
											id={field.name}
											name={field.name}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											required
											type="date"
											value={field.state.value}
										/>
										{field.state.meta.isTouched &&
										field.state.meta.errors.length ? (
											<p className="mt-1 text-red-600 text-sm">
												{field.state.meta.errors.join(", ")}
											</p>
										) : null}
									</div>
								)}
							</form.Field>

							<form.Field
								name="startTime"
								validators={{
									onChange: ({ value }) => {
										if (!value) {
											return { message: "Start time is required" };
										}
										return undefined;
									},
								}}
							>
								{(field) => (
									<div>
										<label
											className="mb-1 block font-medium text-gray-700 text-sm"
											htmlFor={field.name}
										>
											Start Time *
										</label>
										<input
											className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
											id={field.name}
											name={field.name}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											required
											type="time"
											value={field.state.value}
										/>
										{field.state.meta.isTouched &&
										field.state.meta.errors.length ? (
											<p className="mt-1 text-red-600 text-sm">
												{field.state.meta.errors.join(", ")}
											</p>
										) : null}
									</div>
								)}
							</form.Field>
						</div>

						{/* End Date & Time */}
						<div className="grid grid-cols-2 gap-4">
							<form.Field
								name="endDate"
								validators={{
									onChange: ({ value }) => {
										if (!value) {
											return { message: "End date is required" };
										}
										return undefined;
									},
								}}
							>
								{(field) => (
									<div>
										<label
											className="mb-1 block font-medium text-gray-700 text-sm"
											htmlFor={field.name}
										>
											End Date *
										</label>
										<input
											className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
											id={field.name}
											name={field.name}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											required
											type="date"
											value={field.state.value}
										/>
										{field.state.meta.isTouched &&
										field.state.meta.errors.length ? (
											<p className="mt-1 text-red-600 text-sm">
												{field.state.meta.errors.join(", ")}
											</p>
										) : null}
									</div>
								)}
							</form.Field>

							<form.Field
								name="endTime"
								validators={{
									onChange: ({ value }) => {
										if (!value) {
											return { message: "End time is required" };
										}
										return undefined;
									},
								}}
							>
								{(field) => (
									<div>
										<label
											className="mb-1 block font-medium text-gray-700 text-sm"
											htmlFor={field.name}
										>
											End Time *
										</label>
										<input
											className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
											id={field.name}
											name={field.name}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											required
											type="time"
											value={field.state.value}
										/>
										{field.state.meta.isTouched &&
										field.state.meta.errors.length ? (
											<p className="mt-1 text-red-600 text-sm">
												{field.state.meta.errors.join(", ")}
											</p>
										) : null}
									</div>
								)}
							</form.Field>
						</div>

						{/* Location Field */}
						<form.Field name="location">
							{(field) => (
								<div>
									<label
										className="mb-1 block font-medium text-gray-700 text-sm"
										htmlFor={field.name}
									>
										Location
									</label>
									<input
										className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="Office, Zoom, etc."
										type="text"
										value={field.state.value}
									/>
								</div>
							)}
						</form.Field>

						{/* Status Field */}
						<form.Field name="status">
							{(field) => (
								<div>
									<label
										className="mb-1 block font-medium text-gray-700 text-sm"
										htmlFor={field.name}
									>
										Status
									</label>
									<select
										className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) =>
											field.handleChange(
												e.target.value as
													| "scheduled"
													| "completed"
													| "cancelled"
											)
										}
										value={field.state.value}
									>
										<option value="scheduled">Scheduled</option>
										<option value="completed">Completed</option>
										<option value="cancelled">Cancelled</option>
									</select>
								</div>
							)}
						</form.Field>

						{/* Description Field */}
						<form.Field name="description">
							{(field) => (
								<div>
									<label
										className="mb-1 block font-medium text-gray-700 text-sm"
										htmlFor={field.name}
									>
										Description
									</label>
									<textarea
										className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										rows={3}
										value={field.state.value}
									/>
								</div>
							)}
						</form.Field>

						{/* Form Actions */}
						<div className="flex gap-3 pt-4">
							<form.Subscribe
								selector={(state) => [state.canSubmit, state.isSubmitting]}
							>
								{([canSubmit, isSubmitting]) => (
									<button
										className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
										disabled={!canSubmit}
										type="submit"
									>
										{getSubmitButtonText(isSubmitting)}
									</button>
								)}
							</form.Subscribe>
							<button
								className="flex-1 rounded-md bg-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-400"
								onClick={onClose}
								type="button"
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
