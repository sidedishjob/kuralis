"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { loginSchema, type LoginSchema } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/constants/icons";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [authError, setAuthError] = useState<string | null>(null);

	// react-hook-form 初期化
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });

	// メール+パスワードログイン
	const onSubmit = async ({ email, password }: LoginSchema) => {
		setLoading(true);
		setAuthError(null);

		const { error } = await supabase.auth.signInWithPassword({ email, password });

		if (error) {
			setAuthError("メールアドレスまたはパスワードが違います");
			setLoading(false);
		} else {
			router.push("/furniture");
		}
	};

	// Googleログイン
	const handleGoogleLogIn = async () => {
		await supabase.auth.signInWithOAuth({ provider: "google" });
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">おかえりなさい</CardTitle>
					<CardDescription>Googleアカウントまたはメールでログイン</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-6">
						<div className="flex flex-col gap-4">
							<Button
								variant="outline"
								className="w-full"
								onClick={handleGoogleLogIn}
							>
								<Icons.google className="mr-2 h-5 w-5 text-neutral-700" />
								Googleでログイン
							</Button>
						</div>

						<div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
							<span className="bg-card text-muted-foreground relative z-10 px-2">
								またはメールでログイン
							</span>
						</div>

						<form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
							<div className="grid gap-3">
								<Label htmlFor="email">メールアドレス</Label>
								<Input
									id="email"
									type="email"
									placeholder="Enter your email"
									{...register("email")}
								/>
								{errors.email && (
									<p className="text-sm text-red-500">{errors.email.message}</p>
								)}
							</div>

							<div className="grid gap-3">
								<div className="flex items-center">
									<Label htmlFor="password">パスワード</Label>
									<Link
										href="/auth/reset-request"
										className="ml-auto text-xs font-light text-muted-foreground underline-offset-4 hover:underline "
										tabIndex={-1}
									>
										パスワードをお忘れですか？
									</Link>
								</div>
								<Input
									id="password"
									type="password"
									placeholder="Enter your password"
									{...register("password", { required: "パスワードは必須です" })}
									// required
								/>
								{errors.password && (
									<p className="text-sm text-red-500">
										{errors.password.message}
									</p>
								)}
							</div>

							{authError && <p className="text-sm text-red-500">{authError}</p>}

							<Button type="submit" className="w-full" disabled={loading}>
								{loading ? "ログイン中..." : "ログイン"}
							</Button>
						</form>

						<div className="text-center text-sm">
							アカウントをお持ちでないですか？
							<Link href="/auth/signup" className="underline underline-offset-4">
								サインアップ
							</Link>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="text-muted-foreground text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
				ログインを続行することで、
				<Link href="/terms">利用規約</Link>と
				<Link href="/privacy">プライバシーポリシー</Link>
				に同意したものとみなされます。
			</div>
		</div>
	);
}
