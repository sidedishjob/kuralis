import { NextRequest, NextResponse } from "next/server";
import { createSupabaseApiClient } from "@/lib/supabase/server";
import { ApiError } from "@/lib/errors/ApiError";
import { handleApiError } from "@/lib/utils/handleApiError";

/**
 * メンテナンス履歴の削除
 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const res = NextResponse.next();

	try {
		const supabase = await createSupabaseApiClient(req, res);

		const {
			data: { user },
			error,
		} = await supabase.auth.getUser();

		if (error || !user) throw new ApiError(401, "未認証のため削除できません");

		const { id } = await params;

		const { error: deleteError } = await supabase
			.from("maintenance_records")
			.delete()
			.eq("id", id);

		if (deleteError) {
			throw new Error(`メンテナンス履歴削除エラー: ${deleteError.message}`);
		}

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error: unknown) {
		return handleApiError(error, "メンテナンス履歴の削除に失敗しました");
	}
}
