"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UseFormReturn } from "react-hook-form";
import type { PasswordResetSchema } from "@/lib/validation";

interface Props {
	form: UseFormReturn<PasswordResetSchema>;
	onSubmit: (values: PasswordResetSchema) => Promise<void>;
}

export function PasswordResetForm({ form, onSubmit }: Props) {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = form;

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="password">新しいパスワード</Label>
				<Input
					id="password"
					type="password"
					placeholder="Enter your new password"
					{...register("newPassword")}
				/>
				{errors.newPassword && (
					<p className="text-sm text-red-500">{errors.newPassword.message}</p>
				)}
			</div>
			<Button type="submit" disabled={isSubmitting} className="w-full">
				{isSubmitting ? "更新中..." : "パスワードを更新"}
			</Button>
		</form>
	);
}
