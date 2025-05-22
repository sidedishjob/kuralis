"use client";

import Link from "next/link";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const NavLinks = () => {
	const { user, logout } = useAuth();
	const { toast } = useToast();

	const handleLogout = async () => {
		try {
			await logout();
			toast({ title: "ログアウトしました" });
		} catch (error: any) {
			console.error("Error loging out:", error.message);
		}
	};

	if (typeof user === "undefined") {
		return null;
	}
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
			{user ? (
				<button
					onClick={handleLogout}
					className="text-sm text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 font-bold tracking-tighter-custom flex items-center"
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
};

export default NavLinks;
