import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "../database.types"; // 既存の型定義を使用

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * SSR対応のSupabaseクライアントを生成（cookie付き）
 * サーバーコンポーネントやAPIルートで使用
 */
export async function createSupabaseServerClient() {
	const cookieStore = await cookies();

	return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
		cookies: {
			getAll() {
				return cookieStore.getAll();
			},
			setAll(cookiesToSet) {
				try {
					cookiesToSet.forEach(({ name, value, options }) => {
						cookieStore.set(name, value, options);
					});
				} catch {
					// Server Component から呼び出された場合などは setAll が無視される（問題なし）
				}
			},
		},
	});
}

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
