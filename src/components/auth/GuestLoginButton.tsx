"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { useToast } from "@/hooks/useToast";
import { LoadingButton } from "@/components/ui/loadingButton";

export const GuestLoginButton = () => {
	const router = useRouter();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);

	const handleGuestLogin = async () => {
		setIsLoading(true);

		const { error } = await supabase.auth.signInWithPassword({
			email: process.env.NEXT_PUBLIC_GUEST_EMAIL!,
			password: process.env.NEXT_PUBLIC_GUEST_PASSWORD!,
		});

		if (error) {
			setIsLoading(false);
			console.error("ゲストログインエラー", error);
			toast({
				title: "ログインに失敗しました。",
				description: getErrorMessage(error, "もう一度お試しください"),
				variant: "destructive",
			});
			return;
		} else {
			router.push("/furniture");
		}
	};

	return (
		<LoadingButton
			variant="outline"
			onClick={handleGuestLogin}
			isLoading={isLoading}
			loadingText="ゲストでログイン中..."
			className="w-48"
		>
			ゲストモードで試す
		</LoadingButton>
	);
};
