import useSWR from "swr";
import { API_ROUTES } from "@/lib/api/route";
import { fetcher } from "@/lib/fetcher";
import type { MaintenanceTaskWithRecords } from "@/types/maintenance";

export function useMaintenanceTasks(
	furnitureId: string,
	initialMaintenanceItems: MaintenanceTaskWithRecords[]
) {
	const { data, error, isLoading, mutate } = useSWR<MaintenanceTaskWithRecords[]>(
		API_ROUTES.maintenanceTasks(furnitureId),
		fetcher,
		{ fallbackData: initialMaintenanceItems }
	);

	return {
		tasks: data,
		error,
		isLoading,
		mutate,
	};
}
