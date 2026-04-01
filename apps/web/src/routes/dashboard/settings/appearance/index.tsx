import { createFileRoute } from "@tanstack/react-router";
import { ContentSection } from "@/components/dashboard/content-section";
import { AppearanceForm } from "@/features/settings/appearance/appearance-form";

export const Route = createFileRoute("/dashboard/settings/appearance/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<ContentSection
			desc="Customize the appearance of the app. Automatically switch between day
          and night themes."
			title="Appearance"
		>
			<AppearanceForm />
		</ContentSection>
	);
}
