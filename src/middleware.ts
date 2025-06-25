import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware";

export async function middleware(req: NextRequest) {
	const supabase = createSupabaseMiddlewareClient(req);

	const {
		data: { user },
	} = await supabase.auth.getUser();

	const publicPaths = [
		"/",
		"/auth/login",
		"/auth/signup",
		"/auth/reset-request",
		"/auth/reset-password",
		"/terms",
		"/privacy",
		"/about",
		"/contact",
		"/contact/thanks",
	];
	const pathname = req.nextUrl.pathname;
	const isPublic = publicPaths.some(
		(path) => pathname === path || pathname.startsWith(`${path}/`)
	);

	if (!user && !isPublic) {
		return NextResponse.redirect(new URL("/auth/login", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next/|.*\\.(?:svg|png|jpg|jpeg|ico|woff2|js|css|json)).*)"],
};
