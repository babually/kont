import { Button } from "@kont/ui/components/button";
import { Calendar } from "@kont/ui/components/calendar";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@kont/ui/components/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@kont/ui/components/input-group";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@kont/ui/components/select";
import { Input } from "@kont/ui/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@kont/ui/components/ui/popover";
import { useForm } from "@tanstack/react-form";
import { CalendarIcon } from "lucide-react";
import React from "react";
import { z } from "zod";

const languages = [
	{ label: "English", value: "en" },
	{ label: "French", value: "fr" },
	{ label: "German", value: "de" },
	{ label: "Spanish", value: "es" },
	{ label: "Portuguese", value: "pt" },
	{ label: "Russian", value: "ru" },
	{ label: "Japanese", value: "ja" },
	{ label: "Korean", value: "ko" },
	{ label: "Chinese", value: "zh" },
] as const;

const accountFormSchema = z.object({
	name: z
		.string()
		.min(1, "Please enter your name.")
		.min(2, "Name must be at least 2 characters.")
		.max(30, "Name must not be longer than 30 characters."),
	dob: z.date("Please select your date of birth."),
	language: z.string("Please select a language."),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

function formatDate(date: Date | undefined) {
	if (!date) {
		return "";
	}

	return date.toLocaleDateString("en-US", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
}

function isValidDate(date: Date | undefined) {
	if (!date) {
		return false;
	}
	return !Number.isNaN(date.getTime());
}

export function AccountForm() {
	const [open, setOpen] = React.useState(false);
	const [date, setDate] = React.useState<Date | undefined>(
		new Date("2025-06-01")
	);
	const [month, setMonth] = React.useState<Date | undefined>(date);
	const [value, setValue] = React.useState(date ? formatDate(date) : "");

	const form = useForm({
		defaultValues: {
			name: "",
			dob: undefined as Date | undefined,
			language: "",
		} as AccountFormValues,
		onSubmit: ({ value }) => {
			//   showSubmittedData(value)
			console.log(value);
		},
		validators: {
			onSubmit: accountFormSchema,
		},
	});

	return (
		<form
			className="space-y-8"
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<form.Field
				name="name"
				validators={{
					onChange: accountFormSchema.shape.name,
				}}
			>
				{(field) => (
					<Field>
						<FieldLabel>Name</FieldLabel>
						<Input
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							placeholder="Your name"
							value={field.state.value}
						/>
						<FieldDescription>
							This is the name that will be displayed on your profile and in
							emails.
						</FieldDescription>
						{field.state.meta.errors.map((error) => (
							<FieldError key={error?.message}>{error?.message}</FieldError>
						))}
					</Field>
				)}
			</form.Field>

			<form.Field
				name="dob"
				validators={{
					onChange: accountFormSchema.shape.dob,
				}}
			>
				{() => (
					<Field>
						<FieldLabel htmlFor="date-required">Date of Birth</FieldLabel>
						<InputGroup>
							<InputGroupInput
								id="date-required"
								onChange={(e) => {
									const date = new Date(e.target.value);
									setValue(e.target.value);
									if (isValidDate(date)) {
										setDate(date);
										setMonth(date);
									}
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
									<PopoverTrigger asChild>
										<InputGroupButton
											aria-label="Select date"
											id="date-picker"
											size="icon-xs"
											variant="ghost"
										>
											<CalendarIcon />
											<span className="sr-only">Select date</span>
										</InputGroupButton>
									</PopoverTrigger>
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
											onSelect={(date) => {
												setDate(date || undefined);
												setValue(date ? formatDate(date) : "");
												setOpen(false);
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

			<form.Field
				name="language"
				validators={{
					onChange: accountFormSchema.shape.language,
				}}
			>
				{(field) => (
					<Field>
						<FieldLabel>Language</FieldLabel>
						<Select items={languages}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Theme" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{languages.map((item) => (
										<SelectItem key={item.value} value={item.value}>
											{item.label}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
						<FieldDescription>
							This is the language that will be used in the dashboard.
						</FieldDescription>
						{field.state.meta.errors.map((error) => (
							<FieldError key={error?.message}>{error?.message}</FieldError>
						))}
					</Field>
				)}
			</form.Field>

			<form.Subscribe
				selector={(state) => [state.canSubmit, state.isSubmitting]}
			>
				{([canSubmit, isSubmitting]) => (
					<Button disabled={!canSubmit} type="submit">
						{isSubmitting ? "Submitting..." : "Update account"}
					</Button>
				)}
			</form.Subscribe>
		</form>
	);
}
