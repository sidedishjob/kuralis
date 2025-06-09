"use client";

import { PasswordResetForm } from "@/components/auth/PasswordResetForm";
import { usePasswordResetPage } from "@/hooks/usePasswordResetPage";

export default function ResetPasswordPage() {
	const { pageState, form, onSubmit } = usePasswordResetPage();

	return (
		<div className="flex items-center justify-center p-16">
			<PasswordResetForm pageState={pageState} form={form} onSubmit={onSubmit} />
		</div>
	);
}
