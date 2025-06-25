import { getFurniture } from "@/lib/server/furniture";
import FurnitureListClient from "./FurnitureListClient";
import { createServerSupabase } from "@/lib/supabase/server";
import { getFurnitureMeta } from "@/lib/server/furnitureMeta";

export default async function FurnitureListPage() {
	const supabase = await createServerSupabase();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		// 実際には未認証ユーザーはmiddlewareではじかれるのであり得ないが型安全のために明記
		throw new Error("認証済みのユーザーが必要です");
	}

	const [furniture, meta] = await Promise.all([getFurniture(user.id), getFurnitureMeta(user.id)]);

	return (
		<FurnitureListClient
			initialFurniture={furniture}
			initialCategories={meta.categories}
			initialLocations={meta.locations}
		/>
	);
}
