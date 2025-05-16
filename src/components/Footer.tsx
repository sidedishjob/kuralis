"use client";

import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
	return (
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
	);
};

export default Footer;
