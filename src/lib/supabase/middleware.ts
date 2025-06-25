import { createClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";

// Edge Middleware 用 Supabase クライアント生成関数
export function createSupabaseMiddlewareClient(req: NextRequest) {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

	const accessToken = req.cookies.get("sb-access-token")?.value ?? "";

	return createClient(supabaseUrl, supabaseAnonKey, {
		global: {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		},
	});
}
