import useSWR from "swr";
import { API_ROUTES } from "@/lib/api/route";
import { fetcher } from "@/lib/fetcher";
import { FurnitureMeta } from "@/types/furniture_meta";

export function useFurnitureMeta() {
	const { data, error, isLoading } = useSWR<FurnitureMeta>(API_ROUTES.furnitureMeta, fetcher);

	return {
		categories: data?.categories || [],
		locations: data?.locations || [],
		error,
		isLoading,
	};
}
