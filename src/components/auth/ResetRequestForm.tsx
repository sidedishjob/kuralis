"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Props {
	email: string;
	setEmail: (value: string) => void;
	loading: boolean;
	handleReset: () => void;
}

export function ResetRequestForm({ email, setEmail, loading, handleReset }: Props) {
	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle className="text-center text-2xl">パスワードをリセット</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="email">メールアドレス</Label>
						<Input
							id="email"
							type="email"
							placeholder="your@email.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<Button onClick={handleReset} disabled={!email || loading} className="w-full">
						{loading ? "送信中..." : "リセットリンクを送信"}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
