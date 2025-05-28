"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiGoogle } from "react-icons/si";
import Link from "next/link";

export const Icons = {
	google: SiGoogle,
};

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [message, setMessage] = useState<string | null>(null);

	const handleSignup = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setMessage(null);

		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${location.origin}/auth/callback`, // 確認メールリンク（必要に応じて）
			},
		});
		setLoading(false);

		if (error) {
			setError(error.message);
		} else {
			setMessage("確認メールを送信しました。メールをご確認ください。");
		}
	};

	const handleGoogleSignup = async () => {
		await supabase.auth.signInWithOAuth({ provider: "google" });
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">アカウントを作成</CardTitle>
					<CardDescription>Googleまたはメールアドレスで登録</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-6">
						<Button variant="outline" className="w-full" onClick={handleGoogleSignup}>
							<Icons.google className="mr-2 h-5 w-5 text-neutral-700" />
							Googleで登録
						</Button>

						<div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
							<span className="bg-card text-muted-foreground relative z-10 px-2">
								またはメールで登録
							</span>
						</div>

						<form onSubmit={handleSignup} className="grid gap-6">
							<div className="grid gap-3">
								<Label htmlFor="email">メールアドレス</Label>
								<Input
									id="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="Enter your email"
									required
								/>
							</div>

							<div className="grid gap-3">
								<Label htmlFor="password">パスワード</Label>
								<Input
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Enter your password"
									required
								/>
							</div>

							{error && <p className="text-sm text-red-500">{error}</p>}
							{message && <p className="text-sm text-green-600">{message}</p>}

							<Button type="submit" className="w-full" disabled={loading}>
								{loading ? "登録中..." : "サインアップ"}
							</Button>
						</form>

						<div className="text-center text-sm">
							すでにアカウントをお持ちですか？{" "}
							<Link href="/auth/login" className="underline underline-offset-4">
								ログイン
							</Link>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
