import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Supabaseのセッションを自動更新するmiddleware
 * 認証の判定やリダイレクトは各ページで行う
 */
export async function middleware(req: NextRequest) {
	const response = NextResponse.next({
		request: {
			headers: req.headers,
		},
	});

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				get: (name) => req.cookies.get(name)?.value,
				set: (name, value, options) => {
					response.cookies.set({ name, value, ...options });
				},
				remove: (name, options) => {
					response.cookies.set({ name, value: "", ...options });
				},
			},
		}
	);

	// ユーザー情報の取得
	const { data } = await supabase.auth.getUser();
	const user = data.user;

	// 公開パスチェック
	const publicPaths = [
		"/",
		"/auth/login",
		"/auth/signup",
		"/auth/reset-request",
		"/auth/reset-password",
		"/auth/callback",
		"/terms",
		"/privacy",
		"/about",
		"/contact",
		"/contact/thanks",
		"/sitemap.xml",
		"/robots.txt",
	];

	const pathname = req.nextUrl.pathname;
	const isPublic = publicPaths.some(
		(path) => pathname === path || pathname.startsWith(`${path}/`)
	);

	// 認証が必要なページで未認証の場合
	if (!user && !isPublic) {
		return NextResponse.redirect(new URL("/auth/login", req.url));
	}

	// セッション更新のみ（認証の可否判断は各ページで）
	await supabase.auth.getSession();
	return response;
}

export const config = {
	matcher: ["/((?!_next/|.*\\.(?:svg|png|jpg|jpeg|ico|woff2|js|css|json)).*)"],
};
