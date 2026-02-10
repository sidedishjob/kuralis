import { API_ROUTES } from "../api/route";
import { errorMessageMap } from "../errors/errorMessageMap";

/**
 * クライアントでのエラー表示用 & API経由でサーバーにエラーを通知
 */
export function getErrorMessage(
  error: unknown,
  fallback = "エラーが発生しました",
): string {
  if (error instanceof Error) {
    const translated = errorMessageMap[error.message];

    // 未対応エラーならログ送信
    if (!translated && process.env.NODE_ENV === "development") {
      // 非同期でAPIにログ送信
      fetch(API_ROUTES.logClientError, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: error.message }),
      }).catch(() => {
        // fetch失敗時は握りつぶす
      });
    }

    return translated || fallback;
  }

  return fallback;
}
