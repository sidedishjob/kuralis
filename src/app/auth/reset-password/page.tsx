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
					<CardTitle className="text-center text-2xl">
						{pageState === "loading" ? "読み込み中..." : "新しいパスワードを設定"}
					</CardTitle>
				</CardHeader>
				<CardContent>
					{pageState === "authorized" ? (
						<PasswordResetForm form={form} onSubmit={onSubmit} />
					) : pageState === "loading" ? (
						<div className="py-8 text-center text-sm text-muted-foreground">
							認証情報を確認中...
						</div>
					) : null}
				</CardContent>
			</Card>
		</div>
	);
}
