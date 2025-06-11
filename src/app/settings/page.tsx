import { redirect } from "next/navigation";
import { getUserFromCookie } from "@/lib/supabase/server";
import { SettingsPageLayout } from "@/components/settings/SettingsPageLayout";
import { AccountSection } from "@/components/settings/sections/AccountSection";
import { PolicySection } from "@/components/settings/sections/PolicySection";
import { SupportSection } from "@/components/settings/sections/SupportSection";

export default async function SettingsPage() {
	const user = await getUserFromCookie();
	if (!user) return redirect("/auth/login");

	return (
		<SettingsPageLayout>
			<AccountSection />
			<PolicySection />
			<SupportSection />
		</SettingsPageLayout>
	);
}
