import { ApiError } from "@/lib/errors/ApiError";
import { apiErrorResponse } from "./apiResponse";

/**
 * APIルート共通エラーハンドラ
 * - 明示的なAPIエラーはそのまま返す（message + status + details）
 * - それ以外はfallbackMessageと500を返す
 */
export function handleApiError(error: unknown, fallbackMessage = "サーバーエラーが発生しました") {
	if (error instanceof ApiError) {
		// 明示的なAPIエラー（開発者が投げた） → そのまま表示
		return apiErrorResponse(error.message, error.status, error.details ?? null);
	}

	if (error instanceof Error) {
		// 開発者向け詳細はログにのみ出す
		// 想定外のJSエラー：ログ出力して fallback message 返す
		console.error("[API Error]", error.message);
		return apiErrorResponse(fallbackMessage, 500);
	}

	// unknown（例：非エラー型throw）への対応
	console.error("[API Unknown Error]", error);
	return apiErrorResponse(fallbackMessage, 500);
}
