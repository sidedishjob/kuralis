import { createSupabaseServerClient } from "./supabase";

/**
 * cookiesからユーザー情報を取得
 * 認証チェックなどで使用（App Router対応）
 */
export async function getUserFromCookie() {
	const supabase = await createSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	return user;
}
