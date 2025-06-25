import { redirect } from "next/navigation";
import { getFurnitureById } from "@/lib/server/furniture";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import MaintenanceClient from "./MaintenanceClient";

export default async function MaintenancePage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	const supabase = await createSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		// middlewareで未認証ユーザーは排除される想定だが、安全のために明記
		throw new Error("認証済みのユーザーが必要です");
	}

	const furniture = await getFurnitureById(id, user.id);
	if (!furniture) return redirect("/furniture");

	return <MaintenanceClient furniture={furniture} />;
}
