import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "../database.types";

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
			getAll: () => cookieStore.getAll(),
			setAll: (all) =>
				all.forEach((c) => {
					cookieStore.set(c.name, c.value, c.options);
				}),
		},
	});
}

//TODO 上記の処理を下記処理に置換（利用側の関数名も全置換）
/**
 * サーバー側で利用する Supabase クライアントを生成
 */
export const createServerSupabase = async () => {
	const cookieStore = await cookies();

	return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
		cookies: {
			getAll: () => cookieStore.getAll(),
			setAll: (all) => all.forEach((c) => cookieStore.set(c.name, c.value, c.options)),
		},
	});
};

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
