"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX, FiLogIn, FiLogOut } from "react-icons/fi";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const pathname = usePathname();
	const isHomePage = pathname === "/";
	const { user, signOut } = useAuth();
	const { toast } = useToast();

	const handleSignOut = async () => {
		try {
			await signOut();
			toast({
				title: "サインアウトしました",
			});
		} catch (error: any) {
			console.error("Error signing out:", error.message);
		}
	};

	return (
		<div className="min-h-screen bg-white text-kuralis-900 flex flex-col">
			<header
				className={`py-6 px-6 md:px-12 transition-all duration-400 ease-natural
				${isHomePage ? "bg-transparent" : "bg-white border-b border-kuralis-200"}`}
			>
				<div className="container mx-auto flex justify-between items-center">
					<Link href="/" className="text-xl font-bold tracking-tighter-custom">
						kuralis
					</Link>
					<nav className="hidden md:flex space-x-8">
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
					</nav>
					<Sheet>
						<SheetTrigger asChild>
							<button className="md:hidden text-kuralis-700 hover:text-kuralis-900 transition-colors duration-300">
								<FiMenu size={20} />
							</button>
						</SheetTrigger>
						<SheetContent side="right" className="w-full max-w-xs p-0">
							<div className="flex flex-col h-full">
								<div className="p-6 border-b border-kuralis-100">
									<Link
										href="/"
										className="text-xl font-bold tracking-tighter-custom"
									>
										kuralis
									</Link>
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
										{user ? (
											<SheetClose asChild>
												<button
													onClick={handleSignOut}
													className="block text-lg text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 font-bold tracking-tighter-custom"
												>
													サインアウト
												</button>
											</SheetClose>
										) : (
											<SheetClose asChild>
												<Link
													href="/signin"
													className="block text-lg text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 font-bold tracking-tighter-custom"
												>
													サインイン
												</Link>
											</SheetClose>
										)}
									</div>
								</nav>
								<div className="p-6 border-t border-kuralis-100">
									<p className="text-xs text-kuralis-500">
										© {new Date().getFullYear()} kuralis
									</p>
								</div>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</header>

			<main className="flex-grow">{children}</main>

			<footer className="py-8 px-6 md:px-12 text-kuralis-500 text-xs font-normal tracking-tighter-custom border-t border-kuralis-200">
				<div className="container mx-auto">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
						<p>© {new Date().getFullYear()} kuralis</p>
						<div className="flex items-center space-x-6">
							<Link
								href="/terms"
								className="hover:text-kuralis-900 transition-colors duration-300"
							>
								利用規約
							</Link>
							<Link
								href="/privacy"
								className="hover:text-kuralis-900 transition-colors duration-300"
							>
								プライバシーポリシー
							</Link>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Layout;
