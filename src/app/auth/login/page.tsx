"use client";

import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import AuthForm from "./AuthForm";

export default function LoginPage() {
	useAuthRedirect();
	return <AuthForm />;
}
