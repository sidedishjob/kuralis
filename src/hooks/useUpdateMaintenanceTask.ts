import { useCallback } from "react";
import { API_ROUTES } from "@/lib/api/route";

/**
 * メンテナンス状態のを更新するカスタムフック
 */
export function useUpdateMaintenanceTask(id: string) {
	const updateTaskActive = useCallback(
		async (taskId: string, isActive: boolean) => {
			const res = await fetch(API_ROUTES.maintenanceTasksById(id, taskId), {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ is_active: isActive }),
			});

			if (!res.ok) {
				throw new Error((await res.text()) || "メンテナンス状態の更新に失敗しました");
			}
		},
		[id]
	);

	return { updateTaskActive };
}
