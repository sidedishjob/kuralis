"use client";

import Link from "next/link";
import { FiTool, FiList } from "react-icons/fi";
import type { FurnitureWithExtras } from "@/types/furniture_new";

interface Props {
	furniture: FurnitureWithExtras;
	editedFurniture: FurnitureWithExtras;
	setEditedFurniture: (f: FurnitureWithExtras) => void;
	isEditing: boolean;
}

export default function FurnitureDetailMaintenanceTab({
	furniture,
	editedFurniture,
	setEditedFurniture,
	isEditing,
}: Props) {
	return (
		<div className="bg-white p-8 border border-kuralis-100 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-6">
			<h2 className="text-sm font-bold tracking-tighter-custom text-kuralis-600 mb-4">
				メンテナンス情報
			</h2>

			{(isEditing || furniture.needsMaintenance) && (
				<div className="flex border-b border-kuralis-100 pb-4 hover:bg-kuralis-50/50 transition-colors duration-300 -mx-8 px-8">
					<div className="w-24 md:w-36 flex-shrink-0 text-kuralis-600 font-normal tracking-tighter-custom">
						<FiTool size={16} className="mr-2 inline-block" />
						<span>メンテナンス方法</span>
					</div>
					{isEditing ? (
						<input
							type="text"
							value={String(editedFurniture.needsMaintenance) || ""}
							onChange={(e) =>
								setEditedFurniture({
									...editedFurniture,
									needsMaintenance: Boolean(e.target.value),
								})
							}
							className="flex-1 min-w-0 font-normal tracking-tighter-custom bg-transparent border-b border-kuralis-200 focus:border-kuralis-900 outline-none"
						/>
					) : (
						<div className="space-y-2">
							<div className="font-normal tracking-tighter-custom break-words">
								{furniture.needsMaintenance}
							</div>
							<Link
								href={`/furniture/${furniture.id}/maintenance`}
								className="inline-flex items-center px-4 py-2 bg-kuralis-900 text-white rounded-sm hover:bg-kuralis-800 transition-all duration-300 transform hover:-translate-y-0.5 text-sm font-bold tracking-tighter-custom"
							>
								<FiList size={14} className="mr-2" />
								<span>メンテナンス履歴を管理</span>
							</Link>
						</div>
					)}
				</div>
			)}

			{(isEditing || furniture.notes) && (
				<div className="bg-white border border-kuralis-100 shadow-sm p-6">
					<h2 className="text-sm font-bold tracking-tighter-custom text-kuralis-600 mb-4">
						備考
					</h2>
					{isEditing ? (
						<textarea
							value={editedFurniture.notes || ""}
							onChange={(e) =>
								setEditedFurniture({ ...editedFurniture, notes: e.target.value })
							}
							className="w-full p-4 font-normal tracking-tighter-custom bg-kuralis-50 rounded-sm border-none focus:ring-1 focus:ring-kuralis-900 outline-none resize-none"
							rows={3}
						/>
					) : (
						<div className="p-4 bg-kuralis-50 rounded-sm font-normal tracking-tighter-custom break-words">
							{furniture.notes}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
