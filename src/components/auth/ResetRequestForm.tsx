"use client";

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
	);
}
