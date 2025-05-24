import useSWR from "swr";
import { Furniture } from "@/types/furniture_new";
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
