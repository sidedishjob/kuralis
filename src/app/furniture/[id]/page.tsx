import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { getFurnitureById } from "@/lib/server/furniture";
import { getFurnitureMeta } from "@/lib/server/furnitureMeta";
import { getMaintenanceSummary } from "@/lib/server/maintenance";
import FurnitureDetailClient from "./FurnitureDetailClient";

export default async function FurnitureDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	const supabase = await createServerSupabase();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		// middlewareで未認証ユーザーは排除される想定だが、安全のために明記
		throw new Error("認証済みのユーザーが必要です");
	}

	const furniture = await getFurnitureById(id, user.id);
	if (!furniture) return redirect("/furniture");

	const summary = await getMaintenanceSummary(id);
	const meta = await getFurnitureMeta(user.id);

	return (
		<FurnitureDetailClient
			initialFurniture={furniture}
			initialLocations={meta.locations}
			initialMaintenanceSummary={summary}
		/>
	);
}
