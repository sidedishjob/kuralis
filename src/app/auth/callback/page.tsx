"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
	const router = useRouter();

	useEffect(() => {
		// ログイン済みか即時確認してリダイレクト
		const checkSession = async () => {
			const { data } = await supabase.auth.getSession();
			if (data.session?.user) {
				router.push("/furniture");
			}
		};

		checkSession();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			if (event === "SIGNED_IN" && session?.user) {
				router.push("/furniture");
			}
		});

		return () => subscription.unsubscribe();
	}, [router]);

	return (
		<div className="flex flex-col flex-grow items-center justify-center min-h-[50vh]">
			<Loader2 className="h-4 w-4 animate-spin" />
		</div>
	);
}
