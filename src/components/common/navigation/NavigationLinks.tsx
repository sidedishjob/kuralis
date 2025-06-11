"use client";

import Link from "next/link";
import { FiLogIn, FiLogOut, FiUser } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavigationLinksProps {
	variant?: "desktop" | "mobile";
	onLinkClick?: () => void;
}

export function NavigationLinks({ variant = "desktop", onLinkClick }: NavigationLinksProps) {
	const { user, loading, logout } = useAuth();
	const { toast } = useToast();
	const router = useRouter();

	const handleLogout = async () => {
		try {
			await logout();
			toast({ title: "ログアウトしました" });
			router.push("/");
			onLinkClick?.();
		} catch (error: unknown) {
			console.error("ログアウトエラー:", error);
			toast({
				title: "ログアウトに失敗しました",
				description: getErrorMessage(error, "もう一度お試しください"),
				variant: "destructive",
			});
		}
	};

	const linkClassName =
		variant === "desktop"
			? "inline-flex items-center h-10 text-sm text-kuralis-500 hover:text-kuralis-900 transition-colors duration-300 tracking-tighter-custom"
			: "block text-lg text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 font-bold tracking-tighter-custom";

	if (loading) {
		return variant === "desktop" ? (
			<div className="w-64 h-10 bg-gray-200 rounded-sm animate-pulse mx-auto" />
		) : null;
	}

	if (!user) {
		return (
			<>
				<Link href="/about" className={linkClassName} onClick={onLinkClick}>
					アプリについて
				</Link>
				<Link href="/contact" className={linkClassName} onClick={onLinkClick}>
					お問い合わせ
				</Link>
				<Link href="/auth/login" className={linkClassName} onClick={onLinkClick}>
					<FiLogIn className="inline mr-2" />
					ログイン
				</Link>
			</>
		);
	}

	if (variant === "mobile") {
		return (
			<>
				<Link href="/furniture" className={linkClassName} onClick={onLinkClick}>
					家具一覧
				</Link>
				<Link href="/maintenance" className={linkClassName} onClick={onLinkClick}>
					メンテナンス予定
				</Link>
				<Link href="/settings" className={linkClassName} onClick={onLinkClick}>
					設定
				</Link>
				<Link href="/about" className={linkClassName} onClick={onLinkClick}>
					アプリについて
				</Link>
				<button onClick={handleLogout} className={linkClassName}>
					<FiLogOut className="inline mr-2" />
					ログアウト
				</button>
			</>
		);
	}

	return (
		<>
			<Link href="/furniture" className={linkClassName}>
				家具一覧
			</Link>
			<Link href="/maintenance" className={linkClassName}>
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
					<DropdownMenuItem onClick={handleLogout}>
						<FiLogOut className="mr-2" />
						ログアウト
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
