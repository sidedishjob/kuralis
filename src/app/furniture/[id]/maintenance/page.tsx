import { redirect } from "next/navigation";
import MaintenanceClient from "./MaintenanceClient";
import { getFurnitureById } from "@/lib/server/furniture";
import { getUserFromCookie } from "@/lib/supabase/server";

export default async function MaintenancePage({ params }: { params: { id: string } }) {
	const user = await getUserFromCookie();
	const { id } = await params;
	if (!user) return redirect("/auth/login");

	const furniture = await getFurnitureById(id, user.id);

	if (!furniture) return redirect("/furniture");

	return <MaintenanceClient furniture={furniture} />;
}
