"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/hooks/useToast";
import PasswordChangeForm from "@/components/auth/PasswordChangeForm";
import { FiUser } from "react-icons/fi";

export const AccountSection = () => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [isGoogleUser, setIsGoogleUser] = useState(false);
	const router = useRouter();

	const { toast } = useToast();

	useEffect(() => {
		const checkProvider = async () => {
			const { data } = await supabase.auth.getUser();
			setIsGoogleUser(data.user?.app_metadata.provider === "google");
		};
		checkProvider();
	}, []);

	const handleDelete = async () => {
		setLoading(true);
		const res = await fetch("/api/delete-user", { method: "POST" });
		if (!res.ok) {
			alert("削除に失敗しました");
			setLoading(false);
			return;
		}
		await supabase.auth.signOut();
		setLoading(false);

		toast({
			title: "アカウント削除完了しました",
			description: "ご利用ありがとうございました。家具との記録はすべて削除されました。",
		});

		router.push("/");
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center">
					<FiUser className="w-5 h-5 mr-1" />
					アカウント
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4 flex justify-between">
				{!isGoogleUser && (
					<div className="space-y-4">
						<h4 className="text-sm font-medium text-muted-foreground">
							パスワードの変更
						</h4>
						<PasswordChangeForm />
					</div>
				)}
			</CardContent>

			<CardContent className="space-y-4">
				<div className="space-y-4">
					<h4 className="text-sm font-medium text-muted-foreground">アカウント削除</h4>
					<Dialog open={open} onOpenChange={setOpen}>
						<DialogTrigger asChild>
							<Button variant="destructive">アカウントを削除</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>本当にアカウントを削除しますか？</DialogTitle>
								<DialogDescription>
									すべてのデータが完全に削除され、元に戻すことはできません。
								</DialogDescription>
							</DialogHeader>
							<DialogFooter>
								<Button variant="outline" onClick={() => setOpen(false)}>
									キャンセル
								</Button>
								<Button
									variant="destructive"
									onClick={handleDelete}
									disabled={loading}
								>
									{loading ? "削除中..." : "削除する"}
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</CardContent>
		</Card>
	);
};
