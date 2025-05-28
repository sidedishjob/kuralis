import { createSupabaseServerClient } from "@/lib/server/supabase";
import type { FurnitureMeta } from "@/types/furniture_meta";

/**
 * SSR用：認証済ユーザーのカテゴリ・ロケーション一覧を取得
 */
export async function getFurnitureMeta(): Promise<FurnitureMeta> {
	const supabase = await createSupabaseServerClient();

	// ユーザー取得（cookieから）
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError || !user) {
		console.error("ユーザー取得失敗:", userError?.message);
		return { categories: [], locations: [] };
	}

	// カテゴリ一覧（全ユーザー共通）
	const { data: categories, error: categoriesError } = await supabase
		.from("categories")
		.select("id, name")
		.order("name", { ascending: true });

	// ロケーション一覧（そのユーザー専用）
	const { data: locations, error: locationsError } = await supabase
		.from("locations")
		.select("id, name")
		.eq("user_id", user.id)
		.order("name", { ascending: true });

	if (categoriesError) {
		console.error("カテゴリ取得失敗:", categoriesError.message);
	}
	if (locationsError) {
		console.error("ロケーション取得失敗:", locationsError.message);
	}

	return {
		categories: categories || [],
		locations: locations || [],
	};
}
