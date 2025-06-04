import { NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/supabase/server";
import { registerFurniture } from "@/lib/server/furniture";
import { ApiError } from "@/lib/errors/ApiError";
import { handleApiError } from "@/lib/utils/handleApiError";

/**
 * 家具を登録するAPI
 */
export async function POST(req: Request) {
	const user = await getUserFromCookie();
	if (!user) throw new ApiError(401, "未認証のため登録できません");

	try {
		const formData = await req.formData();
		await registerFurniture(formData, user.id);
		return NextResponse.json({ message: "家具の登録に成功しました" });
	} catch (error: unknown) {
		return handleApiError(error, "家具の登録に失敗しました");
	}
}
