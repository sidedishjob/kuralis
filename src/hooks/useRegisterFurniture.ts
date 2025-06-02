import { useState } from "react";
import { API_ROUTES } from "@/lib/api/route";

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
				const msg = result?.error || result?.message || "家具の登録に失敗しました";
				throw new Error(msg);
			}

			return result;
		} catch (err) {
			const message = err instanceof Error ? err.message : "不明なエラーが発生しました";
			setError(message);
			throw err;
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
