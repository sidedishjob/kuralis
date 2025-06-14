"use client";

import { useFormContext } from "react-hook-form";
import { FiMapPin, FiGrid } from "react-icons/fi";
import { FurnitureEditSchema } from "@/lib/validation";
import type { FurnitureWithExtras } from "@/types/furniture";
import type { Location } from "@/types/furniture_meta";

interface Props {
	furniture: FurnitureWithExtras;
	isEditing: boolean;
	locations: Location[];
}

export default function FurnitureDetailBasicTab({ furniture, isEditing, locations }: Props) {
	const {
		register,
		formState: { errors },
	} = useFormContext<FurnitureEditSchema>();

	return (
		<div className="space-y-8">
			{/* 名前・ブランドエリア */}
			<div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
				<div className="min-w-0 flex-1">
					{isEditing ? (
						<div className="space-y-4">
							<div>
								<input
									type="text"
									placeholder="家具名"
									{...register("name")}
									className="text-2xl md:text-3xl font-medium bg-transparent border-b border-neutral-200 focus:border-neutral-900 outline-none w-full pb-2"
								/>
								{errors.name && (
									<p className="text-red-500 text-sm mt-1">
										{errors.name.message}
									</p>
								)}
							</div>
							<div>
								<input
									type="text"
									placeholder="ブランド名"
									{...register("brand")}
									className="text-neutral-600 text-lg bg-transparent border-b border-neutral-200 focus:border-neutral-900 outline-none w-full pb-2"
								/>
								{errors.brand && (
									<p className="text-red-500 text-sm mt-1">
										{errors.brand.message}
									</p>
								)}
							</div>
						</div>
					) : (
						<div className="space-y-2">
							<h1 className="text-2xl md:text-3xl font-medium text-neutral-900">
								{furniture.name}
							</h1>
							<p className="text-neutral-600 text-lg">{furniture.brand}</p>
						</div>
					)}
				</div>
			</div>

			{/* カテゴリ・設置場所ブロック */}
			<div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
				<h2 className="text-sm font-medium text-neutral-600 mb-6">基本情報</h2>

				<div className="space-y-6">
					{/* Category */}
					<div className="flex items-center">
						<div className="w-24 md:w-36 flex-shrink-0 text-neutral-600 flex items-center">
							<FiGrid size={18} className="mr-2" />
							<span>カテゴリ</span>
						</div>
						<div className="flex-1 min-w-0 text-neutral-900">
							{furniture.category?.name}
						</div>
					</div>

					{/* Location */}
					<div className="flex items-center">
						<div className="w-24 md:w-36 flex-shrink-0 text-neutral-600 flex items-center">
							<FiMapPin size={18} className="mr-2" />
							<span>設置場所</span>
						</div>
						{isEditing ? (
							<div className="flex-1">
								<select
									{...register("location_id")}
									className="w-full bg-transparent border-b border-neutral-200 focus:border-neutral-900 outline-none pb-1"
								>
									<option value="">選択してください</option>
									{locations.map((location) => (
										<option key={location.id} value={location.id}>
											{location.name}
										</option>
									))}
								</select>
								{errors.location_id && (
									<p className="text-red-500 text-sm mt-1">
										{errors.location_id.message}
									</p>
								)}
							</div>
						) : (
							<div className="flex-1 min-w-0 text-neutral-900">
								{furniture.location?.name}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
