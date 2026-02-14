"use client";

import useSWR from "swr";
import { API_ROUTES } from "@/lib/api/route";
import { fetcher } from "@/lib/fetcher";
import type { FurnitureWithExtras } from "@/types/furniture";

/**
 * 家具の詳細情報を取得・更新・削除するカスタムフック
 * 一覧ではなく、1件ごとの個別データに対して利用する
 *
 * @param id 家具ID
 * @param initialData SSR時などに渡す初期データ（省略可）
 */
export function useFurnitureById(
  id: string,
  initialData?: FurnitureWithExtras,
) {
  // SWRで個別家具データを取得
  const {
    data: furniture,
    error,
    mutate,
  } = useSWR<FurnitureWithExtras>(API_ROUTES.furnitureById(id), fetcher, {
    fallbackData: initialData,
    revalidateOnMount: initialData ? false : true,
    revalidateIfStale: initialData ? false : true,
  });

  return {
    furniture,
    error,
    mutate,
  };
}
