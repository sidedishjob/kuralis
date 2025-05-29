import useSWR from "swr";
import { API_ROUTES } from "@/lib/api/route";
import { fetcher } from "@/lib/fetcher";
import type { MaintenanceTaskWithRecords } from "@/types/maintenance";

export const useMaintenanceTasks = (furnitureId: string) => {
	const { data, error, isLoading, mutate } = useSWR<MaintenanceTaskWithRecords[]>(
		API_ROUTES.maintenanceTasks(furnitureId),
		fetcher
	);

	return {
		tasks: data ?? [],
		error,
		isLoading,
		mutate,
	};
};
