"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

/**
 * ログイン済みのユーザーがアクセスした場合に
 * 自動で /furniture へリダイレクトさせるカスタムフック
 */
export function useAuthRedirect() {
	const { user } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (user) {
			router.replace("/furniture");
		}
	}, [user, router]);
}
