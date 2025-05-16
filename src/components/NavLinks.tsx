"use client";

import Link from "next/link";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const NavLinks = () => {
	const { user, signOut } = useAuth();
	const { toast } = useToast();

	const handleSignOut = async () => {
		try {
			await signOut();
			toast({ title: "サインアウトしました" });
		} catch (error: any) {
			console.error("Error signing out:", error.message);
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
				href="/about"
				className="text-sm text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 font-bold tracking-tighter-custom"
			>
				About
			</Link>
			{user ? (
				<button
					onClick={handleSignOut}
					className="text-sm text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 font-bold tracking-tighter-custom flex items-center"
				>
					<FiLogOut className="mr-2" />
					サインアウト
				</button>
			) : (
				<Link
					href="/signin"
					className="text-sm text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 font-bold tracking-tighter-custom flex items-center"
				>
					<FiLogIn className="mr-2" />
					サインイン
				</Link>
			)}
		</>
	);
};

export default NavLinks;
