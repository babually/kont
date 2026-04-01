import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@kont/ui/components/avatar";
import { Button } from "@kont/ui/components/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@kont/ui/components/field";
import { Input } from "@kont/ui/components/input";
import { Label } from "@kont/ui/components/label";
import { Textarea } from "@kont/ui/components/textarea";
import { useForm } from "@tanstack/react-form";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod/v4";

const profileFormSchema = z.object({
	username: z
		.string()
		.min(2, {
			message: "Username must be at least 2 characters.",
		})
		.max(30, {
			message: "Username must not be longer than 30 characters.",
		}),
	name: z
		.string()
		.min(2, {
			message: "Name must be at least 2 characters.",
		})
		.max(100, {
			message: "Name must not be longer than 100 characters.",
		}),
	email: z.string().email({
		message: "Please enter a valid email address.",
	}),
	bio: z.string().max(500, {
		message: "Bio must not be longer than 500 characters.",
	}),
	urls: z
		.array(
			z.object({
				value: z.string().url({ message: "Please enter a valid URL." }),
			})
		)
		.optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database
const defaultValues: Partial<ProfileFormValues> = {
	bio: "I own a computer.",
	urls: [
		{ value: "https://shadcn.com" },
		{ value: "http://twitter.com/shadcn" },
	],
};

export function ProfileForm() {
	const form = useForm({
		defaultValues: defaultValues as ProfileFormValues,
		validators: {
			onChange: profileFormSchema,
		},
		onSubmit: ({ value }) => {
			console.log("Profile data:", value);
			toast.success("Profile updated successfully!", {
				description: "Your profile has been updated.",
			});
		},
	});

	return (
		<div className="space-y-6">
			<form
				className="space-y-8"
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				<div className="flex items-center gap-6">
					<Avatar className="h-20 w-20">
						<AvatarImage alt="@username" src="/avatars/01.png" />
						<AvatarFallback>JD</AvatarFallback>
					</Avatar>
					<div className="space-y-2">
						<Label htmlFor="picture">Profile Picture</Label>
						<Button className="w-fit" size="sm" variant="outline">
							<Camera className="mr-2 h-4 w-4" />
							Change Picture
						</Button>
					</div>
				</div>

				<div className="grid gap-6 md:grid-cols-2">
					<form.Field name="username">
						{(field) => (
							<Field>
								<FieldLabel>Username</FieldLabel>
								<Input
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="username"
									value={field.state.value}
								/>
								<FieldDescription>
									This is your public display name. It can be your real name or
									a pseudonym.
								</FieldDescription>
								<FieldError>
									{field.state.meta.errors.length > 0 && (
										<span>{field.state.meta.errors.join(", ")}</span>
									)}
								</FieldError>
							</Field>
						)}
					</form.Field>

					<form.Field name="name">
						{(field) => (
							<Field>
								<FieldLabel>Name</FieldLabel>
								<Input
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="John Doe"
									value={field.state.value}
								/>
								<FieldDescription>
									This is your public display name. It can be your real name or
									a pseudonym.
								</FieldDescription>
								<FieldError>
									{field.state.meta.errors.length > 0 && (
										<span>{field.state.meta.errors.join(", ")}</span>
									)}
								</FieldError>
							</Field>
						)}
					</form.Field>
				</div>

				<form.Field name="email">
					{(field) => (
						<Field>
							<FieldLabel>Email</FieldLabel>
							<Input
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="john.doe@example.com"
								value={field.state.value}
							/>
							<FieldDescription>
								You can manage verified email addresses in your{" "}
								<a
									className="underline underline-offset-4"
									href="/dashboard/settings/email"
								>
									email settings
								</a>
								.
							</FieldDescription>
							<FieldError>
								{field.state.meta.errors.length > 0 && (
									<span>{field.state.meta.errors.join(", ")}</span>
								)}
							</FieldError>
						</Field>
					)}
				</form.Field>

				<form.Field name="bio">
					{(field) => (
						<Field>
							<FieldLabel>Bio</FieldLabel>
							<Textarea
								className="resize-none"
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="Tell us a little bit about yourself"
								value={field.state.value}
							/>
							<FieldDescription>
								You can <span>@mention</span> other users and organizations to
								link to them.
							</FieldDescription>
							<FieldError>
								{field.state.meta.errors.length > 0 && (
									<span>{field.state.meta.errors.join(", ")}</span>
								)}
							</FieldError>
						</Field>
					)}
				</form.Field>

				<form.Subscribe
					selector={(state) => [state.canSubmit, state.isSubmitting]}
				>
					{([canSubmit, isSubmitting]) => (
						<Button disabled={!canSubmit} type="submit">
							{isSubmitting ? "Updating..." : "Update profile"}
						</Button>
					)}
				</form.Subscribe>
			</form>
		</div>
	);
}
