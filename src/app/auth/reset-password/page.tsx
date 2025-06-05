"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase/client";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { passwordResetSchema, type PasswordResetSchema } from "@/lib/validation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

enum PageState {
	Loading = "loading",
	Authorized = "authorized",
	Unauthorized = "unauthorized",
}

export default function ResetPasswordPage() {
	const router = useRouter();
	const { toast } = useToast();
	const { logout, user, loading: authLoading } = useAuth();
	const [pageState, setPageState] = useState<PageState>(PageState.Loading);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<PasswordResetSchema>({
		resolver: zodResolver(passwordResetSchema),
	});

	// PASSWORD_RECOVERY イベント対応（リロード後の一時セッション復元用）
	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event) => {
			if (event === "PASSWORD_RECOVERY") {
				setPageState(PageState.Authorized);
			}
		});
		return () => subscription.unsubscribe();
	}, []);

	// 初回アクセス時にセッションの有無を確認（マウント直後に実行）
	useEffect(() => {
		if (authLoading) return;

		if (user) {
			setPageState(PageState.Authorized);
		} else {
			router.replace("/auth/reset-request");
			setTimeout(() => {
				toast({
					title: "リンクが無効です",
					description:
						"有効期限が切れているか、すでに使用済みのリンクです。再度リセットを申請してください",
					variant: "destructive",
				});
			}, 100);
		}
	}, [authLoading, user, router, toast]);

	// パスワード更新処理
	const onSubmit = async ({ newPassword }: PasswordResetSchema) => {
		const { error } = await supabase.auth.updateUser({ password: newPassword });

		if (error) {
			toast({
				title: "パスワードの更新に失敗しました",
				description: getErrorMessage(error, "もう一度お試しください"),
				variant: "destructive",
			});
		} else {
			toast({
				title: "パスワードを更新しました",
				description: "新しいパスワードで再度ログインしてください",
			});
			await logout();
			reset();
			router.push("/auth/login");
		}
	};

	return (
		<div className="flex items-center justify-center bg-background p-16">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-center text-2xl">
						{pageState === PageState.Loading
							? "読み込み中..."
							: "新しいパスワードを設定"}
					</CardTitle>
				</CardHeader>
				<CardContent>
					{pageState === PageState.Authorized ? (
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
									<p className="text-sm text-red-500">
										{errors.newPassword.message}
									</p>
								)}
							</div>
							<Button type="submit" disabled={isSubmitting} className="w-full">
								{isSubmitting ? "更新中..." : "パスワードを更新"}
							</Button>
						</form>
					) : pageState === PageState.Loading ? (
						<div className="py-8 text-center text-sm text-muted-foreground">
							認証情報を確認中...
						</div>
					) : null}
				</CardContent>
			</Card>
		</div>
	);
}
