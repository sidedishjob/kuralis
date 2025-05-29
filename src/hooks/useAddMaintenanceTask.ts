import useSWRMutation from "swr/mutation";
import { API_ROUTES } from "@/lib/api/route";

export function useAddMaintenanceTask(furnitureId: string) {
	const addTask = async (
		_: string,
		{ arg }: { arg: { taskName: string; cycleValue: string; cycleUnit: string } }
	) => {
		const res = await fetch(API_ROUTES.maintenanceTasks(furnitureId), {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(arg),
		});
		if (!res.ok) throw new Error("メンテナンス項目の登録に失敗しました");
		return res.json();
	};

	const { trigger, isMutating } = useSWRMutation(
		API_ROUTES.maintenanceTasks(furnitureId),
		addTask
	);
	return { addTask: trigger, isAdding: isMutating };
}
