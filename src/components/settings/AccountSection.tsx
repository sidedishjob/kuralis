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
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export const AccountSection = () => {
	const [open, setOpen] = useState(false);
	const router = useRouter();

	const handleDelete = async () => {
		const { error } = await supabase.auth.admin.deleteUser(
			(await supabase.auth.getUser()).data.user?.id || ""
		);

		if (error) {
			alert("削除に失敗しました");
			return;
		}

		router.push("/goodbye");
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base text-neutral-900 dark:text-neutral-100">
					アカウントの削除
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<p className="text-sm text-neutral-600 dark:text-neutral-400">
					アカウントを削除すると、家具の記録やメンテナンス履歴を含め、すべてのデータが完全に削除されます。
					この操作は元に戻せません。
				</p>

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
							<Button variant="destructive" onClick={handleDelete}>
								削除する
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</CardContent>
		</Card>
	);
};
