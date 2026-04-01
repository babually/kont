import { Button } from "@kont/ui/components/button";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldLabel,
	FieldTitle,
} from "@kont/ui/components/field";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@kont/ui/components/select";
import { RadioGroup, RadioGroupItem } from "@kont/ui/components/ui/radio-group";
import { useForm } from "@tanstack/react-form";
import { ChevronDown } from "lucide-react";
import { z } from "zod";
import { fonts } from "@/config/fonts";
import { useFont } from "@/context/font-provider";
import { useTheme } from "@/context/theme-provider";

const appearanceFormSchema = z.object({
	theme: z.enum(["light", "dark"]),
	font: z.enum(fonts),
});

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>;

export function AppearanceForm() {
	const { font, setFont } = useFont();
	const { theme, setTheme } = useTheme();

	// This can come from your database or API.
	const defaultValues: AppearanceFormValues = {
		theme: theme as "light" | "dark",
		font,
	};

	const form = useForm({
		defaultValues,
		validators: {
			onChange: appearanceFormSchema,
		},
		onSubmit: ({ value }) => {
			if (value.font !== font) {
				setFont(value.font);
			}
			if (value.theme !== theme) {
				setTheme(value.theme);
			}

			//   showSubmittedData(value)
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
				children={(field) => (
					<Field>
						<FieldLabel>Font</FieldLabel>
						<div className="relative w-max">
							<Select
								onOpenChange={() => field.handleBlur()}
								onValueChange={(val) => field.handleChange(val as any)}
								value={field.state.value}
							>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Theme" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{fonts.map((font) => (
											<SelectItem key={font} value={font}>
												{font}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
							<ChevronDown className="absolute inset-e-3 top-2.5 h-4 w-4 opacity-50" />
						</div>
						<FieldError>{field.state.meta.errors.join(", ")}</FieldError>
						<FieldDescription className="font-manrope">
							Set the font you want to use in the dashboard.
						</FieldDescription>
					</Field>
				)}
				name="font"
			/>

			<form.Field
				children={(field) => (
					<div>
						<FieldLabel>Theme</FieldLabel>
						<FieldDescription>
							Select the theme for the dashboard.
						</FieldDescription>
						<FieldError>{field.state.meta.errors.join(", ")}</FieldError>
						<RadioGroup
							className="grid max-w-md grid-cols-2 gap-8 pt-2"
							defaultValue={field.state.value}
							value={field.state.value}
						>
							<FieldLabel>
								<Field orientation="horizontal">
									<RadioGroupItem
										className="sr-only"
										id="light"
										value="light"
									/>
									<FieldContent>
										<FieldTitle>Light</FieldTitle>
										<FieldDescription>
											<div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
												<div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
													<div className="space-y-2 rounded-md bg-white p-2 shadow-xs">
														<div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
														<div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
													</div>
													<div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-xs">
														<div className="h-4 w-4 rounded-full bg-[#ecedef]" />
														<div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
													</div>
													<div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-xs">
														<div className="h-4 w-4 rounded-full bg-[#ecedef]" />
														<div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
													</div>
												</div>
											</div>
										</FieldDescription>
									</FieldContent>
								</Field>
							</FieldLabel>
							<FieldLabel>
								<Field orientation="horizontal">
									<RadioGroupItem className="sr-only" id="dark" value="dark" />
									<FieldContent>
										<FieldTitle>Dark</FieldTitle>
										<FieldDescription>
											<div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
												<div className="space-y-2 rounded-sm bg-slate-950 p-2">
													<div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-xs">
														<div className="h-2 w-[80px] rounded-lg bg-slate-400" />
														<div className="h-2 w-[100px] rounded-lg bg-slate-400" />
													</div>
													<div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-xs">
														<div className="h-4 w-4 rounded-full bg-slate-400" />
														<div className="h-2 w-[100px] rounded-lg bg-slate-400" />
													</div>
													<div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-xs">
														<div className="h-4 w-4 rounded-full bg-slate-400" />
														<div className="h-2 w-[100px] rounded-lg bg-slate-400" />
													</div>
												</div>
											</div>
											<span className="block w-full p-2 text-center font-normal">
												Dark
											</span>
										</FieldDescription>
									</FieldContent>
								</Field>
							</FieldLabel>
						</RadioGroup>
					</div>
				)}
				name="theme"
			/>

			<form.Subscribe
				selector={(state) => [state.canSubmit, state.isSubmitting] as const}
			>
				{([canSubmit, isSubmitting]) => (
					<Button disabled={!canSubmit} type="submit">
						{isSubmitting ? "Updating..." : "Update preferences"}
					</Button>
				)}
			</form.Subscribe>
		</form>
	);
}
