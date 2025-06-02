import { useCallback } from "react";
import { API_ROUTES } from "@/lib/api/route";

/**
 * メンテナンス履歴を削除するためのカスタムフック
 */
export function useDeleteMaintenanceRecord() {
	const deleteRecord = useCallback(async (recordId: string) => {
		const res = await fetch(API_ROUTES.maintenanceRecordById(recordId), {
			method: "DELETE",
		});

		if (!res.ok) {
			const error = await res.json().catch(() => null);
			throw new Error(error?.message || "メンテナンス履歴の削除に失敗しました");
		}
	}, []);

	return { deleteRecord };
}
