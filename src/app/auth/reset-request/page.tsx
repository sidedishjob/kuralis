"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import { Label } from "@/components/ui/label";

export default function ResetRequestPage() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();

	// パスワードリセットリンクを送信する処理
	const handleReset = async () => {
		setLoading(true);
		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${window.location.origin}/auth/reset-password`,
		});
		setLoading(false);

		if (error) {
			toast({
				title: "送信エラー",
				description: error.message,
				variant: "destructive",
			});
		} else {
			toast({
				title: "メール送信済み",
				description: "パスワード再設定用のリンクを送信しました",
			});
		}
	};

	return (
		<div className="flex-grow flex items-center justify-center p-16">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-center text-2xl">パスワードをリセット</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">メールアドレス</Label>
							<Input
								id="email"
								type="email"
								placeholder="your@email.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<Button
							onClick={handleReset}
							disabled={!email || loading}
							className="w-full"
						>
							{loading ? "送信中..." : "リセットリンクを送信"}
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
