import { SettingsPageLayout } from "@/components/settings/SettingsPageLayout";
import { AccountSection } from "@/components/settings/sections/AccountSection";
import { PolicySection } from "@/components/settings/sections/PolicySection";
import { SupportSection } from "@/components/settings/sections/SupportSection";

export default function SettingsPage() {
	return (
		<SettingsPageLayout>
			<AccountSection />
			<PolicySection />
			<SupportSection />
		</SettingsPageLayout>
	);
}
