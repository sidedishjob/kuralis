import { API_ROUTES } from "@/lib/api/route";
import { useCallback } from "react";

export function useAddMaintenanceRecord() {
	return useCallback(async (taskId: string, date: string) => {
		const res = await fetch(API_ROUTES.maintenanceRecord, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ taskId, performedAt: date }),
		});

		if (!res.ok) {
			const error = await res.json();
			throw new Error(error.message || "追加に失敗しました");
		}

		return res.json();
	}, []);
}
