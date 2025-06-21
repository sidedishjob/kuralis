"use client";

import React from "react";

export function Footer() {
	return (
		<footer className="py-8 px-6 md:px-12 text-kuralis-500 text-xs tracking-tighter-custom border-t border-kuralis-200">
			<div className="container mx-auto">
				<p className="text-xs text-kuralis-500 mt-6">
					&copy; {new Date().getFullYear()} kuralis. All rights reserved.
				</p>
			</div>
		</footer>
	);
}
