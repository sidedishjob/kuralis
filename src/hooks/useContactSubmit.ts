"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "./useToast";
import { ContactSchema } from "@/lib/validation";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";

/**
 * お問い合わせ送信用のカスタムフック
 */
export function useContactSubmit() {
	const router = useRouter();
	const { toast } = useToast();
	const [isSuccess, setIsSuccess] = useState(false);

	const submitContact = async (data: ContactSchema) => {
		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (!res.ok) {
				const errorData = await res.json();
				toast({
					title: "問い合わせの送信に失敗しました",
					description: getErrorMessage(errorData.error, "もう一度お試しください"),
					variant: "destructive",
				});
				return;
			}

			setIsSuccess(true);
			router.push("/contact/thanks");
		} catch (error: unknown) {
			console.error("問い合わせ送信エラー:", error);
			toast({
				title: "問い合わせの送信に失敗しました",
				description: getErrorMessage(error, "もう一度お試しください"),
				variant: "destructive",
			});
		}
	};

	return { submitContact, isSuccess };
}
