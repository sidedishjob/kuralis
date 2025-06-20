"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingButton } from "@/components/ui/loadingButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UseFormReturn } from "react-hook-form";
import type { PasswordResetSchema } from "@/lib/validation";

interface Props {
	pageState: "loading" | "authorized";
	form: UseFormReturn<PasswordResetSchema>;
	onSubmit: (values: PasswordResetSchema) => Promise<void>;
}

export function PasswordResetForm({ pageState, form, onSubmit }: Props) {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = form;

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				{pageState === "loading" ? (
					<div className="w-2/3 h-10 bg-gray-200 rounded-sm animate-pulse mx-auto" />
				) : (
					<CardTitle className="text-center text-2xl">新しいパスワードを設定</CardTitle>
				)}
			</CardHeader>
			<CardContent>
				{pageState === "authorized" ? (
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="password">新しいパスワード</Label>
							<Input
								id="password"
								type="password"
								placeholder="新しいパスワードを入力してください"
								{...register("newPassword")}
							/>
							{errors.newPassword && (
								<p className="text-sm text-red-500">{errors.newPassword.message}</p>
							)}
						</div>
						<LoadingButton
							type="submit"
							isLoading={isSubmitting}
							loadingText="更新中..."
							className="w-full"
						>
							パスワードを更新
						</LoadingButton>
					</form>
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
	);
}
