import { NextResponse } from "next/server";
import { getFurnitureMeta } from "@/lib/server/furnitureMeta";

/**
 * 家具メタ情報（カテゴリー・設置場所）の取得（GET）
 *
 */
export async function GET() {
	try {
		const { categories, locations } = await getFurnitureMeta();

		if (categories.length === 0 && locations.length === 0) {
			return NextResponse.json({ error: "取得失敗" }, { status: 500 });
		}

		return NextResponse.json({ categories, locations });
	} catch (err) {
		if (err instanceof Error) {
			console.error("家具メタ情報取得エラー:", err.message);
			return NextResponse.json({ error: err.message }, { status: 500 });
		}
		return NextResponse.json({ error: "不明なエラーが発生しました" }, { status: 500 });
	}
}
