import { NextRequest, NextResponse } from "next/server";
import { createSupabaseApiClient } from "@/lib/supabase/server";
import { ApiError } from "@/lib/errors/ApiError";
import { handleApiError } from "@/lib/utils/handleApiError";

/**
 * メンテナンスタスクのアクティブ状態を更新
 */
export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string; taskId: string }> }
) {
	const res = NextResponse.next();

	try {
		const supabase = await createSupabaseApiClient(req, res);

		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			throw new ApiError(401, "認証が必要です");
		}

		const { id, taskId } = await params;
		const body = await req.json();

		// バリデーション
		if (typeof body.is_active !== "boolean") {
			throw new ApiError(400, "有効・無効の値が不正です（boolean型が必要）");
		}

		const { is_active } = body;

		const { error } = await supabase
			.from("maintenance_tasks")
			.update({ is_active })
			.eq("id", taskId)
			.eq("furniture_id", id)
			.select()
			.single();

		if (error) {
			throw new Error(`メンテナンスタスク更新エラー: ${error.message}`);
		}

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error: unknown) {
		return handleApiError(error, "メンテナンスタスクの更新に失敗しました");
	}
}
