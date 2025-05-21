"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";

export default function LoginPage() {
	useAuthRedirect();
	return (
		<div className="flex flex-col items-center justify-center gap-6 p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<LoginForm />
			</div>
		</div>
	);
}
