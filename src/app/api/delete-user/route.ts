import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { ApiError } from "@/lib/errors/ApiError";
import { handleApiError } from "@/lib/utils/handleApiError";

export async function POST() {
	try {
		const supabase = await createSupabaseServerClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) throw new ApiError(401, "未認証のため削除できません");

		// table.profiles アプリ側の拡張情報を先に削除
		await supabase.from("profiles").delete().eq("id", user.id);

		// auth.users を削除
		const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);
		if (error) throw new ApiError(500, `認証情報の削除に失敗しました: ${error.message}`);

		return NextResponse.json({ message: "アカウント削除が完了しました" });
	} catch (error: unknown) {
		return handleApiError(error, "アカウント削除に失敗しました");
	}
}
