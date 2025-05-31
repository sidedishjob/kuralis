"use client";

import Link from "next/link";
import { FiTool, FiList, FiCalendar } from "react-icons/fi";
import type { FurnitureWithExtras } from "@/types/furniture";
import { MaintenanceSummary } from "@/types/maintenance";

interface Props {
	furniture: FurnitureWithExtras;
	editedFurniture: FurnitureWithExtras;
	setEditedFurniture: (f: FurnitureWithExtras) => void;
	isEditing: boolean;
	summary: MaintenanceSummary | null;
}

export default function FurnitureDetailMaintenanceTab({
	furniture,
	editedFurniture,
	setEditedFurniture,
	isEditing,
	summary,
}: Props) {
	const formattedNextDue =
		summary?.nearestDueDate && summary?.nearestTaskName
			? `${summary.nearestDueDate}（${summary.nearestTaskName}）`
			: "未設定";
	const formattedTaskCount =
		summary?.activeTaskCount !== undefined ? `${summary.activeTaskCount} 件` : "未設定";

	return (
		<div className="space-y-6">
			{/* メンテナンス概要 */}
			<div className="bg-white p-8 border border-kuralis-100 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-6">
				<h2 className="text-sm font-bold tracking-tighter-custom text-kuralis-600 mb-4">
					メンテナンス概要
				</h2>
				<div className="flex items-center border-b border-kuralis-100 pb-4 hover:bg-kuralis-50/50 transition-colors duration-300 -mx-8 px-8">
					<div className="w-24 md:w-36 flex-shrink-0 text-kuralis-600 flex items-center font-normal tracking-tighter-custom">
						<FiCalendar className="mr-2" size={14} />
						次回予定
					</div>
					<div className="flex-1 min-w-0 font-normal tracking-tighter-custom truncate">
						{formattedNextDue}
					</div>
				</div>
				<div className="flex items-center border-b border-kuralis-100 pb-4 hover:bg-kuralis-50/50 transition-colors duration-300 -mx-8 px-8">
					<div className="w-24 md:w-36 flex-shrink-0 text-kuralis-600 flex items-center font-normal tracking-tighter-custom">
						<FiTool className="mr-2" size={14} />
						メンテ対象
					</div>
					<div className="flex-1 min-w-0 font-normal tracking-tighter-custom truncate">
						{formattedTaskCount}
					</div>
				</div>

				<Link
					href={`/furniture/${furniture.id}/maintenance`}
					className="inline-flex items-center px-4 py-2 bg-kuralis-900 text-white rounded-sm hover:bg-kuralis-800 transition-all duration-300 transform hover:-translate-y-0.5 text-sm font-bold tracking-tighter-custom"
				>
					<FiList size={14} className="mr-2" />
					<span>メンテナンス履歴を管理</span>
				</Link>
			</div>

			{/* 備考欄 */}
			{(isEditing || furniture.notes) && (
				<div className="bg-white p-8 border border-kuralis-100 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-6">
					<h2 className="text-sm font-bold tracking-tighter-custom text-kuralis-600 mb-2">
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
						<p className="p-4 bg-kuralis-50 rounded-sm font-normal tracking-tighter-custom break-words">
							{furniture.notes}
						</p>
					)}
				</div>
			)}
		</div>
	);
}
