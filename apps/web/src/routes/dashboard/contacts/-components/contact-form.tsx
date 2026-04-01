import { convexQuery } from "@convex-dev/react-query";
import { api } from "@kont/backend/convex/_generated/api";
import type { Id } from "@kont/backend/convex/_generated/dataModel";
import { Button } from "@kont/ui/components/button";
import { FieldGroup, FieldLabel } from "@kont/ui/components/field";
import { Input } from "@kont/ui/components/input";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { ImageUpload } from "@/functions/image-upload";

interface ContactFormProps {
	contactId?: Id<"contacts"> | null;
	onClose: () => void;
}

export function ContactForm({ contactId, onClose }: ContactFormProps) {
	const queryClient = useQueryClient();
	const contactsQuery = useSuspenseQuery(
		convexQuery(api.functions.contacts.getAllContacts, {})
	);
	const contacts = contactsQuery.data;
	const contact = contacts?.find((c) => c._id === contactId);
	const createContact = useMutation(api.functions.contacts.createContact);
	const updateContact = useMutation(api.functions.contacts.updateContact);

	const [formData, setFormData] = useState({
		image: "",
		fullName: "",
		email: "",
		phone: "",
		jobTitle: "",
		company: "",
		position: "",
		tags: "",
	});
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (contact) {
			setFormData({
				fullName: contact.fullName,
				email: contact.email || "",
				phone: contact.phone || "",
				jobTitle: contact.jobTitle,
				company: contact.company || "",
				position: contact.position || "",
				tags: contact.tags?.join(", ") || "",
				image: contact.image || "",
			});
		} else if (!contactId) {
			setFormData({
				image: "",
				fullName: "",
				email: "",
				phone: "",
				jobTitle: "",
				company: "",
				position: "",
				tags: "",
			});
		}
	}, [contact, contactId]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setIsSubmitting(true);

		const tags = formData.tags
			.split(",")
			.map((tag) => tag.trim())
			.filter((tag) => tag.length > 0);

		const contactData = {
			image: formData.image,
			fullName: formData.fullName,
			jobTitle: formData.jobTitle,
			email: formData.email || undefined,
			phone: formData.phone || undefined,
			company: formData.company || undefined,
			position: formData.position || undefined,
			tags: tags.length > 0 ? tags : undefined,
		};

		try {
			console.log("Submitting contact data:", contactData);

			if (contactId) {
				console.log("Updating contact:", contactId);
				await updateContact({ id: contactId, ...contactData });
			} else {
				console.log("Creating new contact");
				const result = await createContact(contactData);
				console.log("Create result:", result);
			}

			console.log(
				"Contact saved successfully, invalidating and refetching cache"
			);

			// Invalidate and refetch contacts query
			const queryKey = convexQuery(
				api.functions.contacts.getAllContacts,
				{}
			).queryKey;
			await queryClient.invalidateQueries({ queryKey });
			await queryClient.refetchQueries({ queryKey });

			console.log("Cache refetched, closing form");

			setFormData({
				image: "",
				fullName: "",
				email: "",
				phone: "",
				jobTitle: "",
				company: "",
				position: "",
				tags: "",
			});
			onClose();
		} catch (err) {
			console.error("Submit error details:", err);
			const errorMessage =
				err instanceof Error ? err.message : JSON.stringify(err);
			console.error("Formatted error:", errorMessage);
			setError(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
			<div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white shadow-xl">
				<div className="p-6">
					<div className="mb-6 flex items-center justify-between">
						<h2 className="font-bold text-gray-900 text-xl">
							{contactId ? "Edit Contact" : "Add Contact"}
						</h2>
						<button
							className="text-gray-400 hover:text-gray-600"
							onClick={onClose}
							type="button"
						>
							✕
						</button>
					</div>

					<form className="space-y-4" onSubmit={handleSubmit}>
						{error && (
							<div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-red-700 text-sm">
								{error}
							</div>
						)}
						<div className="grid gap-4">
							<div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full shadow-md">
								<ImageUpload
									onRemove={() => {
										setFormData((prev) => ({ ...prev, image: "" }));
									}}
									onUploadComplete={(key) => {
										setFormData((prev) => ({ ...prev, image: key }));
									}}
									value={formData.image}
								/>
							</div>
							<FieldGroup>
								<FieldGroup>
									<FieldLabel htmlFor="fullName">Full Name</FieldLabel>
									<Input
										autoComplete="off"
										id="fullName"
										name="fullName"
										onChange={handleChange}
										placeholder="John Doe"
										required
										value={formData.fullName}
									/>
								</FieldGroup>

								<FieldGroup>
									<FieldLabel htmlFor="email">Email Address</FieldLabel>
									<Input
										autoComplete="off"
										id="email"
										name="email"
										onChange={handleChange}
										placeholder="contact@email.com"
										type="email"
										value={formData.email}
									/>
								</FieldGroup>

								<FieldGroup>
									<FieldLabel htmlFor="phone">Phone Number</FieldLabel>
									<Input
										autoComplete="off"
										id="phone"
										name="phone"
										onChange={handleChange}
										placeholder="+(xxx) xxx-xxxx"
										value={formData.phone}
									/>
								</FieldGroup>

								<FieldGroup>
									<FieldLabel htmlFor="company">Company Name</FieldLabel>
									<Input
										autoComplete="off"
										id="company"
										name="company"
										onChange={handleChange}
										placeholder="Acme Inc."
										value={formData.company}
									/>
								</FieldGroup>

								<FieldGroup>
									<FieldLabel htmlFor="jobTitle">Job Title</FieldLabel>
									<Input
										autoComplete="off"
										id="jobTitle"
										name="jobTitle"
										onChange={handleChange}
										placeholder="Software Engineer"
										required
										value={formData.jobTitle}
									/>
								</FieldGroup>

								<FieldGroup>
									<FieldLabel htmlFor="position">Position</FieldLabel>
									<Input
										autoComplete="off"
										id="position"
										name="position"
										onChange={handleChange}
										placeholder="CEO, Manager, Designer"
										value={formData.position}
									/>
								</FieldGroup>

								<FieldGroup>
									<FieldLabel htmlFor="tags">Tags (comma-separated)</FieldLabel>
									<Input
										autoComplete="off"
										id="tags"
										name="tags"
										onChange={handleChange}
										placeholder="client, important, follow-up"
										value={formData.tags}
									/>
								</FieldGroup>

								<div className="flex gap-3 pt-4">
									<Button
										className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
										disabled={isSubmitting}
										type="submit"
									>
										{isSubmitting
											? "Saving..."
											: `${contactId ? "Update" : "Create"} Contact`}
									</Button>
									<Button
										className="flex-1 rounded-md bg-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-400"
										onClick={onClose}
										type="button"
									>
										Cancel
									</Button>
								</div>
							</FieldGroup>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
