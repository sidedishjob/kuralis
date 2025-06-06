"use client";

import { FiMapPin } from "react-icons/fi";
import { useFormContext } from "react-hook-form";
import type { FurnitureWithExtras } from "@/types/furniture";
import type { Location } from "@/types/furniture_meta";
import type { FurnitureEditSchema } from "@/lib/validation";

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
			<div className="bg-white p-8 border border-kuralis-100 shadow-sm hover:shadow-md transition-shadow duration-300">
				<div className="min-w-0 flex-1">
					{isEditing ? (
						<div>
							<input
								type="text"
								placeholder="家具名"
								{...register("name")}
								className="text-2xl md:text-3xl font-bold tracking-tighter-custom bg-transparent border-b border-kuralis-200 focus:border-kuralis-900 outline-none w-full"
							/>
							{errors.name && (
								<p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
							)}
							<input
								type="text"
								placeholder="ブランド名"
								{...register("brand")}
								className="text-kuralis-600 mt-2 text-sm font-bold tracking-tighter-custom bg-transparent border-b border-kuralis-200 focus:border-kuralis-900 outline-none w-full"
							/>
							{errors.brand && (
								<p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>
							)}
						</div>
					) : (
						<div>
							<h1 className="text-2xl md:text-3xl font-bold tracking-tighter-custom">
								{furniture.name}
							</h1>
							<p className="text-kuralis-600 mt-2 text-sm font-bold tracking-tighter-custom truncate">
								{furniture.brand}
							</p>
						</div>
					)}
				</div>
			</div>

			{/* カテゴリ・設置場所ブロック */}
			<div className="bg-white p-8 border border-kuralis-100 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-6">
				<h2 className="text-sm font-bold tracking-tighter-custom text-kuralis-600 mb-4">
					基本情報
				</h2>

				{/* Category */}
				<div className="flex items-center border-b border-kuralis-100 pb-4 hover:bg-kuralis-50/50 transition-colors duration-300 -mx-8 px-8">
					<div className="w-24 md:w-36 flex-shrink-0 text-kuralis-600 flex items-center font-normal tracking-tighter-custom">
						<FiMapPin size={16} className="mr-2" />
						<span>カテゴリ</span>
					</div>
					<div className="flex-1 min-w-0 font-normal tracking-tighter-custom truncate">
						{furniture.category?.name}
					</div>
				</div>

				{/* Location */}
				<div className="flex items-center border-b border-kuralis-100 pb-4 hover:bg-kuralis-50/50 transition-colors duration-300 -mx-8 px-8">
					<div className="w-24 md:w-36 flex-shrink-0 text-kuralis-600 flex items-center font-normal tracking-tighter-custom">
						<FiMapPin size={16} className="mr-2" />
						<span>設置場所</span>
					</div>
					{isEditing ? (
						<div className="flex-1">
							<select
								{...register("location_id", {
									setValueAs: (val) => (val === "" ? undefined : Number(val)),
								})}
								className="font-normal tracking-tighter-custom bg-transparent border-b border-kuralis-200 focus:border-kuralis-900 outline-none w-full"
							>
								<option value="" disabled>
									選択してください
								</option>
								{locations.map((loc) => (
									<option key={loc.id} value={loc.id}>
										{loc.name}
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
						<div className="flex-1 min-w-0 font-normal tracking-tighter-custom truncate">
							{furniture.location?.name}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
