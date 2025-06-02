"use client";

import Link from "next/link";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRouter } from "next/navigation";

export default function MobileNavLinks() {
	const { user, logout } = useAuth();
	const { toast } = useToast();
	const router = useRouter();

	const handleLogout = async () => {
		try {
			await logout();
			toast({ title: "ログアウトしました" });
			router.push("/");
		} catch (error: any) {
			console.error("Error logging out:", error.message);
		}
	};

	return (
		<div className="flex flex-col h-full">
			{/* SheetHeader + SheetTitle（アクセシビリティ対応） */}
			<div className="p-6 border-b border-kuralis-100">
				<SheetHeader>
					<VisuallyHidden>
						<SheetTitle className="text-xl font-bold tracking-tighter-custom">
							kuralis メニュー
						</SheetTitle>
					</VisuallyHidden>
				</SheetHeader>
			</div>

			<nav className="flex-1 p-6">
				<div className="space-y-6">
					{user && (
						<>
							<SheetClose asChild>
								<Link
									href="/furniture"
									className="block text-lg text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 font-bold tracking-tighter-custom"
								>
									家具一覧
								</Link>
							</SheetClose>
							<SheetClose asChild>
								<Link
									href="/maintenance"
									className="block text-lg text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 font-bold tracking-tighter-custom"
								>
									メンテナンス予定
								</Link>
							</SheetClose>
							<SheetClose asChild>
								<Link
									href="/settings"
									className="block text-lg text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 font-bold tracking-tighter-custom"
								>
									設定
								</Link>
							</SheetClose>
							<SheetClose asChild>
								<Link
									href="/about"
									className="block text-lg text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 font-bold tracking-tighter-custom"
								>
									アプリについて
								</Link>
							</SheetClose>
							<SheetClose asChild>
								<button
									onClick={handleLogout}
									className="flex items-center text-lg text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 font-bold tracking-tighter-custom"
								>
									<FiLogOut className="mr-2" />
									ログアウト
								</button>
							</SheetClose>
						</>
					)}

					{!user && (
						<>
							<SheetClose asChild>
								<Link
									href="/about"
									className="block text-lg text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 font-bold tracking-tighter-custom"
								>
									アプリについて
								</Link>
							</SheetClose>
							<SheetClose asChild>
								<Link
									href="/auth/login"
									className="flex items-center text-lg text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 font-bold tracking-tighter-custom"
									// className="flex items-center h-10 px-2 text-lg text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 font-bold tracking-tighter-custom"
								>
									<FiLogIn className="mr-2" />
									ログイン
								</Link>
							</SheetClose>
						</>
					)}
				</div>
			</nav>

			<div className="p-6 border-t border-kuralis-100">
				<p className="text-xs text-kuralis-500">© {new Date().getFullYear()} kuralis</p>
			</div>
		</div>
	);
}
