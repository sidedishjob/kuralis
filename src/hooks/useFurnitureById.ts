"use client";

import useSWR from "swr";
import { useCallback } from "react";
import { Furniture, FurnitureWithExtras } from "@/types/furniture_new";
import { API_ROUTES } from "@/lib/api/route";
import { fetcher } from "@/lib/fetcher";

/**
 * 家具の詳細情報を取得・更新・削除するフック
 * 一覧ではなく、1件ごとの個別データに対して利用する
 *
 * @param id 家具ID
 */
export function useFurnitureById(id: string, initialData?: FurnitureWithExtras) {
	// SWRで個別家具データを取得
	const {
		data: furniture,
		error,
		isLoading,
		mutate,
	} = useSWR<Furniture>(API_ROUTES.furnitureById(id), fetcher, {
		fallbackData: initialData,
		revalidateOnMount: true, // 初回もバックグラウンドで更新
	});

	/**
	 * 家具情報の更新処理
	 * @param updatedData 更新対象のフィールド
	 * @returns 更新後の家具データ
	 */
	const updateFurniture = useCallback(
		async (updatedData: Partial<Furniture>) => {
			const res = await fetch(API_ROUTES.furnitureById(id), {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(updatedData),
			});

			if (!res.ok) throw new Error("更新に失敗しました");

			const updated = await res.json();
			mutate(updated); // ローカルキャッシュを更新
			return updated;
		},
		[id, mutate]
	);

	/**
	 * 家具情報の削除処理
	 */
	const deleteFurniture = useCallback(async () => {
		const res = await fetch(API_ROUTES.furnitureById(id), {
			method: "DELETE",
		});
		if (!res.ok) throw new Error("削除に失敗しました");
	}, [id]);

	return {
		furniture,
		isLoading,
		error,
		updateFurniture,
		deleteFurniture,
		mutate, // 手動再取得が必要な場合に使用
	};
}
