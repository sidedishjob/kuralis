"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
	const router = useRouter();

	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			if (event === "SIGNED_IN" && session?.user) {
				// 必要ならプロフィール insert など
				router.push("/furniture"); // ← ここで初めて家具一覧に遷移
			}
		});

		return () => subscription.unsubscribe();
	}, []);

	return (
		<div className="flex items-center justify-center h-screen">
			<p>ログイン中です...</p>
		</div>
	);
}
