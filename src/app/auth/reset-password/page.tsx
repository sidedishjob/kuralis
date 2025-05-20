"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ResetPasswordPage() {
	const [newPassword, setNewPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [pageState, setPageState] = useState("loading"); // "loading", "authorized", "unauthorized"
	const { toast } = useToast();
	const router = useRouter();

	// 初回アクセス時にセッションの有無を確認（マウント直後に実行）
	useEffect(() => {
		const checkSession = async () => {
			try {
				const { data } = await supabase.auth.getSession();

				// セッションがない場合は即座にリダイレクト
				if (!data?.session) {
					// リダイレクト前にステートを更新しないことで画面のちらつきを防止
					router.replace("/auth/login");
					// 少し遅れてトーストを表示（画面遷移後に表示されるように）
					setTimeout(() => {
						toast({
							title: "リンクが無効です",
							description: "有効期限が切れているか、すでに使用済みのリンクです。",
							variant: "destructive",
						});
					}, 100);
					return;
				}

				// セッションがある場合は authorized に変更
				setPageState("authorized");
			} catch (error) {
				console.error("Session check failed:", error);
				router.replace("/auth/login");
			}
		};

		checkSession();
	}, [router, toast]);

	// PASSWORD_RECOVERY イベント対応（リロード後の一時セッション復元用）
	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event) => {
			if (event === "PASSWORD_RECOVERY") {
				setPageState("authorized");
			}
		});
		return () => subscription.unsubscribe();
	}, []);

	// パスワード更新処理
	const handlePasswordReset = async () => {
		if (!newPassword || newPassword.length < 6) {
			toast({
				title: "エラー",
				description: "パスワードは6文字以上で入力してください。",
				variant: "destructive",
			});
			return;
		}

		setLoading(true);

		const { error } = await supabase.auth.updateUser({ password: newPassword });

		setLoading(false);

		if (error) {
			toast({
				title: "更新失敗",
				description: error.message,
				variant: "destructive",
			});
		} else {
			toast({
				title: "パスワードを更新しました",
				description: "新しいパスワードで再度ログインしてください",
			});
			await supabase.auth.signOut(); // セッション破棄
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
						{pageState === "loading" ? "読み込み中..." : "新しいパスワードを設定"}
					</CardTitle>
				</CardHeader>
				<CardContent>
					{pageState === "authorized" ? (
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="password">新しいパスワード</Label>
								<Input
									id="password"
									type="password"
									placeholder="8文字以上"
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
