import { useCallback } from "react";
import { API_ROUTES } from "@/lib/api/route";
import type { FurnitureWithExtras } from "@/types/furniture";

/**
 * 家具情報を更新するカスタムフック
 */
export function useUpdateFurniture(
	id: string,
	mutate: (data?: FurnitureWithExtras, shouldRevalidate?: boolean) => void
) {
	const updateFurniture = useCallback(
		async (formData: FormData): Promise<FurnitureWithExtras> => {
			const res = await fetch(API_ROUTES.furnitureById(id), {
				method: "PUT",
				body: formData,
			});

			if (!res.ok) {
				const msg = await res.text();
				throw new Error(`更新に失敗しました: ${msg}`);
			}

			const updated: FurnitureWithExtras = await res.json();
			mutate(updated, false);
			return updated;
		},
		[id, mutate]
	);

	return { updateFurniture };
}
