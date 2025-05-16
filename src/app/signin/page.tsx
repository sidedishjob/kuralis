"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function SignInPage() {
	const router = useRouter();
	const { user } = useAuth();

	useEffect(() => {
		if (user) router.push("/furniture");
	}, [user, router]);

	return (
		<div className="min-h-screen flex flex-col">
			<div className="flex-grow flex items-center justify-center p-6">
				<div className="w-full max-w-sm space-y-8">
					<div className="text-center">
						<h1 className="text-2xl font-bold tracking-tighter-custom">
							おかえりなさい
						</h1>
						<p className="mt-2 text-sm text-kuralis-600 mb-8">
							アカウントにサインインして、コレクションを管理しましょう。
						</p>
						<Link
							href="/signup"
							className="inline-flex items-center text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 group font-normal tracking-tighter-custom"
						>
							<span>未登録の方はこちら</span>
							<FiArrowRight
								size={16}
								className="ml-2 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-400 ease-natural"
							/>
						</Link>
					</div>
					<Auth
						supabaseClient={supabase}
						appearance={{ theme: ThemeSupa }}
						view="sign_in"
						localization={{
							variables: {
								sign_in: {
									email_label: "メールアドレス",
									password_label: "パスワード",
									button_label: "サインイン",
									loading_button_label: "サインイン中...",
									email_input_placeholder: "メールアドレスを入力",
									password_input_placeholder: "パスワードを入力",
								},
							},
						}}
						providers={[]}
					/>
				</div>
			</div>
		</div>
	);
}
