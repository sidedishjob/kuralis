import { API_ROUTES } from "@/lib/api/route";

export function useDeleteMaintenanceRecord() {
	return async (recordId: string) => {
		const res = await fetch(`${API_ROUTES.maintenanceRecordById(recordId)}`, {
			method: "DELETE",
		});
		if (!res.ok) {
			throw new Error("削除に失敗しました");
		}
	};
}
