import { createSupabaseServerClient } from "@/lib/server/auth";
import { NextResponse } from "next/server";

export async function GET() {
	const supabase = await createSupabaseServerClient();

	// 認証ユーザーの取得
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError || !user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	// カテゴリ一覧の取得（全件）
	const { data: categories, error: categoriesError } = await supabase
		.from("categories")
		.select("id, name")
		.order("name", { ascending: true });

	// ユーザーのロケーション一覧の取得
	const { data: locations, error: locationsError } = await supabase
		.from("locations")
		.select("id, name")
		.eq("user_id", user.id)
		.order("name", { ascending: true });

	if (categoriesError || locationsError) {
		return NextResponse.json(
			{
				error: categoriesError?.message || locationsError?.message,
			},
			{ status: 500 }
		);
	}

	return NextResponse.json({
		categories,
		locations,
	});
}
