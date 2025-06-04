import { useState } from "react";
import { API_ROUTES } from "@/lib/api/route";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";

/**
 * 家具情報を登録するフック
 */
export function useRegisterFurniture() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const register = async (formData: FormData) => {
		setIsLoading(true);
		setError(null);

		try {
			const res = await fetch(API_ROUTES.furniture, {
				method: "POST",
				body: formData,
			});
			const result = await res.json();

			if (!res.ok) {
				const message = result?.error || result?.message || "家具の登録に失敗しました";
				throw new Error(message);
			}

			return result;
		} catch (error: unknown) {
			const message = getErrorMessage(error, "もう一度お試しください");
			setError(message);
			throw new Error(message);
		} finally {
			setIsLoading(false);
		}
	};

	return {
		register,
		isLoading,
		error,
	};
}
