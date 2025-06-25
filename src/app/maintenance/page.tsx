import { createServerSupabase } from "@/lib/supabase/server";
import { getAllMaintenanceSummary } from "@/lib/server/getAllMaintenanceSummary";
import MaintenanceClient from "./MaintenanceClient";

export default async function MaintenancePage() {
	const supabase = await createServerSupabase();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		// middlewareで未認証ユーザーは排除される想定だが、安全のために明記
		throw new Error("認証済みのユーザーが必要です");
	}

	const summary = await getAllMaintenanceSummary(user.id);

	return <MaintenanceClient summary={summary} />;
}
