import { redirect } from "next/navigation";
import { getAllMaintenanceSummary } from "@/lib/server/getAllMaintenanceSummary";
import { getUserFromCookie } from "@/lib/supabase/server";
import MaintenanceClient from "./MaintenanceClient";

export default async function MaintenancePage() {
	const user = await getUserFromCookie();
	if (!user) return redirect("/auth/login");
	const summary = await getAllMaintenanceSummary(user.id);
	console.log(summary);

	return <MaintenanceClient summary={summary} />;
}
