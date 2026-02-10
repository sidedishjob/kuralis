import { useCallback } from "react";
import { API_ROUTES } from "@/lib/api/route";

/**
 * 家具情報を削除するカスタムフック
 */
export function useDeleteFurniture(
  id: string,
  mutate?: (data?: undefined, shouldRevalidate?: boolean) => void,
) {
  const deleteFurniture = useCallback(async (): Promise<void> => {
    const res = await fetch(API_ROUTES.furnitureById(id), {
      method: "DELETE",
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(`削除に失敗しました: ${msg}`);
    }

    if (mutate) {
      mutate(undefined, false);
    }
  }, [id, mutate]);

  return { deleteFurniture };
}
