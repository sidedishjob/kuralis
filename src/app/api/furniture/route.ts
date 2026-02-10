import { NextResponse } from "next/server";
import { createSupabaseApiClient } from "@/lib/supabase/server";
import { registerFurniture } from "@/lib/server/furniture";
import { ApiError } from "@/lib/errors/ApiError";
import { handleApiError } from "@/lib/utils/handleApiError";

/**
 * 家具を登録するAPI
 */
export async function POST(req: Request) {
  const res = NextResponse.next();

  try {
    // Supabaseクライアント生成（cookieを認識するように）
    const supabase = await createSupabaseApiClient(req, res);

    // 認証済みユーザーを取得
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      throw new ApiError(401, "未認証のため登録できません");
    }

    // フォームデータの取得と登録処理
    const formData = await req.formData();
    await registerFurniture(formData, user.id);

    return NextResponse.json(
      { message: "家具の登録に成功しました" },
      { status: 200 },
    );
  } catch (error: unknown) {
    return handleApiError(error, "家具の登録に失敗しました");
  }
}
