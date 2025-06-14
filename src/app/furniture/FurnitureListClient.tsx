"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { FiPlus, FiSearch, FiX, FiChevronDown, FiGrid, FiMapPin, FiLayout } from "react-icons/fi";
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
		<div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
			{onboardingStep && (
				<OnboardingOverlay
					currentStep={onboardingStep}
					onNext={handleOnboardingNext}
					onSkip={handleOnboardingSkip}
					onComplete={handleOnboardingComplete}
				/>
			)}

			<div className="container mx-auto py-12 px-4 md:px-8">
				{/* ヘッダーセクション */}
				<header className="mb-12">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
						<div className="space-y-2">
							<h1 className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900">
								家具コレクション
							</h1>
							<p className="text-lg text-neutral-600">
								大切な家具との物語を、デジタルで紡ぐ
							</p>
						</div>

						{/* 検索とフィルター */}
						<div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
							<div className="relative flex-1 md:w-96">
								<input
									type="text"
									placeholder="家具を検索..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-neutral-200/50 rounded-xl focus:border-neutral-400 outline-none transition-all duration-300 font-normal tracking-tight shadow-sm"
								/>
								<FiSearch
									size={20}
									className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
								/>
								{searchQuery && (
									<button
										onClick={() => setSearchQuery("")}
										className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors duration-300"
									>
										<FiX size={18} />
									</button>
								)}
							</div>
						</div>
					</div>
				</header>

				<div className="flex flex-col lg:flex-row gap-8">
					{/* サイドバー */}
					<aside className="lg:w-64 flex-shrink-0">
						<div className="sticky top-8 space-y-6">
							{/* カテゴリーフィルター */}
							<div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
								<button
									onClick={() => setIsCategoryOpen(!isCategoryOpen)}
									className="flex items-center justify-between w-full text-sm text-neutral-600 font-medium mb-2"
								>
									<div className="flex items-center gap-2">
										<FiGrid size={18} />
										<span>カテゴリー</span>
									</div>
									<FiChevronDown
										size={18}
										className={`transform transition-transform duration-300 ${
											isCategoryOpen ? "rotate-180" : ""
										}`}
									/>
								</button>
								<div
									className={`space-y-2 overflow-hidden transition-all duration-300 ${
										isCategoryOpen ? "max-h-96" : "max-h-0"
									}`}
								>
									<button
										onClick={() => setActiveCategory(null)}
										className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-300 ${
											activeCategory === null
												? "bg-neutral-900 text-white"
												: "text-neutral-600 hover:bg-neutral-100"
										}`}
									>
										すべて
									</button>
									{initialCategories.map((category) => (
										<button
											key={category.id}
											onClick={() => setActiveCategory(category.id)}
											className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-300 ${
												activeCategory === category.id
													? "bg-neutral-900 text-white"
													: "text-neutral-600 hover:bg-neutral-100"
											}`}
										>
											{category.name}
										</button>
									))}
								</div>
							</div>

							{/* 場所フィルター */}
							<div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
								<button
									onClick={() => setIsLocationOpen(!isLocationOpen)}
									className="flex items-center justify-between w-full text-sm text-neutral-600 font-medium mb-2"
								>
									<div className="flex items-center gap-2">
										<FiMapPin size={18} />
										<span>場所</span>
									</div>
									<FiChevronDown
										size={18}
										className={`transform transition-transform duration-300 ${
											isLocationOpen ? "rotate-180" : ""
										}`}
									/>
								</button>
								<div
									className={`space-y-2 overflow-hidden transition-all duration-300 ${
										isLocationOpen ? "max-h-96" : "max-h-0"
									}`}
								>
									<button
										onClick={() => setActiveLocation(null)}
										className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-300 ${
											activeLocation === null
												? "bg-neutral-900 text-white"
												: "text-neutral-600 hover:bg-neutral-100"
										}`}
									>
										すべて
									</button>
									{initialLocations.map((location) => (
										<button
											key={location.id}
											onClick={() => setActiveLocation(location.id)}
											className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-300 ${
												activeLocation === location.id
													? "bg-neutral-900 text-white"
													: "text-neutral-600 hover:bg-neutral-100"
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
					<main className="flex-1">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredFurniture?.map((furniture) => (
								<FurnitureCard
									key={furniture.id}
									furniture={furniture}
									isDemo={!user}
								/>
							))}
						</div>

						{filteredFurniture.length === 0 && (
							<div className="col-span-full py-16 text-center">
								<p className="text-neutral-600 mb-4">家具が登録されていません</p>
								<Link
									href="/furniture/register"
									className="inline-flex items-center gap-2 text-neutral-900 hover:text-neutral-700 transition-colors duration-300"
								>
									家具を登録する
									<FiPlus size={16} />
								</Link>
							</div>
						)}
					</main>
				</div>
			</div>

			{/* 登録ボタン */}
			{user ? (
				<Link
					href="/furniture/register"
					className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-16 h-16 bg-neutral-900 text-white shadow-lg hover:bg-neutral-800 rounded-full flex items-center justify-center transition-all duration-300 group z-50"
				>
					<FiPlus
						size={28}
						className="transition-transform duration-300 group-hover:rotate-90"
					/>
				</Link>
			) : (
				<Link
					href="/auth/login"
					className="fixed bottom-6 right-6 md:bottom-8 md:right-8 px-6 py-3 bg-neutral-900 text-white shadow-lg hover:bg-neutral-800 rounded-full flex items-center justify-center transition-all duration-300 group z-50 text-sm font-medium"
				>
					ログインして家具を登録
				</Link>
			)}
		</div>
	);
}
