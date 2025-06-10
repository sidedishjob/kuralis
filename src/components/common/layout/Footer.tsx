"use client";

import React from "react";

export function Footer() {
	return (
		<footer className="py-8 px-6 md:px-12 text-kuralis-500 text-xs font-normal tracking-tighter-custom border-t border-kuralis-200">
			<div className="container mx-auto">
				<p>© {new Date().getFullYear()} kuralis</p>
			</div>
		</footer>
	);
}
