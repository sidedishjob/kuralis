import useSWR from "swr";
import { API_ROUTES } from "@/lib/api/route";
import { fetcher } from "@/lib/fetcher";
import type { MaintenanceTaskWithRecords } from "@/types/maintenance";

/**
 * 家具IDに紐づくメンテナンスタスクを取得するカスタムフック
 *
 * @param furnitureId 家具ID
 * @param initialData SSR時などに渡す初期データ（省略可）
 */
export function useMaintenanceTasks(
  furnitureId: string,
  initialData?: MaintenanceTaskWithRecords[],
) {
  const { data, error, mutate } = useSWR<MaintenanceTaskWithRecords[]>(
    API_ROUTES.maintenanceTasks(furnitureId),
    fetcher,
    {
      fallbackData: initialData,
      revalidateOnMount: initialData ? false : true,
      revalidateIfStale: initialData ? false : true,
    },
  );

  return {
    tasks: data ?? [],
    error,
    mutate,
  };
}
