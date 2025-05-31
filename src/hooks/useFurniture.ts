import useSWR from "swr";
import type { Furniture } from "@/types/furniture";
import { API_ROUTES } from "@/lib/api/route";
import { fetcher } from "@/lib/fetcher";

export function useFurniture() {
	const { data, error, isLoading } = useSWR<Furniture[]>(API_ROUTES.furniture, fetcher);

	return {
		data,
		error,
		isLoading,
	};
}
