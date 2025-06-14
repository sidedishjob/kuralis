import { redirect } from "next/navigation";
import FurnitureDetailClient from "./FurnitureDetailClient";
import { getFurnitureById } from "@/lib/server/furniture";
import { getUserFromCookie } from "@/lib/supabase/server";
import { getFurnitureMeta } from "@/lib/server/furnitureMeta";
import { getMaintenanceSummary } from "@/lib/server/maintenance";

export default async function FurnitureDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const user = await getUserFromCookie();
	if (!user) return redirect("/auth/login");

	const { id } = await params;
	const furniture = await getFurnitureById(id, user.id);

	if (!furniture) return redirect("/furniture");

	const summary = await getMaintenanceSummary(id);

	const meta = await getFurnitureMeta();

	return (
		<FurnitureDetailClient
			initialFurniture={furniture}
			initialLocations={meta.locations}
			initialMaintenanceSummary={summary}
		/>
	);
}
