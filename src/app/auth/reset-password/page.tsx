"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
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
	const { logout, user, loading: authLoading } = useAuth();
	const [newPassword, setNewPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [pageState, setPageState] = useState<PageState>(PageState.Loading);
	const { toast } = useToast();
	const router = useRouter();

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

	// トーストユーティリティ
	const showError = (description: string) =>
		toast({ title: "エラー", description, variant: "destructive" });
	const showSuccess = (description: string) =>
		toast({ title: "パスワードを更新しました", description });

	// パスワード更新処理
	const handlePasswordReset = async () => {
		if (!newPassword || newPassword.length < 6) {
			showError("パスワードは6文字以上で入力してください");
			return;
		}

		setLoading(true);

		const { error } = await supabase.auth.updateUser({ password: newPassword });

		setLoading(false);

		if (error) {
			showError(error.message);
		} else {
			showSuccess("新しいパスワードで再度ログインしてください");
			await logout();
			router.push("/auth/login");
		}
	};

	// 認証済みの場合のみフォームを表示
	// loading 状態でも全体のレイアウトを維持することで画面のちらつきを防止
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
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="password">新しいパスワード</Label>
								<Input
									id="password"
									type="password"
									placeholder="6文字以上"
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
								/>
							</div>
							<Button
								onClick={handlePasswordReset}
								disabled={loading}
								className="w-full"
							>
								{loading ? "更新中..." : "パスワードを更新"}
							</Button>
						</div>
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
