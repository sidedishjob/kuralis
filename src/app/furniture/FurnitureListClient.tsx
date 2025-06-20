"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { FiPlus, FiSearch, FiX, FiChevronDown } from "react-icons/fi";
import { FurnitureCard } from "@/components/features/furniture/FurnitureCard";
import { FilterSheet } from "@/components/features/furniture/FilterSheet";
import { OnboardingOverlay } from "@/components/common/ui/OnboardingOverlay";
import type { Furniture } from "@/types/furniture";
import type { Category, Location } from "@/types/furniture_meta";

type FurnitureListClientProps = {
	user: User | null;
	initialFurniture: Furniture[];
	initialCategories: Category[];
	initialLocations: Location[];
};

export default function FurnitureListClient({
	user,
	initialFurniture,
	initialCategories,
	initialLocations,
}: FurnitureListClientProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [activeCategory, setActiveCategory] = useState<number | null>(null);
	const [activeLocation, setActiveLocation] = useState<number | null>(null);
	const [isCategoryOpen, setIsCategoryOpen] = useState(false);
	const [isLocationOpen, setIsLocationOpen] = useState(false);
	const [onboardingStep, setOnboardingStep] = useState<number | null>(null);

	useEffect(() => {
		const hasSeen = localStorage.getItem("hasSeenOnboarding");
		setOnboardingStep(hasSeen ? null : 1);
	}, []);

	const filteredFurniture = useMemo(() => {
		if (!initialFurniture) return [];

		return initialFurniture?.filter((furniture) => {
			const matchesSearch =
				searchQuery === "" ||
				furniture.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				furniture.brand.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesCategory =
				activeCategory === null || furniture.category_id === activeCategory;
			const matchesLocation =
				activeLocation === null || furniture.location_id === activeLocation;

			return matchesSearch && matchesCategory && matchesLocation;
		});
	}, [initialFurniture, searchQuery, activeCategory, activeLocation]);

	const handleOnboardingNext = () => setOnboardingStep((prev) => (prev ? prev + 1 : null));
	const handleOnboardingSkip = () => {
		setOnboardingStep(null);
		if (typeof window !== "undefined") localStorage.setItem("hasSeenOnboarding", "true");
	};
	const handleOnboardingComplete = () => {
		setOnboardingStep(null);
		if (typeof window !== "undefined") localStorage.setItem("hasSeenOnboarding", "true");
	};

	return (
		<div className="container mx-auto py-4 md:py-6 px-4 md:px-12">
			{onboardingStep && (
				<OnboardingOverlay
					currentStep={onboardingStep}
					onNext={handleOnboardingNext}
					onSkip={handleOnboardingSkip}
					onComplete={handleOnboardingComplete}
				/>
			)}

			<header className="mb-4 md:mb-12">
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold tracking-tighter-custom">Collection</h1>
				</div>
			</header>

			<div className="flex flex-col md:flex-row md:gap-12">
				<aside className="hidden md:block w-40 flex-shrink-0">
					<div className="space-y-1 md:space-y-4">
						{/* Category Filter */}
						<div className="space-y-3">
							<button
								onClick={() => setIsCategoryOpen(!isCategoryOpen)}
								className="flex items-center justify-between w-full text-sm text-kuralis-600 font-bold tracking-tighter-custom"
							>
								<span>Category</span>
								<FiChevronDown
									size={16}
									className={`transform transition-transform duration-300 ${
										isCategoryOpen ? "rotate-180" : ""
									}`}
								/>
							</button>
							<div
								className={`space-y-3 ml-2 overflow-hidden transition-all duration-300 ${
									isCategoryOpen ? "max-h-96" : "max-h-0"
								}`}
							>
								<button
									onClick={() => setActiveCategory(null)}
									className={`text-sm whitespace-nowrap md:w-full text-left transition-colors duration-300 font-normal tracking-tighter-custom ${
										activeCategory === null
											? "text-kuralis-900"
											: "text-kuralis-500 hover:text-kuralis-700"
									}`}
								>
									All
								</button>
								{initialCategories.map((category) => (
									<button
										key={category.id}
										onClick={() => setActiveCategory(category.id)}
										className={`text-sm whitespace-nowrap md:w-full text-left transition-colors duration-300 font-normal tracking-tighter-custom ${
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

						{/* Location Filter */}
						<div className="space-y-3">
							<button
								onClick={() => setIsLocationOpen(!isLocationOpen)}
								className="flex items-center justify-between w-full text-sm text-kuralis-600 font-bold tracking-tighter-custom"
							>
								<span>Location</span>
								<FiChevronDown
									size={16}
									className={`transform transition-transform duration-300 ${
										isLocationOpen ? "rotate-180" : ""
									}`}
								/>
							</button>
							<div
								className={`space-y-3 ml-2 overflow-hidden transition-all duration-300 ${
									isLocationOpen ? "max-h-96" : "max-h-0"
								}`}
							>
								<button
									onClick={() => setActiveLocation(null)}
									className={`text-sm whitespace-nowrap md:w-full text-left transition-colors duration-300 font-normal tracking-tighter-custom ${
										activeLocation === null
											? "text-kuralis-900"
											: "text-kuralis-500 hover:text-kuralis-700"
									}`}
								>
									All
								</button>
								{initialLocations.map((location) => (
									<button
										key={location.id}
										onClick={() => setActiveLocation(location.id)}
										className={`text-sm whitespace-nowrap md:w-full text-left transition-colors duration-300 font-normal tracking-tighter-custom ${
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
				</aside>

				{/* メインリスト */}
				<div className="flex-grow min-w-0">
					<div className="mb-8">
						<div className="relative">
							<input
								type="text"
								placeholder="search..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-10 pr-12 py-2 bg-transparent border-b border-kuralis-200 focus:border-kuralis-400 outline-none transition-colors duration-300 font-normal tracking-tighter-custom"
							/>
							<FiSearch
								size={18}
								className="absolute left-0 top-1/2 -translate-y-1/2 text-kuralis-400"
							/>
							<div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center space-x-2">
								{searchQuery && (
									<button
										onClick={() => setSearchQuery("")}
										className="text-kuralis-400 hover:text-kuralis-600 transition-colors duration-300"
									>
										<FiX size={16} />
									</button>
								)}
								<FilterSheet
									categories={initialCategories}
									locations={initialLocations}
									activeCategory={activeCategory}
									activeLocation={activeLocation}
									onCategorySelect={setActiveCategory}
									onLocationSelect={setActiveLocation}
								/>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-0.5">
						{filteredFurniture?.map((furniture) => (
							<FurnitureCard
								key={furniture.id}
								furniture={furniture}
								isDemo={!user}
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

			{/* 登録 or ログインリンク */}
			{user ? (
				<Link
					href="/furniture/register"
					className="fixed bottom-24 right-4 md:bottom-28 md:right-8 w-12 h-12 bg-kuralis-900 text-white shadow-lg hover:bg-kuralis-800 rounded-full flex items-center justify-center transition-all duration-300 ease-natural group z-50"
				>
					<FiPlus size={20} className="transition-colors duration-300" />
				</Link>
			) : (
				<Link
					href="/auth/login"
					className="fixed bottom-5 right-4 md:bottom-8 md:right-8 px-6 py-3 bg-kuralis-900 text-white shadow-lg hover:bg-kuralis-800 rounded-sm flex items-center justify-center transition-all duration-300 ease-natural group z-50 text-sm font-bold tracking-tighter-custom"
				>
					ログインして家具を登録
				</Link>
			)}
		</div>
	);
}
