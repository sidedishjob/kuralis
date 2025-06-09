"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PasswordResetForm } from "@/components/auth/PasswordResetForm";
import { usePasswordResetPage } from "@/hooks/usePasswordResetPage";

export default function ResetPasswordPage() {
	const { pageState, form, onSubmit } = usePasswordResetPage();

	return (
		<div className="flex items-center justify-center bg-background p-16">
			<Card className="w-full max-w-md">
				<CardHeader>
					{pageState === "loading" ? (
						<div className="w-2/3 h-10 bg-gray-200 rounded-sm animate-pulse mx-auto" />
					) : (
						<CardTitle className="text-center text-2xl">
							新しいパスワードを設定
						</CardTitle>
					)}
				</CardHeader>
				<CardContent>
					{pageState === "authorized" ? (
						<PasswordResetForm form={form} onSubmit={onSubmit} />
					) : pageState === "loading" ? (
						<div className="space-y-2 p-2">
							{/* パスワード入力欄のスケルトン */}
							<div className="w-full h-8 bg-gray-200 rounded-sm animate-pulse" />

							{/* ボタンのスケルトン */}
							<div className="w-full h-8 bg-gray-300 rounded-sm animate-pulse" />
						</div>
					) : null}
				</CardContent>
			</Card>
		</div>
	);
}
