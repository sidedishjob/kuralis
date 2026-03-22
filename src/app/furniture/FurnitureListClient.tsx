"use client";

import React, { useReducer, useEffect, useMemo } from "react";
import Link from "next/link";
import { FiPlus, FiSearch, FiX, FiChevronDown } from "react-icons/fi";
import { FurnitureCard } from "@/components/features/furniture/FurnitureCard";
import { FilterSheet } from "@/components/features/furniture/FilterSheet";
import { OnboardingOverlay } from "@/components/common/ui/OnboardingOverlay";
import type { Furniture } from "@/types/furniture";
import type { Category, Location } from "@/types/furniture_meta";

type FurnitureListClientProps = {
  initialFurniture: Furniture[];
  initialCategories: Category[];
  initialLocations: Location[];
};

interface ListState {
  searchQuery: string;
  activeCategory: number | null;
  activeLocation: number | null;
  isCategoryOpen: boolean;
  isLocationOpen: boolean;
  onboardingStep: number | null;
}

type ListAction =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_CATEGORY"; payload: number | null }
  | { type: "SET_LOCATION"; payload: number | null }
  | { type: "TOGGLE_CATEGORY" }
  | { type: "TOGGLE_LOCATION" }
  | { type: "SET_ONBOARDING"; payload: number | null }
  | { type: "NEXT_ONBOARDING" };

function listReducer(state: ListState, action: ListAction): ListState {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "SET_CATEGORY":
      return { ...state, activeCategory: action.payload };
    case "SET_LOCATION":
      return { ...state, activeLocation: action.payload };
    case "TOGGLE_CATEGORY":
      return { ...state, isCategoryOpen: !state.isCategoryOpen };
    case "TOGGLE_LOCATION":
      return { ...state, isLocationOpen: !state.isLocationOpen };
    case "SET_ONBOARDING":
      return { ...state, onboardingStep: action.payload };
    case "NEXT_ONBOARDING":
      return {
        ...state,
        onboardingStep: state.onboardingStep ? state.onboardingStep + 1 : null,
      };
  }
}

const listInitialState: ListState = {
  searchQuery: "",
  activeCategory: null,
  activeLocation: null,
  isCategoryOpen: false,
  isLocationOpen: false,
  onboardingStep: null,
};

