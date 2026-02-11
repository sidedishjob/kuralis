"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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

export function FilterSheet({
  categories,
  locations,
  activeCategory,
  activeLocation,
  onCategorySelect,
  onLocationSelect,
}: FilterSheetProps) {
  const FilterButton = ({
    isActive,
    onClick,
    children,
  }: {
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`text-sm w-full text-left transition-colors duration-300 font-normal tracking-tighter-custom ${
        isActive
          ? "text-kuralis-900"
          : "text-kuralis-500 hover:text-kuralis-700"
      }`}
    >
      {children}
    </button>
  );

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
              <FilterButton
                isActive={activeCategory === null}
                onClick={() => onCategorySelect(null)}
              >
                All
              </FilterButton>
              {categories.map((category) => (
                <FilterButton
                  key={category.id}
                  isActive={activeCategory === category.id}
                  onClick={() => onCategorySelect(category.id)}
                >
                  {category.name}
                </FilterButton>
              ))}
            </div>
          </div>

          {/* 設置場所フィルタ */}
          <div>
            <h2 className="text-sm text-kuralis-600 mb-2 font-bold tracking-tighter-custom">
              Location
            </h2>
            <div className="space-y-3 ml-2">
              <FilterButton
                isActive={activeLocation === null}
                onClick={() => onLocationSelect(null)}
              >
                All
              </FilterButton>
              {locations.map((location) => (
                <FilterButton
                  key={location.id}
                  isActive={activeLocation === location.id}
                  onClick={() => onLocationSelect(location.id)}
                >
                  {location.name}
                </FilterButton>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
