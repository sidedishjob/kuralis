import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { handleApiError } from "@/lib/utils/handleApiError";

/**
 * メンテナンス履歴の削除
 */
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	try {
		const supabase = await createSupabaseServerClient();
		const { error } = await supabase.from("maintenance_records").delete().eq("id", id);

		if (error) {
			throw new Error(`メンテナンス履歴削除エラー: ${error.message}`);
		}
		return NextResponse.json({ success: true });
	} catch (error: unknown) {
		return handleApiError(error, "メンテナンス履歴の削除に失敗しました");
	}
}
