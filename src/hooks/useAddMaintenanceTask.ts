import useSWRMutation from "swr/mutation";
import { API_ROUTES } from "@/lib/api/route";
import type { MaintenanceTaskPayload } from "@/types/maintenance";

/**
 * 指定された家具IDに対して、メンテナンスタスクを追加するためのカスタムフック
 */
export function useAddMaintenanceTask(furnitureId: string) {
	const addTask = async (_: string, { arg }: { arg: MaintenanceTaskPayload }) => {
		const res = await fetch(API_ROUTES.maintenanceTasks(furnitureId), {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(arg),
		});
		if (!res.ok) {
			const error = await res.json();
			throw new Error(error.message || "メンテナンスタスクの登録に失敗しました");
		}
		return res.json();
	};

	const { trigger, isMutating } = useSWRMutation(
		API_ROUTES.maintenanceTasks(furnitureId),
		addTask
	);
	return { addTask: trigger, isAdding: isMutating };
}
