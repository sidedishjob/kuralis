"use client";

import React from "react";

interface DemoViewProps {
	children: React.ReactNode;
}

export function DemoView({ children }: DemoViewProps) {
	return (
		<div className="relative">
			<div className="absolute inset-0 bg-black/50 flex items-center justify-center">
				<span className="text-white text-sm font-bold">デモ表示</span>
			</div>
			{children}
		</div>
	);
}
