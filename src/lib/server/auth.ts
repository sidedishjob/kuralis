import { createServerClient } from "@supabase/ssr";
import { Database } from "../database.types";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * cookiesからユーザー情報を取得
 * 認証チェックなどで使用（App Router対応）
 */
export async function getUserFromCookie() {
	const cookieStore = await cookies();
	const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
		cookies: { get: (key) => cookieStore.get(key)?.value },
	});
	const {
		data: { user },
	} = await supabase.auth.getUser();
	return user;
}

/**
 * SSR対応のSupabaseクライアントを生成（cookie付き）
 * サーバーコンポーネントやAPIルートで使用
 */
export const createSupabaseServerClient = async () => {
	const cookieStore = await cookies();

	return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
		cookies: {
			get(name: string) {
				return cookieStore.get(name)?.value;
			},
		},
	});
};
