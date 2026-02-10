"use client";

import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

interface BackToHomeButtonProps {
  className?: string;
}

/**
 * ホームに戻る共通ボタンコンポーネント
 */
export function BackToHomeButton({ className = "" }: BackToHomeButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/")}
      className={`inline-flex items-center text-kuralis-600 hover:text-kuralis-900 mb-8 transition-colors duration-300 group font-normal tracking-tighter-custom ${className}`}
      aria-label="ホームに戻る"
    >
      <FiArrowLeft
        size={16}
        className="mr-2 transform translate-x-0 group-hover:-translate-x-1 transition-all duration-400 ease-natural"
      />
      <span>ホームに戻る</span>
    </button>
  );
}
