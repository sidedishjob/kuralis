"use client";

import useSWR from "swr";
import { useCallback } from "react";
import type { FurnitureWithExtras } from "@/types/furniture";
import { API_ROUTES } from "@/lib/api/route";
import { fetcher } from "@/lib/fetcher";

/**
 * 家具の詳細情報を取得・更新・削除するカスタムフック
 * 一覧ではなく、1件ごとの個別データに対して利用する
 *
 * @param id 家具ID
 * @param initialData SSR時などに渡す初期データ（省略可）
 */
export function useFurnitureById(id: string, initialData?: FurnitureWithExtras) {
	// SWRで個別家具データを取得
	const {
		data: furniture,
		error,
		isLoading,
		mutate,
	} = useSWR<FurnitureWithExtras>(API_ROUTES.furnitureById(id), fetcher, {
		fallbackData: initialData,
		revalidateOnMount: true,
	});

	/**
	 * 家具情報を更新する
	 * @param formData 更新用の FormData
	 * @returns 更新後の家具データ
	 */
	const updateFurniture = useCallback(
		async (formData: FormData): Promise<FurnitureWithExtras> => {
			const res = await fetch(API_ROUTES.furnitureById(id), {
				method: "PUT",
				body: formData, // Content-Type 自動で multipart/form-data に設定される
			});

			if (!res.ok) {
				const msg = await res.text();
				throw new Error(`更新に失敗しました: ${msg}`);
			}

			const updated = await res.json();
			mutate(updated, false); // 楽観的更新ではなく置き換え
			return updated;
		},
		[id, mutate]
	);

	/**
	 * 家具情報を削除する
	 */
	const deleteFurniture = useCallback(async (): Promise<void> => {
		const res = await fetch(API_ROUTES.furnitureById(id), {
			method: "DELETE",
		});
		if (!res.ok) {
			const msg = await res.text();
			throw new Error(`削除に失敗しました: ${msg}`);
		}
	}, [id]);

	return {
		furniture,
		isLoading,
		error,
		updateFurniture,
		deleteFurniture,
		mutate,
	};
}
