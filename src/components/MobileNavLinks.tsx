"use client";

import Link from "next/link";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const MobileNavLinks = () => {
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
					<SheetClose asChild>
						<Link
							href="/furniture"
							className="block text-lg text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 font-bold tracking-tighter-custom"
						>
							Collection
						</Link>
					</SheetClose>
					<SheetClose asChild>
						<Link
							href="/maintenance"
							className="block text-lg text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 font-bold tracking-tighter-custom"
						>
							Maintenance
						</Link>
					</SheetClose>
					<SheetClose asChild>
						<Link
							href="/about"
							className="block text-lg text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 font-bold tracking-tighter-custom"
						>
							About
						</Link>
					</SheetClose>
					<SheetClose asChild>
						{user ? (
							<button
								onClick={handleSignOut}
								className="block text-lg text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 font-bold tracking-tighter-custom"
							>
								サインアウト
							</button>
						) : (
							<Link
								href="/signin"
								className="block text-lg text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 font-bold tracking-tighter-custom"
							>
								<FiLogIn className="mr-2" />
								サインイン
							</Link>
						)}
					</SheetClose>
				</div>
			</nav>

			<div className="p-6 border-t border-kuralis-100">
				<p className="text-xs text-kuralis-500">© {new Date().getFullYear()} kuralis</p>
			</div>
		</div>
	);
};

export default MobileNavLinks;
