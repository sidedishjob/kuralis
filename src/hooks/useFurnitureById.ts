"use client";

import useSWR from "swr";
import { useCallback } from "react";
import type { Furniture, FurnitureWithExtras } from "@/types/furniture";
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
		async (formData: FormData) => {
			const res = await fetch(API_ROUTES.furnitureById(id), {
				method: "PUT",
				body: formData, // Content-Type 自動で multipart/form-data に設定される
			});

			if (!res.ok) throw new Error("更新に失敗しました");

			const updated = await res.json();
			mutate(updated);
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
