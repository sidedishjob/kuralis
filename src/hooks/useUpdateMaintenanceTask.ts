import { useCallback } from "react";
import { API_ROUTES } from "@/lib/api/route";
import { useToast } from "@/hooks/useToast";

export function useUpdateMaintenanceTask(id: string) {
	const { toast } = useToast();

	const updateTaskActive = useCallback(
		async (taskId: string, isActive: boolean) => {
			const res = await fetch(API_ROUTES.maintenanceTasksById(id, taskId), {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ is_active: isActive }),
			});

			if (!res.ok) {
				toast({ title: "更新失敗", variant: "destructive" });
				throw new Error(await res.text());
			}
		},
		[id]
	);

	return { updateTaskActive };
}
