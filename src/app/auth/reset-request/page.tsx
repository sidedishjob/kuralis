"use client";

import { ResetRequestForm } from "@/components/auth/ResetRequestForm";
import { useResetRequestPage } from "@/hooks/useResetRequestPage";

export default function ResetRequestPage() {
	const { email, setEmail, loading, handleReset } = useResetRequestPage();

	return (
		<div className="flex items-center justify-center p-16">
			<ResetRequestForm
				email={email}
				setEmail={setEmail}
				loading={loading}
				handleReset={handleReset}
			/>
		</div>
	);
}
