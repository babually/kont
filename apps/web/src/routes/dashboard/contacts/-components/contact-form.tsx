import { convexQuery } from "@convex-dev/react-query";
import { api } from "@kont/backend/convex/_generated/api";
import type { Id } from "@kont/backend/convex/_generated/dataModel";
import { Button } from "@kont/ui/components/button";
import { DialogHeader, DialogTitle } from "@kont/ui/components/dialog";
import { FieldGroup, FieldLabel } from "@kont/ui/components/field";
import { Input } from "@kont/ui/components/input";
import { Label } from "@kont/ui/components/label";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useMutation } from "convex/react";
import { Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

	const imageUploadRef =
		useRef<import("@/functions/image-upload").ImageUploadHandle>(null);

	return (
		<div className="flex flex-col gap-6">
			<DialogHeader>
				<DialogTitle>{contactId ? "Edit Contact" : "Add Contact"}</DialogTitle>
			</DialogHeader>

			<form className="space-y-4" onSubmit={handleSubmit}>
				{error && (
					<div className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-destructive text-sm">
						{error}
					</div>
				)}
				<div className="flex items-center gap-6">
					<div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-muted shadow-sm">
						{formData.image ? (
							<ImageUpload
								className="h-full w-full"
								onRemove={() => {
									setFormData((prev) => ({ ...prev, image: "" }));
								}}
								onUploadComplete={(key) => {
									setFormData((prev) => ({ ...prev, image: key }));
								}}
								ref={imageUploadRef}
								value={formData.image}
							/>
						) : (
							<div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
								<Camera className="h-8 w-8" />
								<ImageUpload
									className="hidden"
									onRemove={() => {
										setFormData((prev) => ({ ...prev, image: "" }));
									}}
									onUploadComplete={(key) => {
										setFormData((prev) => ({ ...prev, image: key }));
									}}
									ref={imageUploadRef}
								/>
							</div>
						)}
					</div>
					<div className="space-y-2">
						<Label htmlFor="picture">Profile Picture</Label>
						<div>
							<Button
								className="w-fit"
								onClick={() => imageUploadRef.current?.triggerUpload()}
								size="sm"
								type="button"
								variant="outline"
							>
								<Camera className="mr-2 h-4 w-4" />
								{formData.image ? "Change Picture" : "Upload Picture"}
							</Button>
						</div>
					</div>
				</div>
				<div className="">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

						<FieldGroup className="md:col-span-2">
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

						<div className="flex gap-3 pt-4 md:col-span-2">
							<Button
								className="flex-1"
								disabled={isSubmitting}
								type="submit"
								variant="default"
							>
								{isSubmitting
									? "Saving..."
									: `${contactId ? "Update" : "Create"} Contact`}
							</Button>
							<Button
								className="flex-1"
								onClick={onClose}
								type="button"
								variant="outline"
							>
								Cancel
							</Button>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
}
