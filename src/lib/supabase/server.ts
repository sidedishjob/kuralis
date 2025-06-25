import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "../database.types";
import { NextRequest, NextResponse } from "next/server";

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
 * SSR（page.tsx / layout.tsx）用クライアント
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
 * サーバー側で利用する Supabase クライアントを生成
 * API Route（route.ts）用クライアント
 */
export const createSupabaseApiClient = (
	req: Request | NextRequest,
	res: Response | NextResponse
) => {
	return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
		cookies: {
			getAll: () => {
				const cookieHeader = req.headers.get("cookie") || "";
				return cookieHeader.split(";").map((cookie) => {
					const [name, ...rest] = cookie.trim().split("=");
					return { name, value: rest.join("=") };
				});
			},
			setAll: (cookies) => {
				for (const cookie of cookies) {
					res.headers.append(
						"Set-Cookie",
						`${cookie.name}=${cookie.value}; Path=/; HttpOnly`
					);
				}
			},
		},
	});
};
