"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const schema = z
	.object({
		currentPassword: z.string().min(6, "現在のパスワードを入力してください"),
		newPassword: z
			.string()
			.min(6, "6文字以上で入力してください")
			.regex(/[a-z]/, "小文字を含めてください")
			// .regex(/[A-Z]/, "大文字を含めてください")
			.regex(/[0-9]/, "数字を含めてください"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "パスワードが一致しません",
		path: ["confirmPassword"],
	});

type FormData = z.infer<typeof schema>;

export default function ChangePasswordPage() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<FormData>({
		resolver: zodResolver(schema),
	});

	const { toast } = useToast();

	const onSubmit = async (data: FormData) => {
		// Supabaseでは現在のパスワードを確認するAPIはないため、ワークアラウンドが必要
		// 1. Re-authenticate (sign in again)
		const { error: signInError } = await supabase.auth.signInWithPassword({
			email: (await supabase.auth.getUser()).data.user?.email || "",
			password: data.currentPassword,
		});

		if (signInError) {
			toast({
				title: "認証失敗",
				description: "現在のパスワードが正しくありません",
				variant: "destructive",
			});
			return;
		}

		// 2. 新しいパスワードへ変更
		const { error } = await supabase.auth.updateUser({ password: data.newPassword });

		if (error) {
			toast({
				title: "エラー",
				description: "パスワードの変更に失敗しました",
				variant: "destructive",
			});
		} else {
			toast({
				title: "成功",
				description: "パスワードを変更しました",
			});
			reset();
		}
	};

	return (
		<div className="max-w-md mx-auto py-12 px-4">
			<h1 className="text-2xl font-bold mb-6">パスワードを変更</h1>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				<div>
					<Label htmlFor="currentPassword">現在のパスワード</Label>
					<Input type="password" id="currentPassword" {...register("currentPassword")} />
					{errors.currentPassword && (
						<p className="text-sm text-red-500 mt-1">
							{errors.currentPassword.message}
						</p>
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
						<p className="text-sm text-red-500 mt-1">
							{errors.confirmPassword.message}
						</p>
					)}
				</div>

				<Button type="submit" disabled={isSubmitting} className="w-full">
					{isSubmitting ? "更新中..." : "パスワードを更新"}
				</Button>
			</form>
		</div>
	);
}
