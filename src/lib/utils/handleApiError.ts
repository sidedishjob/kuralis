import { ApiError } from "@/lib/errors/ApiError";
import { apiErrorResponse } from "./apiResponse";

/**
 * APIルート共通エラーハンドラ
 * - 開発者向けエラーはログに出し、ユーザー向けにはfallbackMessageを返す
 */
export function handleApiError(error: unknown, fallbackMessage = "サーバーエラーが発生しました") {
	if (error instanceof ApiError) {
		// 明示的なAPIエラー（ステータスあり） → そのまま表示
		return apiErrorResponse(error.message, error.status);
	}

	if (error instanceof Error) {
		// 開発者向け詳細はログにのみ出す
		console.error("[API Error]", error.message);
		return apiErrorResponse(fallbackMessage, 500);
	}

	console.error("[API Unknown Error]", error);
	return apiErrorResponse(fallbackMessage, 500);
}
