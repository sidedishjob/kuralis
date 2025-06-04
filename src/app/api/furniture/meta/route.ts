import { NextResponse } from "next/server";
import { getFurnitureMeta } from "@/lib/server/furnitureMeta";
import { handleApiError } from "@/lib/utils/handleApiError";

/**
 * 家具メタ情報（カテゴリー・設置場所）の取得
 *
 */
export async function GET() {
	try {
		const { categories, locations } = await getFurnitureMeta();

		if (categories.length === 0 && locations.length === 0) {
			throw new Error("家具メタ情報取得エラー:");
		}

		return NextResponse.json({ categories, locations });
	} catch (error: unknown) {
		return handleApiError(error, "カテゴリー・設置場所の取得に失敗しました");
	}
}
