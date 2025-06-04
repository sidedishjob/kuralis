import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { handleApiError } from "@/lib/utils/handleApiError";

/**
 * メンテナンスタスクのアクティブ状態を更新
 */
export async function PATCH(req: Request, { params }: { params: { id: string; taskId: string } }) {
	const { id, taskId } = await params;
	const body = await req.json();

	// バリデーション
	if (typeof body.is_active !== "boolean") {
		return NextResponse.json(
			{ error: "有効・無効の値が不正です（boolean型が必要）" },
			{ status: 400 }
		);
	}

	try {
		const supabase = await createSupabaseServerClient();

		const { is_active } = body;

		const { error } = await supabase
			.from("maintenance_tasks")
			.update({ is_active })
			.eq("id", taskId)
			.eq("furniture_id", id);

		if (error) {
			throw new Error(`メンテナンスタスク更新エラー: ${error.message}`);
		}

		return NextResponse.json({ success: true });
	} catch (error: unknown) {
		return handleApiError(error, "メンテナンスタスクの更新に失敗しました");
	}
}
