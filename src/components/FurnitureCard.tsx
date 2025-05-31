"use client";

import React from "react";
import Link from "next/link";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import type { Furniture } from "@/types/furniture";
import DemoView from "./DemoView";

interface FurnitureCardProps {
	furniture: Furniture;
	isDemo?: boolean;
}

const FurnitureCard: React.FC<FurnitureCardProps> = ({ furniture, isDemo = false }) => {
	const Card = () => (
		<div className="block group relative overflow-hidden">
			<div className="aspect-[4/3] transform group-hover:-translate-y-8 transition-transform duration-700 ease-natural">
				{furniture.image_url ? (
					<img
						src={furniture.image_url}
						alt={furniture.name}
						className="w-full h-full object-cover object-center"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center text-kuralis-400 bg-kuralis-50">
						No image
					</div>
				)}
			</div>

			<div className="absolute bottom-0 left-0 right-0 bg-white px-3 py-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-natural">
				<div className="flex justify-between items-center">
					<h3 className="text-xs font-bold tracking-tighter-custom">{furniture.name}</h3>
					{/* TODO: メンテナンス有無の表示処理追加 */}
					{/* {furniture.needsMaintenance ? (
						<FiAlertCircle size={14} className="text-accent-500 flex-shrink-0" />
					) : (
						<FiCheckCircle size={14} className="text-kuralis-400 flex-shrink-0" />
					)} */}
				</div>
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
};

export default FurnitureCard;
