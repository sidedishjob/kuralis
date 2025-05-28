"use client";

import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FiFilter } from "react-icons/fi";
import type { Category, Location } from "@/types/furniture_meta";

interface FilterSheetProps {
	categories: Category[];
	locations: Location[];
	activeCategory: number | null;
	activeLocation: number | null;
	onCategorySelect: (category: number | null) => void;
	onLocationSelect: (location: number | null) => void;
}

// FilterSheet はスマホ用のフィルター選択 UI（カテゴリ・設置場所）を表示するシート
const FilterSheet: React.FC<FilterSheetProps> = ({
	categories,
	locations,
	activeCategory,
	activeLocation,
	onCategorySelect,
	onLocationSelect,
}) => {
	return (
		<Sheet>
			<SheetTrigger
				className="md:hidden text-kuralis-400 hover:text-kuralis-600 transition-colors duration-300"
				aria-label="フィルターを開く"
				title="フィルターを開く"
			>
				<FiFilter size={16} className="ml-2" />
			</SheetTrigger>
			<SheetContent side="left" className="w-full max-w-xs">
				<SheetHeader>
					<SheetTitle className="text-left font-bold tracking-tighter-custom">
						Filters
					</SheetTitle>
				</SheetHeader>
				<div className="mt-8 space-y-8">
					{/* カテゴリフィルタ */}
					<div>
						<h2 className="text-sm text-kuralis-600 mb-2 font-bold tracking-tighter-custom">
							Category
						</h2>
						<div className="space-y-3 ml-2">
							<button
								onClick={() => onCategorySelect(null)}
								className={`text-sm w-full text-left transition-colors duration-300 font-normal tracking-tighter-custom ${
									activeCategory === null
										? "text-kuralis-900"
										: "text-kuralis-500 hover:text-kuralis-700"
								}`}
							>
								All
							</button>
							{categories.map((category) => (
								<button
									key={category.id}
									onClick={() => onCategorySelect(category.id)}
									className={`text-sm w-full text-left transition-colors duration-300 font-normal tracking-tighter-custom ${
										activeCategory === category.id
											? "text-kuralis-900"
											: "text-kuralis-500 hover:text-kuralis-700"
									}`}
								>
									{category.name}
								</button>
							))}
						</div>
					</div>

					{/* 設置場所フィルタ */}
					<div>
						<h2 className="text-sm text-kuralis-600 mb-2 font-bold tracking-tighter-custom">
							Location
						</h2>
						<div className="space-y-3 ml-2">
							<button
								onClick={() => onLocationSelect(null)}
								className={`text-sm w-full text-left transition-colors duration-300 font-normal tracking-tighter-custom ${
									activeLocation === null
										? "text-kuralis-900"
										: "text-kuralis-500 hover:text-kuralis-700"
								}`}
							>
								All
							</button>
							{locations.map((location) => (
								<button
									key={location.id}
									onClick={() => onLocationSelect(location.id)}
									className={`text-sm w-full text-left transition-colors duration-300 font-normal tracking-tighter-custom ${
										activeLocation === location.id
											? "text-kuralis-900"
											: "text-kuralis-500 hover:text-kuralis-700"
									}`}
								>
									{location.name}
								</button>
							))}
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default FilterSheet;
