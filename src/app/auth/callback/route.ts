import { NextRequest, NextResponse } from "next/server";
import type { CookieOptions } from "@supabase/ssr";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";

export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const code = url.searchParams.get("code");

	if (!code) {
		console.error("認可コードが存在しません");
		return NextResponse.redirect(new URL("/auth/login", req.url));
	}

	// レスポンスを生成（cookieを書き込むため）
	const res = NextResponse.redirect(new URL("/furniture", req.url));

	// Supabase SSRクライアントを生成
	const supabase = createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll: () => req.cookies.getAll(),
				setAll: (cookies: { name: string; value: string; options: CookieOptions }[]) =>
					cookies.forEach((c) => {
						res.cookies.set(c.name, c.value, c.options);
					}),
			},
		}
	);

	// 🔁 セッション交換処理（ここでCookieが書き込まれる）
	const { error } = await supabase.auth.exchangeCodeForSession(code);
	if (error) {
		console.error("セッション交換エラー:", error.message);
		return NextResponse.redirect(new URL("/auth/login", req.url));
	}

	// 成功時レスポンスを返す（Cookie含む）
	return res;
}
