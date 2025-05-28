"use client";

import { FiCalendar, FiMapPin } from "react-icons/fi";
import type { FurnitureWithExtras } from "@/types/furniture_new";

interface Props {
	furniture: FurnitureWithExtras;
	editedFurniture: FurnitureWithExtras;
	setEditedFurniture: (f: FurnitureWithExtras) => void;
	isEditing: boolean;
}

export default function FurnitureDetailPurchaseTab({
	furniture,
	editedFurniture,
	setEditedFurniture,
	isEditing,
}: Props) {
	return (
		<div className="bg-white p-8 border border-kuralis-100 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-6">
			<h2 className="text-sm font-bold tracking-tighter-custom text-kuralis-600 mb-4">
				購入情報
			</h2>

			{(isEditing || furniture.purchased_at) && (
				<div className="flex items-center border-b border-kuralis-100 pb-4 hover:bg-kuralis-50/50 transition-colors duration-300 -mx-8 px-8">
					<div className="w-24 md:w-36 flex-shrink-0 text-kuralis-600 flex items-center font-normal tracking-tighter-custom">
						<FiCalendar size={16} className="mr-2" />
						<span>購入日</span>
					</div>
					{isEditing ? (
						<input
							type="date"
							value={editedFurniture.purchased_at || ""}
							onChange={(e) =>
								setEditedFurniture({
									...editedFurniture,
									purchased_at: e.target.value,
								})
							}
							className="font-normal tracking-tighter-custom bg-transparent border-b border-kuralis-200 focus:border-kuralis-900 outline-none"
						/>
					) : (
						<div className="flex-1 min-w-0 font-normal tracking-tighter-custom truncate">
							{furniture.purchased_at &&
								new Date(furniture.purchased_at).toLocaleDateString()}
						</div>
					)}
				</div>
			)}

			{(isEditing || furniture.purchased_from) && (
				<div className="flex items-center border-b border-kuralis-100 pb-4 hover:bg-kuralis-50/50 transition-colors duration-300 -mx-8 px-8">
					<div className="w-24 md:w-36 flex-shrink-0 text-kuralis-600 flex items-center font-normal tracking-tighter-custom">
						<FiMapPin size={16} className="mr-2" />
						<span>購入店舗</span>
					</div>
					{isEditing ? (
						<input
							type="text"
							value={editedFurniture.purchased_from || ""}
							onChange={(e) =>
								setEditedFurniture({
									...editedFurniture,
									purchased_from: e.target.value,
								})
							}
							className="font-normal tracking-tighter-custom bg-transparent border-b border-kuralis-200 focus:border-kuralis-900 outline-none"
						/>
					) : (
						<div className="flex-1 min-w-0 font-normal tracking-tighter-custom truncate">
							{furniture.purchased_from}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
