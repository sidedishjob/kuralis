"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

/**
 * 認証済みユーザーを自動で家具一覧ページへリダイレクトするカスタムフック
 */
export function useAuthRedirect() {
	const { user } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (user) {
			router.push("/furniture");
		}
	}, [user, router]);
}
