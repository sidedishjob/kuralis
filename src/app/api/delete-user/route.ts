import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/server/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST() {
	const supabase = await createSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: "未認証のため削除できません" }, { status: 401 });
	}

	try {
		// table.profiles アプリ側の拡張情報を先に削除
		await supabase.from("profiles").delete().eq("id", user.id);

		// auth.users を削除
		const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);
		if (error) throw error;

		return NextResponse.json({ message: "アカウント削除完了" });
	} catch (error: any) {
		console.error("アカウント削除に失敗しました:", error.message);
		return NextResponse.json({ error: "アカウント削除に失敗しました" }, { status: 500 });
	}
}
