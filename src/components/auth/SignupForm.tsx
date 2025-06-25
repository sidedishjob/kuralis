"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { signupSchema, type SignupSchema } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loadingButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/constants/icons";

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
	const [isLoading, setIsLoading] = useState(false);
	const [authError, setAuthError] = useState<string | null>(null);
	const [message, setMessage] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignupSchema>({
		resolver: zodResolver(signupSchema),
	});

	const onSubmit = async (data: SignupSchema) => {
		setIsLoading(true);
		setAuthError(null);
		setMessage(null);

		const { error } = await supabase.auth.signUp({
			email: data.email,
			password: data.password,
			options: {
				emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
			},
		});

		setIsLoading(false);

		if (error) {
			setAuthError(error.message);
		} else {
			setMessage("確認メールを送信しました。メールをご確認ください。");
			//TODO サインアップ後、家具一覧ページに遷移させるかは要検討
		}
	};

	const handleGoogleSignup = async () => {
		await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
			},
		});
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

						<div className="after:border-border relative text-center text-xs after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
							<span className="bg-card text-muted-foreground relative z-10 px-2">
								またはメールで登録
							</span>
						</div>

						<form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
							<div className="grid gap-3">
								<Label htmlFor="email">メールアドレス</Label>
								<Input
									id="email"
									type="email"
									placeholder="kuralis@example.com"
									{...register("email")}
								/>
								{errors.email && (
									<p className="text-sm text-red-500">{errors.email.message}</p>
								)}
							</div>

							<div className="grid gap-3">
								<Label htmlFor="password">パスワード</Label>
								<Input
									id="password"
									type="password"
									placeholder="6文字以上の半角英数字"
									{...register("password")}
								/>
								{errors.password && (
									<p className="text-sm text-red-500">
										{errors.password.message}
									</p>
								)}
							</div>

							{authError && <p className="text-sm text-red-500">{authError}</p>}
							{message && <p className="text-sm text-green-600">{message}</p>}

							<LoadingButton
								type="submit"
								isLoading={isLoading}
								loadingText="登録中..."
							>
								登録する
							</LoadingButton>
						</form>

						<div className="text-center text-xs">
							すでにアカウントをお持ちですか？
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
