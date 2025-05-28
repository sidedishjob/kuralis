import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserFromCookie } from "@/lib/server/auth";
import { getFurnitureById } from "@/lib/server/furniture";

/**
 * 家具情報の取得（GET）
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	const user = await getUserFromCookie();
	if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	try {
		const furniture = await getFurnitureById(id, user.id);
		return NextResponse.json(furniture);
	} catch (err) {
		if (err instanceof Error) {
			console.error("処理失敗:", err.message);
			return NextResponse.json({ error: err.message }, { status: 500 });
		}
		return NextResponse.json({ error: "不明なエラーが発生しました" }, { status: 500 });
	}
}

/**
 * 家具情報の更新（PUT）
 */
export async function PUT(req: Request, { params }: { params: { id: string } }) {
	const user = await getUserFromCookie();
	if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const furnitureId = params.id;
	const body = await req.json();

	const supabase = await createSupabaseServerClient();

	const { data, error } = await supabase
		.from("furniture")
		.update({
			...body,
			updated_at: new Date().toISOString(),
		})
		.eq("id", furnitureId)
		.eq("user_id", user.id)
		.select()
		.single();

	if (error) {
		console.error("Update failed:", error.message);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json(data);
}

/**
 * 家具の削除（DELETE）
 */
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
	const user = await getUserFromCookie();
	if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const furnitureId = params.id;
	const supabase = await createSupabaseServerClient();

	const { error } = await supabase
		.from("furniture")
		.delete()
		.eq("id", furnitureId)
		.eq("user_id", user.id);

	if (error) {
		console.error("Delete failed:", error.message);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({ success: true });
}
