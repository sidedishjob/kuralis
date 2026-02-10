import { NextResponse } from "next/server";

/**
 * エラーAPIレスポンスを返す共通関数
 * @param message 表示メッセージ
 * @param status ステータスコード（例：400, 401, 500）
 * @param details 追加情報（バリデーションエラーなど）
 */
export function apiErrorResponse(
  message: string,
  status = 500,
  details: unknown = null,
) {
  return NextResponse.json({ error: message, details }, { status });
}