export default function FurnitureListClient({
  initialFurniture,
  initialCategories,
  initialLocations,
}: FurnitureListClientProps) {
  const [state, dispatch] = useReducer(listReducer, listInitialState);

  useEffect(() => {
    const hasSeen = localStorage.getItem("hasSeenOnboarding");
    dispatch({ type: "SET_ONBOARDING", payload: hasSeen ? null : 1 });
  }, []);

  const filteredFurniture = useMemo(() => {
    if (!initialFurniture) return [];

    return initialFurniture?.filter((furniture) => {
      const matchesSearch =
        state.searchQuery === "" ||
        furniture.name
          .toLowerCase()
          .includes(state.searchQuery.toLowerCase()) ||
        (furniture.brand ?? "")
          .toLowerCase()
          .includes(state.searchQuery.toLowerCase());

      const matchesCategory =
        state.activeCategory === null ||
        furniture.category_id === state.activeCategory;
      const matchesLocation =
        state.activeLocation === null ||
        furniture.location_id === state.activeLocation;

      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [
    initialFurniture,
    state.searchQuery,
    state.activeCategory,
    state.activeLocation,
  ]);

  const priorityImageFurnitureIds = useMemo(() => {
    const ids: string[] = [];
    for (const furniture of filteredFurniture) {
      if (!furniture.image_url) continue;
      ids.push(furniture.id);
      if (ids.length >= 6) break;
    }
    return new Set(ids);
  }, [filteredFurniture]);

  const handleOnboardingNext = () => dispatch({ type: "NEXT_ONBOARDING" });
  const handleOnboardingSkip = () => {
    dispatch({ type: "SET_ONBOARDING", payload: null });
    if (typeof window !== "undefined")
      localStorage.setItem("hasSeenOnboarding", "true");
  };
  const handleOnboardingComplete = () => {
    dispatch({ type: "SET_ONBOARDING", payload: null });
    if (typeof window !== "undefined")
      localStorage.setItem("hasSeenOnboarding", "true");
  };

  return (
    <div className="container mx-auto py-4 md:py-6 px-4 md:px-12">
      {state.onboardingStep && (
        <OnboardingOverlay
          currentStep={state.onboardingStep}
          onNext={handleOnboardingNext}
          onSkip={handleOnboardingSkip}
          onComplete={handleOnboardingComplete}
        />
      )}

      <header className="mb-4 md:mb-12">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tighter-custom">
            Collection
          </h1>
        </div>
      </header>

      <div className="flex flex-col md:flex-row md:gap-12">
        <aside className="hidden md:block w-40 shrink-0">
          <div className="space-y-1 md:space-y-4">
            {/* Category Filter */}
            <div className="space-y-3">
              <button
                onClick={() => dispatch({ type: "TOGGLE_CATEGORY" })}
                className="flex items-center justify-between w-full text-sm text-kuralis-600 font-bold tracking-tighter-custom"
              >
                <span>Category</span>
                <FiChevronDown
                  size={16}
                  className={`transform transition-transform duration-300 ${
                    state.isCategoryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`space-y-3 ml-2 overflow-hidden transition-all duration-300 ${
                  state.isCategoryOpen ? "max-h-96" : "max-h-0"
                }`}
              >
                <button
                  onClick={() =>
                    dispatch({ type: "SET_CATEGORY", payload: null })
                  }
                  className={`text-sm whitespace-nowrap md:w-full text-left transition-colors duration-300 font-normal tracking-tighter-custom ${
                    state.activeCategory === null
                      ? "text-kuralis-900"
                      : "text-kuralis-500 hover:text-kuralis-700"
                  }`}
                >
                  All
                </button>
                {initialCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() =>
                      dispatch({ type: "SET_CATEGORY", payload: category.id })
                    }
                    className={`text-sm whitespace-nowrap md:w-full text-left transition-colors duration-300 font-normal tracking-tighter-custom ${
                      state.activeCategory === category.id
                        ? "text-kuralis-900"
                        : "text-kuralis-500 hover:text-kuralis-700"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div className="space-y-3">
              <button
                onClick={() => dispatch({ type: "TOGGLE_LOCATION" })}
                className="flex items-center justify-between w-full text-sm text-kuralis-600 font-bold tracking-tighter-custom"
              >
                <span>Location</span>
                <FiChevronDown
                  size={16}
                  className={`transform transition-transform duration-300 ${
                    state.isLocationOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`space-y-3 ml-2 overflow-hidden transition-all duration-300 ${
                  state.isLocationOpen ? "max-h-96" : "max-h-0"
                }`}
              >
                <button
                  onClick={() =>
                    dispatch({ type: "SET_LOCATION", payload: null })
                  }
                  className={`text-sm whitespace-nowrap md:w-full text-left transition-colors duration-300 font-normal tracking-tighter-custom ${
                    state.activeLocation === null
                      ? "text-kuralis-900"
                      : "text-kuralis-500 hover:text-kuralis-700"
                  }`}
                >
                  All
                </button>
                {initialLocations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() =>
                      dispatch({ type: "SET_LOCATION", payload: location.id })
                    }
                    className={`text-sm whitespace-nowrap md:w-full text-left transition-colors duration-300 font-normal tracking-tighter-custom ${
                      state.activeLocation === location.id
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
        </aside>

        {/* メインリスト */}
        <div className="grow min-w-0">
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="search..."
                value={state.searchQuery}
                onChange={(e) =>
                  dispatch({ type: "SET_SEARCH", payload: e.target.value })
                }
                className="w-full pl-10 pr-12 py-2 bg-transparent border-b border-kuralis-200 focus:border-kuralis-400 outline-none transition-colors duration-300 font-normal tracking-tighter-custom"
              />
              <FiSearch
                size={18}
                className="absolute left-0 top-1/2 -translate-y-1/2 text-kuralis-400"
              />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                {state.searchQuery && (
                  <button
                    onClick={() =>
                      dispatch({ type: "SET_SEARCH", payload: "" })
                    }
                    className="text-kuralis-400 hover:text-kuralis-600 transition-colors duration-300"
                  >
                    <FiX size={16} />
                  </button>
                )}
                <FilterSheet
                  categories={initialCategories}
                  locations={initialLocations}
                  activeCategory={state.activeCategory}
                  activeLocation={state.activeLocation}
                  onCategorySelect={(id) =>
                    dispatch({ type: "SET_CATEGORY", payload: id })
                  }
                  onLocationSelect={(id) =>
                    dispatch({ type: "SET_LOCATION", payload: id })
                  }
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-0.5">
            {filteredFurniture?.map((furniture) => (
              <FurnitureCard
                key={furniture.id}
                furniture={furniture}
                priorityImage={priorityImageFurnitureIds.has(furniture.id)}
              />
            ))}
            {filteredFurniture.length === 0 && (
              <div className="text-center text-sm text-kuralis-500 mt-12 col-span-full">
                家具が登録されていません。
                <Link
                  href="/furniture/register"
                  className="text-kuralis-700 underline underline-offset-2 hover:text-kuralis-900 ml-1"
                >
                  家具を登録する
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 登録 */}
      <Link
        href="/furniture/register"
        className="fixed bottom-24 right-4 md:bottom-28 md:right-8 size-12 bg-kuralis-900 text-white shadow-lg hover:bg-kuralis-800 rounded-full flex items-center justify-center transition-all duration-300 ease-natural group z-50"
      >
        <FiPlus size={20} className="transition-colors duration-300" />
      </Link>
    </div>
  );
}
