"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiMapPin, FiShoppingBag } from "react-icons/fi";
import type { Furniture } from "@/types/furniture";
import { DemoView } from "@/components/common/DemoView";

interface FurnitureCardProps {
	furniture: Furniture;
	isDemo?: boolean;
}

export function FurnitureCard({ furniture, isDemo = false }: FurnitureCardProps) {
	const Card = () => (
		<div className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
			{/* 画像部分 */}
			<div className="aspect-[4/3] relative overflow-hidden">
				{furniture.image_url ? (
					<Image
						src={furniture.image_url}
						alt={furniture.name}
						width={400}
						height={300}
						className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-natural"
						unoptimized
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center text-neutral-400 bg-neutral-50">
						No image
					</div>
				)}
				{/* オーバーレイ */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
			</div>

			{/* 情報部分 */}
			<div className="p-4">
				<h3 className="text-lg font-medium text-neutral-900 mb-1 line-clamp-1">
					{furniture.name}
				</h3>
				<div className="flex items-center gap-4 text-sm text-neutral-600">
					<div className="flex items-center gap-1">
						<FiShoppingBag size={14} />
						<span className="line-clamp-1">{furniture.brand}</span>
					</div>
					<div className="flex items-center gap-1">
						<FiMapPin size={14} />
						<span className="line-clamp-1">{furniture.location_id}</span>
					</div>
				</div>
			</div>

			{/* ホバー時の詳細表示 */}
			<div className="absolute inset-0 bg-white/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-6">
				<h3 className="text-xl font-medium text-neutral-900 mb-2 text-center">
					{furniture.name}
				</h3>
				<p className="text-sm text-neutral-600 text-center mb-4">{furniture.brand}</p>
				<span className="text-xs text-neutral-500">詳細を見る</span>
			</div>
		</div>
	);

	return (
		<Link href={`/furniture/${furniture.id}`} className="block">
			{isDemo ? (
				<DemoView>
					<Card />
				</DemoView>
			) : (
				<Card />
			)}
		</Link>
	);
}
