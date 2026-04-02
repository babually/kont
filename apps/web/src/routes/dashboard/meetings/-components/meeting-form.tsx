import { convexQuery } from "@convex-dev/react-query";
import { api } from "@kont/backend/convex/_generated/api";
import type { Id } from "@kont/backend/convex/_generated/dataModel";
import { Button } from "@kont/ui/components/button";
import { DialogHeader, DialogTitle } from "@kont/ui/components/dialog";
import { Field, FieldGroup, FieldLabel } from "@kont/ui/components/field";
import { Input } from "@kont/ui/components/input";
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
		<div className="flex flex-col gap-6">
			<DialogHeader>
				<DialogTitle>
					{meetingId ? "Edit Meeting" : "Schedule Meeting"}
				</DialogTitle>
			</DialogHeader>

			<form
				className="space-y-4"
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				<FieldGroup>
					{/* Title Field */}
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
						{(field) => (
							<Field>
								<FieldLabel htmlFor={field.name}>Title *</FieldLabel>
								<Input
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
									<p className="mt-1 text-destructive text-sm">
										{field.state.meta.errors.join(", ")}
									</p>
								) : null}
							</Field>
						)}
					</form.Field>

					{/* Contact Field */}
					<form.Field name="contactId">
						{(field) => (
							<Field>
								<FieldLabel htmlFor={field.name}>Contact</FieldLabel>
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
										{contacts.map(
											(contact: {
												_id: GenericId<"contacts">;
												fullName: string;
											}) => (
												<SelectItem key={contact._id} value={contact._id}>
													{contact.fullName}
												</SelectItem>
											)
										)}
									</SelectContent>
								</Select>
							</Field>
						)}
					</form.Field>

					{/* Start Date & Time */}
					<div className="grid grid-cols-2 gap-4">
						<form.Field
							name="startDate"
							validators={{
								onChange: ({ value }) => {
									if (!value) {
										return "Start date is required";
									}
									return undefined;
								},
							}}
						>
							{(field) => (
								<Field>
									<FieldLabel htmlFor={field.name}>Start Date *</FieldLabel>
									<Input
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
										<p className="mt-1 text-destructive text-sm">
											{field.state.meta.errors.join(", ")}
										</p>
									) : null}
								</Field>
							)}
						</form.Field>

						<form.Field
							name="startTime"
							validators={{
								onChange: ({ value }) => {
									if (!value) {
										return "Start time is required";
									}
									return undefined;
								},
							}}
						>
							{(field) => (
								<Field>
									<FieldLabel htmlFor={field.name}>Start Time *</FieldLabel>
									<Input
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
										<p className="mt-1 text-destructive text-sm">
											{field.state.meta.errors.join(", ")}
										</p>
									) : null}
								</Field>
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
										return "End date is required";
									}
									return undefined;
								},
							}}
						>
							{(field) => (
								<Field>
									<FieldLabel htmlFor={field.name}>End Date *</FieldLabel>
									<Input
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
										<p className="mt-1 text-destructive text-sm">
											{field.state.meta.errors.join(", ")}
										</p>
									) : null}
								</Field>
							)}
						</form.Field>

						<form.Field
							name="endTime"
							validators={{
								onChange: ({ value }) => {
									if (!value) {
										return "End time is required";
									}
									return undefined;
								},
							}}
						>
							{(field) => (
								<Field>
									<FieldLabel htmlFor={field.name}>End Time *</FieldLabel>
									<Input
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
										<p className="mt-1 text-destructive text-sm">
											{field.state.meta.errors.join(", ")}
										</p>
									) : null}
								</Field>
							)}
						</form.Field>
					</div>

					{/* Location Field */}
					<form.Field name="location">
						{(field) => (
							<Field>
								<FieldLabel htmlFor={field.name}>Location</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Office, Zoom, etc."
									type="text"
									value={field.state.value}
								/>
							</Field>
						)}
					</form.Field>

					{/* Status Field */}
					<form.Field name="status">
						{(field) => (
							<Field>
								<FieldLabel htmlFor={field.name}>Status</FieldLabel>
								<Select
									name={field.name}
									onValueChange={(value) => {
										if (value) {
											field.handleChange(
												value as "scheduled" | "completed" | "cancelled"
											);
										}
									}}
									value={field.state.value}
								>
									<SelectTrigger id={field.name}>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="scheduled">Scheduled</SelectItem>
										<SelectItem value="completed">Completed</SelectItem>
										<SelectItem value="cancelled">Cancelled</SelectItem>
									</SelectContent>
								</Select>
							</Field>
						)}
					</form.Field>

					{/* Description Field */}
					<form.Field name="description">
						{(field) => (
							<Field>
								<FieldLabel htmlFor={field.name}>Description</FieldLabel>
								<Textarea
									id={field.name}
									name={field.name}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									rows={3}
									value={field.state.value}
								/>
							</Field>
						)}
					</form.Field>

					{/* Form Actions */}
					<div className="flex gap-3 pt-4">
						<form.Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}
						>
							{([canSubmit, isSubmitting]) => (
								<Button
									className="flex-1"
									disabled={!canSubmit}
									type="submit"
									variant="default"
								>
									{getSubmitButtonText(isSubmitting)}
								</Button>
							)}
						</form.Subscribe>
						<Button
							className="flex-1"
							onClick={onClose}
							type="button"
							variant="outline"
						>
							Cancel
						</Button>
					</div>
				</FieldGroup>
			</form>
		</div>
	);
}
