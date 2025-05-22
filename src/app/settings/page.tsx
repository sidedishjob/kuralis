import { SettingsPageLayout } from "@/components/settings/SettingsPageLayout";
import { AccountSection } from "@/components/settings/sections/AccountSection";
import { PolicySection } from "@/components/settings/sections/PolicySection";

export default function SettingsPage() {
	return (
		<SettingsPageLayout>
			<AccountSection />
			<PolicySection />
		</SettingsPageLayout>
	);
}
