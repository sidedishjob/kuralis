import { NextRequest, NextResponse } from "next/server";
import { getFurnitureMeta } from "@/lib/server/furnitureMeta";
import { handleApiError } from "@/lib/utils/handleApiError";
import { createSupabaseApiClient } from "@/lib/supabase/server";
import { ApiError } from "@/lib/errors/ApiError";

/**
 * 家具メタ情報（カテゴリー・設置場所）の取得
 *
 */
export async function GET(req: NextRequest) {
	const res = NextResponse.next();

	try {
		const supabase = await createSupabaseApiClient(req, res);
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser();

		if (error || !user) throw new ApiError(401, "未認証のため取得できません");

		const { categories, locations } = await getFurnitureMeta(user.id);

		if (categories.length === 0 && locations.length === 0) {
			throw new Error("家具メタ情報取得エラー:");
		}

		return NextResponse.json({ categories, locations }, { status: 200 });
	} catch (error: unknown) {
		return handleApiError(error, "カテゴリー・設置場所の取得に失敗しました");
	}
}
