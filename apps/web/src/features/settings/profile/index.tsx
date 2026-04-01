import { ContentSection } from "@/components/dashboard/content-section";
import { ProfileForm } from "./profile-form";

export function SettingsProfile() {
	return (
		<ContentSection
			desc="This is how others will see you on the site."
			title="Profile"
		>
			<ProfileForm />
		</ContentSection>
	);
}
