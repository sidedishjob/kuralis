"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu } from "react-icons/fi";
import NavLinks from "./NavLinks";
import MobileNavLinks from "./MobileNavLinks";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header: React.FC = () => {
	const pathname = usePathname();
	const isHomePage = pathname === "/";

	return (
		<header
			className={`py-6 px-6 md:px-12 transition-all duration-400 ease-natural ${
				isHomePage ? "bg-transparent" : "bg-white border-b border-kuralis-200"
			}`}
		>
			<div className="container mx-auto flex justify-between items-center">
				<Link href="/" className="text-xl font-bold tracking-tighter-custom">
					kuralis
				</Link>

				{/* デスクトップ */}
				<div className="hidden md:flex space-x-8">
					<NavLinks />
				</div>

				{/* モバイル */}
				<Sheet>
					<SheetTrigger asChild>
						<button className="md:hidden text-kuralis-700 hover:text-kuralis-900 transition-colors duration-300">
							<FiMenu size={20} />
						</button>
					</SheetTrigger>
					<SheetContent side="right" className="w-full max-w-xs p-0">
						<MobileNavLinks />
					</SheetContent>
				</Sheet>
			</div>
		</header>
	);
};

export default Header;
