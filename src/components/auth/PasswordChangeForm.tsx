"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase/client";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { passwordChangeSchema, type PasswordChangeSchema } from "@/lib/validation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";

export default function PasswordChangeForm() {
	const { toast } = useToast();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<PasswordChangeSchema>({
		resolver: zodResolver(passwordChangeSchema),
	});

	const onSubmit = async (data: PasswordChangeSchema) => {
		// 再認証
		const { data: userData } = await supabase.auth.getUser();
		const email = userData.user?.email ?? "";

		const { error: signInError } = await supabase.auth.signInWithPassword({
			email,
			password: data.currentPassword,
		});

		if (signInError) {
			toast({
				title: "認証に失敗しました",
				description: getErrorMessage(signInError, "現在のパスワードが正しくありません"),
				variant: "destructive",
			});
			return;
		}

		// パスワード変更
		const { error } = await supabase.auth.updateUser({
			password: data.newPassword,
		});

		if (error) {
			toast({
				title: "パスワードの変更に失敗しました",
				description: getErrorMessage(error, "もう一度お試しください"),
				variant: "destructive",
			});
		} else {
			toast({
				title: "パスワードを更新しました。",
				description: "次回のログインから新しいパスワードをご使用ください",
			});
			reset();
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div>
				<Label htmlFor="currentPassword">現在のパスワード</Label>
				<Input type="password" id="currentPassword" {...register("currentPassword")} />
				{errors.currentPassword && (
					<p className="text-sm text-red-500 mt-1">{errors.currentPassword.message}</p>
				)}
			</div>

			<div>
				<Label htmlFor="newPassword">新しいパスワード</Label>
				<Input type="password" id="newPassword" {...register("newPassword")} />
				{errors.newPassword && (
					<p className="text-sm text-red-500 mt-1">{errors.newPassword.message}</p>
				)}
			</div>

			<div>
				<Label htmlFor="confirmPassword">新しいパスワード（確認）</Label>
				<Input type="password" id="confirmPassword" {...register("confirmPassword")} />
				{errors.confirmPassword && (
					<p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
				)}
			</div>

			<Button type="submit" className="w-full" disabled={isSubmitting}>
				{isSubmitting ? "更新中..." : "パスワードを更新"}
			</Button>
		</form>
	);
}
