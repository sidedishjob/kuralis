"use client";

import React, { useState, useEffect, useMemo } from "react";
import FurnitureCard from "@/components/FurnitureCard";
import FilterSheet from "@/components/FilterSheet";
import { sampleFurniture } from "@/data/sampleFurniture";
import { FiPlus, FiSearch, FiX, FiChevronDown } from "react-icons/fi";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import OnboardingOverlay from "@/components/OnboardingOverlay";

export default function FurnitureListPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [activeCategory, setActiveCategory] = useState<string>("");
	const [activeLocation, setActiveLocation] = useState<string>("");
	const [isCategoryOpen, setIsCategoryOpen] = useState(false);
	const [isLocationOpen, setIsLocationOpen] = useState(false);
	const [onboardingStep, setOnboardingStep] = useState<number | null>(null);
	useEffect(() => {
		const hasSeen = localStorage.getItem("hasSeenOnboarding");
		setOnboardingStep(hasSeen ? null : 1);
	}, []);
	const { user } = useAuth();

	const categories = useMemo(
		() => Array.from(new Set(sampleFurniture.map((f) => f.category))).sort(),
		[]
	);

	const locations = useMemo(
		() => Array.from(new Set(sampleFurniture.map((f) => f.location))).sort(),
		[]
	);

	const filteredFurniture = useMemo(() => {
		return sampleFurniture.filter((furniture) => {
			const matchesSearch =
				searchQuery === "" ||
				furniture.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				furniture.brand.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesCategory = activeCategory === "" || furniture.category === activeCategory;
			const matchesLocation = activeLocation === "" || furniture.location === activeLocation;

			return matchesSearch && matchesCategory && matchesLocation;
		});
	}, [searchQuery, activeCategory, activeLocation]);

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
									onClick={() => setActiveCategory("")}
									className={`text-sm whitespace-nowrap md:w-full text-left transition-colors duration-300 font-normal tracking-tighter-custom ${
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
										onClick={() => setActiveCategory(category)}
										className={`text-sm whitespace-nowrap md:w-full text-left transition-colors duration-300 font-normal tracking-tighter-custom ${
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
									onClick={() => setActiveLocation("")}
									className={`text-sm whitespace-nowrap md:w-full text-left transition-colors duration-300 font-normal tracking-tighter-custom ${
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
										onClick={() => setActiveLocation(location)}
										className={`text-sm whitespace-nowrap md:w-full text-left transition-colors duration-300 font-normal tracking-tighter-custom ${
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
									categories={categories}
									locations={locations}
									activeCategory={activeCategory}
									activeLocation={activeLocation}
									onCategorySelect={setActiveCategory}
									onLocationSelect={setActiveLocation}
								/>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
						{filteredFurniture.map((furniture) => (
							<FurnitureCard
								key={furniture.id}
								furniture={furniture}
								isDemo={!user}
							/>
						))}
					</div>
				</div>
			</div>

			{/* 登録 or サインインリンク */}
			{user ? (
				<Link
					href="/furniture/add"
					className="fixed bottom-5 right-4 md:bottom-8 md:right-8 w-12 h-12 bg-kuralis-900 text-white shadow-lg hover:bg-kuralis-800 rounded-full flex items-center justify-center transition-all duration-300 ease-natural group z-50"
				>
					<FiPlus size={20} className="transition-colors duration-300" />
				</Link>
			) : (
				<Link
					href="/signin"
					className="fixed bottom-5 right-4 md:bottom-8 md:right-8 px-6 py-3 bg-kuralis-900 text-white shadow-lg hover:bg-kuralis-800 rounded-sm flex items-center justify-center transition-all duration-300 ease-natural group z-50 text-sm font-bold tracking-tighter-custom"
				>
					サインインして家具を登録
				</Link>
			)}
		</div>
	);
}
