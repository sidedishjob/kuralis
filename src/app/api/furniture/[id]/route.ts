import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserFromCookie } from "@/lib/supabase/server";
import { getFurnitureById } from "@/lib/server/furniture";
import { updateFurniture } from "@/lib/server/updateFurniture";

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
	try {
		const user = await getUserFromCookie();
		if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const { id } = await params;

		const formData = await req.formData();
		const updated = await updateFurniture(formData, user.id, id);

		return NextResponse.json(updated, { status: 200 });
	} catch (error) {
		console.error("Update furniture error:", error);
		return NextResponse.json({ error: (error as Error).message }, { status: 500 });
	}
}

/**
 * 家具の削除（DELETE）
 */
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
	const user = await getUserFromCookie();
	if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const { id } = await params;
	const supabase = await createSupabaseServerClient();

	const { error } = await supabase.from("furniture").delete().eq("id", id).eq("user_id", user.id);

	if (error) {
		console.error("Delete failed:", error.message);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({ success: true });
}
