import { getAllMaintenanceSummary } from "@/lib/server/getAllMaintenanceSummary";
import MaintenanceClient from "./MaintenanceClient";
import { getUserFromCookie } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function MaintenancePage() {
	const user = await getUserFromCookie();
	if (!user) return notFound();
	const summary = await getAllMaintenanceSummary(user.id);
	console.log(summary);

	return <MaintenanceClient summary={summary} />;
}
