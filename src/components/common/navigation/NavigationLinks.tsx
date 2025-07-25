"use client";

import Link from "next/link";
import { FiLogIn, FiLogOut, FiUser } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { event } from "@/lib/gtag";
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
	const { user, loading, logout, isGuestUser } = useAuth();
	const { toast } = useToast();
	const router = useRouter();

	const handleLogout = async () => {
		try {
			event({
				action: "click",
				category: "Navigation",
				label: "ログアウト",
			});

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
			? "inline-flex items-center h-10 text-sm text-kuralis-500 hover:text-kuralis-900 transition-colors duration-300 font-medium tracking-tighter-custom"
			: "block text-lg text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 font-medium tracking-tighter-custom";

	if (loading) {
		return variant === "desktop" ? (
			<div className="w-64 h-10 bg-gray-200 rounded-sm animate-pulse mx-auto" />
		) : null;
	}

	if (!user) {
		return (
			<>
				<Link
					href="/about"
					className={linkClassName}
					onClick={() => {
						event({ action: "click", category: "Navigation", label: "アプリについて" });
						onLinkClick?.();
					}}
				>
					アプリについて
				</Link>
				<Link
					href="/contact"
					className={linkClassName}
					onClick={() => {
						event({ action: "click", category: "Navigation", label: "お問い合わせ" });
						onLinkClick?.();
					}}
				>
					お問い合わせ
				</Link>
				<Link
					href="/auth/login"
					className={linkClassName}
					onClick={() => {
						event({ action: "click", category: "Navigation", label: "ログイン" });
						onLinkClick?.();
					}}
				>
					<FiLogIn className="inline mr-2" />
					ログイン
				</Link>
			</>
		);
	}

	if (variant === "mobile") {
		return (
			<>
				<Link
					href="/furniture"
					className={linkClassName}
					onClick={() => {
						event({ action: "click", category: "Navigation", label: "家具一覧" });
						onLinkClick?.();
					}}
				>
					家具一覧
				</Link>
				<Link
					href="/maintenance"
					className={linkClassName}
					onClick={() => {
						event({
							action: "click",
							category: "Navigation",
							label: "メンテナンス予定",
						});
						onLinkClick?.();
					}}
				>
					メンテナンス予定
				</Link>
				<Link
					href="/settings"
					className={linkClassName}
					onClick={() => {
						event({ action: "click", category: "Navigation", label: "設定" });
						onLinkClick?.();
					}}
				>
					設定
				</Link>
				<Link
					href="/about"
					className={linkClassName}
					onClick={() => {
						event({ action: "click", category: "Navigation", label: "アプリについて" });
						onLinkClick?.();
					}}
				>
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
			<Link
				href="/furniture"
				className={linkClassName}
				onClick={() =>
					event({ action: "click", category: "Navigation", label: "家具一覧" })
				}
			>
				家具一覧
			</Link>
			<Link
				href="/maintenance"
				className={linkClassName}
				onClick={() =>
					event({ action: "click", category: "Navigation", label: "メンテナンス予定" })
				}
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
						{isGuestUser ? "ゲストユーザー" : user.email}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-40 font-medium">
					<DropdownMenuItem
						onClick={() => {
							event({ action: "click", category: "Navigation", label: "設定" });
							router.push("/settings");
						}}
					>
						設定
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							event({
								action: "click",
								category: "Navigation",
								label: "アプリについて",
							});
							router.push("/about");
						}}
					>
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
