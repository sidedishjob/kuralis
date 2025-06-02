"use client";

import Link from "next/link";
import { FiLogIn, FiLogOut, FiUser } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

export default function NavLinks() {
	const { user, loading, logout } = useAuth();
	const { toast } = useToast();
	const router = useRouter();

	const handleLogout = async () => {
		try {
			await logout();
			toast({ title: "ログアウトしました" });
			router.push("/");
		} catch (error: any) {
			console.error("Error loging out:", error.message);
		}
	};

	return (
		<>
			{loading ? (
				<div className="w-64 h-10 bg-gray-200 rounded-sm animate-pulse mx-auto" />
			) : user ? (
				<>
					<Link
						href="/furniture"
						className="inline-flex items-center h-10 text-sm text-kuralis-500 hover:text-kuralis-900 transition-colors duration-300 tracking-tighter-custom"
					>
						家具一覧
					</Link>
					<Link
						href="/maintenance"
						className="inline-flex items-center h-10 text-sm text-kuralis-500 hover:text-kuralis-900 transition-colors duration-300 tracking-tighter-custom"
					>
						メンテナンス予定
					</Link>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="text-sm text-kuralis-500 hover:text-kuralis-900"
							>
								<FiUser />
								{user.email}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-40">
							<DropdownMenuItem onClick={() => router.push("/settings")}>
								設定
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => router.push("/about")}>
								アプリについて
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => handleLogout()}>
								<FiLogOut className="mr-2" />
								ログアウト
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</>
			) : (
				<>
					<Link
						href="/about"
						className="inline-flex items-center h-10 text-sm text-kuralis-500 hover:text-kuralis-900 transition-colors duration-300 tracking-tighter-custom"
					>
						アプリについて
					</Link>
					<Link
						href="/auth/login"
						className="inline-flex items-center h-10 text-sm text-kuralis-500 hover:text-kuralis-900 transition-colors duration-300 tracking-tighter-custom"
					>
						<FiLogIn className="mr-2" />
						ログイン
					</Link>
				</>
			)}
		</>
	);
}
