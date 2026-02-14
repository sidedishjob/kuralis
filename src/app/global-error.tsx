"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col items-center justify-center font-sans">
        <h2 className="text-2xl font-bold mb-4">エラーが発生しました</h2>
        <p className="text-sm text-gray-600 mb-8 max-w-md text-center">
          {error.message ||
            "予期しないエラーが発生しました。再度お試しください。"}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          もう一度試す
        </button>
      </body>
    </html>
  );
}
