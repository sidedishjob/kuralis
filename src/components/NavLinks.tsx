"use client";

import Link from "next/link";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

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
			<Link
				href="/furniture"
				className="text-sm text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 font-bold tracking-tighter-custom"
			>
				Collection
			</Link>
			<Link
				href="/maintenance"
				className="text-sm text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 font-bold tracking-tighter-custom"
			>
				Maintenance
			</Link>
			<Link
				href="/settings"
				className="text-sm text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 font-bold tracking-tighter-custom"
			>
				Settings
			</Link>
			<Link
				href="/about"
				className="text-sm text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 font-bold tracking-tighter-custom"
			>
				About
			</Link>
			{loading ? (
				<div className="w-24 h-4 bg-gray-200 rounded-sm animate-pulse mx-auto" />
			) : user ? (
				<button
					onClick={handleLogout}
					className="w-24 text-sm text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 font-bold tracking-tighter-custom flex items-center"
				>
					<FiLogOut className="mr-2" />
					ログアウト
				</button>
			) : (
				<Link
					href="/auth/login"
					className="text-sm text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 font-bold tracking-tighter-custom flex items-center"
				>
					<FiLogIn className="mr-2" />
					ログイン
				</Link>
			)}
		</>
	);
}
