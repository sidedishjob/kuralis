"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResetRequestForm } from "@/components/auth/ResetRequestForm";
import { useResetRequestPage } from "@/hooks/useResetRequestPage";

export default function ResetRequestPage() {
	const { email, setEmail, loading, handleReset } = useResetRequestPage();

	return (
		<div className="flex-grow flex items-center justify-center p-16">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-center text-2xl">パスワードをリセット</CardTitle>
				</CardHeader>
				<CardContent>
					<ResetRequestForm
						email={email}
						setEmail={setEmail}
						loading={loading}
						handleReset={handleReset}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
