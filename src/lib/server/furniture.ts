import { createSupabaseServerClient } from "@/lib/server/supabase"; // SSR用Supabaseクライアント

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
