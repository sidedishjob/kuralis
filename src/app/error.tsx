"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-24 px-6 text-center">
      <h2 className="text-2xl font-bold tracking-tighter-custom mb-4">
        エラーが発生しました
      </h2>
      <p className="text-sm text-kuralis-600 mb-8 max-w-md">
        {error.message ||
          "予期しないエラーが発生しました。再度お試しください。"}
      </p>
      <Button onClick={reset}>もう一度試す</Button>
    </div>
  );
}
