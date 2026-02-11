import { NextRequest, NextResponse } from "next/server";
import { createSupabaseApiClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { ApiError } from "@/lib/errors/ApiError";
import { handleApiError } from "@/lib/utils/handleApiError";

/**
 * 認証済ユーザーのアカウント削除API
 * - profiles テーブルのデータを削除
 * - Supabase Auth (auth.users) からも削除
 */
export async function POST(req: NextRequest) {
  const res = NextResponse.next();

  try {
    // Supabase クライアント生成（cookie連携）
    const supabase = await createSupabaseApiClient(req, res);

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      throw new ApiError(401, "未認証のため削除できません");
    }

    // table.profiles アプリ側のプロフィール情報を先に削除
    const { error: profileError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", user.id);

    if (profileError) {
      throw new ApiError(
        500,
        `プロフィール削除エラー: ${profileError.message}`,
      );
    }

    // auth.users Supabase Authユーザー削除（管理者権限）
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
      user.id,
    );

    if (authError) {
      throw new ApiError(
        500,
        `認証情報の削除に失敗しました: ${authError.message}`,
      );
    }

    return NextResponse.json(
      { message: "アカウント削除が完了しました" },
      { status: 200 },
    );
  } catch (error: unknown) {
    return handleApiError(error, "アカウント削除に失敗しました");
  }
}
