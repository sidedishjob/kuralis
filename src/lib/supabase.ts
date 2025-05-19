import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { Database } from "./database.types";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// クライアント用supabaseインスタンス
export const supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);

/**
 * サーバーサイドでクッキーからユーザー情報を取得する
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
