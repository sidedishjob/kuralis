import useSWR from "swr";
import { API_ROUTES } from "@/lib/api/route";
import { fetcher } from "@/lib/fetcher";
import type { FurnitureMeta } from "@/types/furniture_meta";

/**
 * 家具メタ情報（カテゴリー・設置場所）を取得するフック
 */
export function useFurnitureMeta() {
	const { data, error, isLoading } = useSWR<FurnitureMeta>(API_ROUTES.furnitureMeta, fetcher);

	return {
		data,
		error,
		isLoading,
	};
}
