import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/server/supabase";
import { getUserFromCookie } from "@/lib/server/auth";
import { registerFurniture } from "@/lib/server/furniture";

/**
 * 家具一覧を取得するAPI
 */
export async function GET() {
	const supabase = await createSupabaseServerClient();
	const { data, error } = await supabase.from("furniture").select("*");

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json(data);
}

/**
 * 家具を登録するAPI
 */
export async function POST(req: Request) {
	const user = await getUserFromCookie();
	if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	try {
		const formData = await req.formData();
		await registerFurniture(formData, user.id);
		return NextResponse.json({ message: "登録成功" });
	} catch (err) {
		console.error("登録処理失敗:", err);
		return NextResponse.json(
			{ error: err instanceof Error ? err.message : "登録に失敗しました" },
			{ status: 500 }
		);
	}
}
