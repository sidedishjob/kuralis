"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function LoginPage() {
	const { user, loading } = useAuth();
	useAuthRedirect();
	if (loading || user) return null;
	return (
		<div className="flex flex-col items-center justify-center gap-6 p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<LoginForm />
			</div>
		</div>
	);
}
