"use client";

import { useFurnitureMeta } from "@/hooks/useFurnitureMeta";
import { FiArrowRight } from "react-icons/fi";
import type { Category, Location } from "@/types/furniture_meta";

interface Props {
	formData: {
		category: Category | null;
		location: Location | null;
		name: string;
		image: File | null;
	};
	setFormData: React.Dispatch<
		React.SetStateAction<{
			category: Category | null;
			location: Location | null;
			name: string;
			image: File | null;
		}>
	>;
	onNext: () => void;
}

export default function Step1UI({ formData, setFormData, onNext }: Props) {
	const isValid = !!formData.category && !!formData.location;
	const { data, isLoading, error } = useFurnitureMeta();

	const handleCategorySelect = (category: Category) => {
		setFormData((prev) => ({ ...prev, category }));
	};

	const handleLocationSelect = (location: Location) => {
		setFormData((prev) => ({ ...prev, location }));
	};

	if (isLoading) return <div>読み込み中...</div>;
	if (error) return <div>データ取得エラー</div>;

	return (
		<div className="space-y-4 md:space-y-8">
			<h1 className="text-xl md:text-3xl font-bold tracking-tighter-custom text-center mb-6 text-kuralis-900">
				カテゴリと設置場所を選んでください
			</h1>
			<div className="space-y-4">
				<div>
					<h2 className="text-sm font-bold tracking-tighter-custom text-kuralis-600 mb-4">
						カテゴリ
					</h2>
					<div className="grid grid-cols-2 gap-4">
						{data?.categories.map((category) => (
							<button
								key={category.id}
								onClick={() => handleCategorySelect(category)}
								className={`py-3 px-4 border rounded-sm transition-all duration-500 font-bold tracking-tighter-custom text-sm relative overflow-hidden group ${
									formData.category?.id === category.id
										? "border-kuralis-900 text-kuralis-900 bg-kuralis-100"
										: "border-kuralis-200 text-kuralis-600 hover:border-kuralis-400 hover:bg-kuralis-50"
								}`}
							>
								<span
									className={`absolute inset-0 bg-kuralis-100 transform origin-left transition-transform duration-500 ${
										formData.category?.id === category.id
											? "scale-x-100"
											: "scale-x-0"
									}`}
								/>
								<span className="relative z-10">{category.name}</span>
							</button>
						))}
					</div>
				</div>

				<div>
					<h2 className="text-sm font-bold tracking-tighter-custom text-kuralis-600 mb-6">
						設置場所
					</h2>
					<div className="grid grid-cols-2 gap-4">
						{data?.locations.map((location) => (
							<button
								key={location.id}
								onClick={() => handleLocationSelect(location)}
								className={`py-3 px-4 border rounded-sm transition-all duration-500 font-bold tracking-tighter-custom text-sm relative overflow-hidden group ${
									formData.location?.id === location.id
										? "border-kuralis-900 text-kuralis-900 bg-kuralis-100"
										: "border-kuralis-200 text-kuralis-600 hover:border-kuralis-400 hover:bg-kuralis-50"
								}`}
							>
								<span
									className={`absolute inset-0 bg-kuralis-100 transform origin-left transition-transform duration-500 ${
										formData.location?.id === location.id
											? "scale-x-100"
											: "scale-x-0"
									}`}
								/>
								<span className="relative z-10">{location.name}</span>
							</button>
						))}
					</div>
				</div>
			</div>
			<div className="pt-6">
				<button
					onClick={onNext}
					disabled={!isValid}
					className={`w-full py-3 px-4 rounded-sm flex items-center justify-center space-x-2 font-bold tracking-tighter-custom text-sm transition-all duration-300 ${
						isValid
							? "bg-kuralis-900 text-white hover:bg-kuralis-800"
							: "bg-kuralis-200 text-kuralis-400 cursor-not-allowed"
					}`}
				>
					<span>次へ</span>
					<FiArrowRight
						size={16}
						className="transform group-hover:translate-x-1 transition-transform duration-300"
					/>
				</button>
			</div>
		</div>
	);
}
