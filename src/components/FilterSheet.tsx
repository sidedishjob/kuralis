"use client";

import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FiFilter } from "react-icons/fi";

interface FilterSheetProps {
	categories: string[];
	locations: string[];
	activeCategory: string;
	activeLocation: string;
	onCategorySelect: (category: string) => void;
	onLocationSelect: (location: string) => void;
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
								onClick={() => onCategorySelect("")}
								className={`text-sm w-full text-left transition-colors duration-300 font-normal tracking-tighter-custom ${
									activeCategory === ""
										? "text-kuralis-900"
										: "text-kuralis-500 hover:text-kuralis-700"
								}`}
							>
								All
							</button>
							{categories.map((category) => (
								<button
									key={category}
									onClick={() => onCategorySelect(category)}
									className={`text-sm w-full text-left transition-colors duration-300 font-normal tracking-tighter-custom ${
										activeCategory === category
											? "text-kuralis-900"
											: "text-kuralis-500 hover:text-kuralis-700"
									}`}
								>
									{category}
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
								onClick={() => onLocationSelect("")}
								className={`text-sm w-full text-left transition-colors duration-300 font-normal tracking-tighter-custom ${
									activeLocation === ""
										? "text-kuralis-900"
										: "text-kuralis-500 hover:text-kuralis-700"
								}`}
							>
								All
							</button>
							{locations.map((location) => (
								<button
									key={location}
									onClick={() => onLocationSelect(location)}
									className={`text-sm w-full text-left transition-colors duration-300 font-normal tracking-tighter-custom ${
										activeLocation === location
											? "text-kuralis-900"
											: "text-kuralis-500 hover:text-kuralis-700"
									}`}
								>
									{location}
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
