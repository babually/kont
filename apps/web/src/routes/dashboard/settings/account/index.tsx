import { createFileRoute } from "@tanstack/react-router";
import { ContentSection } from "@/components/dashboard/content-section";
import { AccountForm } from "@/features/settings/account/account-form";

export const Route = createFileRoute("/dashboard/settings/account/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<ContentSection
			desc="Manage your account settings and set e-mail preferences."
			title="Account"
		>
			<AccountForm />
		</ContentSection>
	);
}
