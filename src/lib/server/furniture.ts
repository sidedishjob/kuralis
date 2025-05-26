import { createSupabaseServerClient } from "@/lib/server/supabase"; // SSR用Supabaseクライアント
import { FurnitureWithExtras } from "@/types/furniture_new";

/**
 * SSR用：指定したユーザーの家具データを取得する
 * @param userId SupabaseのユーザーID
 * @returns 家具一覧データ（エラー時は空配列）
 */
export async function getFurniture(userId: string) {
	const supabase = await createSupabaseServerClient();

	const { data, error } = await supabase
		.from("furniture")
		.select("*")
		.eq("user_id", userId)
		.order("purchased_at", { ascending: false });

	if (error) {
		console.error("家具データの取得に失敗しました:", error.message);
		return [];
	}

	return data;
}

/**
 * 指定されたIDの家具情報を取得する
 * サーバーコンポーネントやAPIルートで使用（cookieからユーザー情報を参照）
 *
 * @param id 家具のID
 * @returns 家具情報（存在しなければ null）
 */
export async function getFurnitureById(id: string, userId: string) {
	const supabase = await createSupabaseServerClient();

	const { data, error } = await supabase
		.from("furniture")
		.select(
			`
			id,
			user_id,
			name,
			brand,
			category_id,
			location_id,
			image_url,
			purchased_at,
			purchased_from,
			next_due_date,
			notes,
			category:categories ( id, name ),
			location:locations ( id, name )
		`
		)
		.eq("id", id)
		.eq("user_id", userId)
		.single();

	if (error || !data) {
		console.error("getFurnitureById error:", error);
		return null;
	}

	// category / location の配列を単一に変換
	const formatted: FurnitureWithExtras = {
		...data,
		category: Array.isArray(data.category) ? data.category[0] : data.category,
		location: Array.isArray(data.location) ? data.location[0] : data.location,
	};
	return formatted;
}
