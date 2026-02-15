"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FiAlertCircle, FiRotateCcw } from "react-icons/fi";

interface ErrorMessageProps {
  error: unknown; // SWR の error オブジェクト
  onRetry?: () => void; // 再試行ハンドラ（任意）
  className?: string; // 外部からスタイル拡張したい場合
}

/**
 * API/SWR エラー表示用の共通コンポーネント
 */
export const ErrorMessage = ({
  error,
  onRetry,
  className,
}: ErrorMessageProps) => {
  // エラー内容を読み取りやすい文字列へ変換
  const message = (() => {
    if (error instanceof Error) return error.message;
    if (typeof error === "string") return error;
    return "不明なエラーが発生しました";
  })();

  return (
    <Alert variant="destructive" className={`gap-1 ${className}`}>
      {/* アイコン */}
      <FiAlertCircle />

      {/* 本文 + ボタン */}
      <AlertTitle>エラーが発生しました</AlertTitle>
      <AlertDescription>{message}</AlertDescription>

      {/* 再試行ボタン（任意） */}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="pt-5 col-span-2 inline-flex items-center justify-center gap-1 text-sm text-kuralis-900 hover:underline"
        >
          <FiRotateCcw size={16} /> 再試行
        </button>
      )}
    </Alert>
  );
};
