import { createSupabaseServerClient } from "@/lib/supabase/server";
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
		console.error("ユーザー取得エラー:", userError?.message);
		return { categories: [], locations: [] };
	}

	// カテゴリ一覧（全ユーザー共通）
	const { data: categories, error: categoriesError } = await supabase
		.from("categories")
		.select("id, name")
		.order("name", { ascending: true });

	// ロケーション一覧（デフォルト & そのユーザー専用）
	const { data: locations, error: locationsError } = await supabase
		.from("locations")
		.select("id, name")
		.or(`user_id.eq.${user.id},user_id.is.null`)
		.order("user_id", { ascending: true, nullsFirst: true })
		.order("id", { ascending: true });

	if (categoriesError) {
		console.error("カテゴリ取得エラー:", categoriesError.message);
	}
	if (locationsError) {
		console.error("ロケーション取得エラー:", locationsError.message);
	}

	return {
		categories: categories || [],
		locations: locations || [],
	};
}
