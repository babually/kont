// import { Separator } from '@kont/ui/components/separator'

import { createFileRoute } from "@tanstack/react-router";
import { ContentSection } from "@/components/dashboard/content-section";
import { ProfileForm } from "@/features/settings/profile/profile-form";
// import { Main } from '@/components/layout/main'
// import { Settings } from '@/features/settings'

export const Route = createFileRoute("/dashboard/settings/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<ContentSection
			desc="Update your profile information and manage your account settings."
			title="Profile"
		>
			<ProfileForm />
		</ContentSection>
	);
}
