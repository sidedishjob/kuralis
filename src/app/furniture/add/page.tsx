"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiArrowRight, FiUpload, FiX } from "react-icons/fi";
import { toast } from "@/hooks/use-toast";
import { sampleFurniture } from "@/data/sampleFurniture";

const categories = ["ソファ", "テーブル", "チェア", "照明", "収納", "その他"];
const locations = ["リビング", "寝室", "キッチン", "玄関", "書斎", "その他"];

interface StepIndicatorProps {
	currentStep: number;
	totalSteps: number;
}

// ステップ表示用のインジケーター
const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => (
	<div className="flex items-center justify-center space-x-3">
		{Array.from({ length: totalSteps }).map((_, index) => (
			<div key={index} className="flex items-center">
				<div
					className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
						index + 1 <= currentStep ? "bg-kuralis-900" : "bg-kuralis-200"
					} ${index + 1 === currentStep ? "scale-125" : ""}`}
				/>
				{index < totalSteps - 1 && (
					<div
						className={`w-16 h-px mx-2 transition-all duration-500 ${
							index + 1 < currentStep ? "bg-kuralis-900" : "bg-kuralis-200"
						}`}
					/>
				)}
			</div>
		))}
	</div>
);

const AddFurniturePage: React.FC = () => {
	const router = useRouter();
	const [step, setStep] = useState(1);
	const [formData, setFormData] = useState({
		category: "",
		location: "",
		name: "",
		image: null as File | null,
	});

	const handleCategorySelect = (category: string) => {
		setFormData((prev) => ({ ...prev, category }));
	};

	const handleLocationSelect = (location: string) => {
		setFormData((prev) => ({ ...prev, location }));
	};

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] || null;
		if (file && file.type.startsWith("image/")) {
			setFormData((prev) => ({ ...prev, image: file }));
		}
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		const file = event.dataTransfer.files[0];
		if (file && file.type.startsWith("image/")) {
			setFormData((prev) => ({ ...prev, image: file }));
		}
	};

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
	};

	const isStep1Valid = formData.category && formData.location;
	const isStep2Valid = formData.name.trim().length > 0;

	const handleSubmit = () => {
		const newFurniture = {
			id: (sampleFurniture.length + 1).toString(),
			name: formData.name,
			brand: "Unknown",
			category: formData.category,
			location: formData.location,
			needsMaintenance: false,
			imageUrl: formData.image ? URL.createObjectURL(formData.image) : undefined,
		};

		sampleFurniture.unshift(newFurniture);

		toast({
			title: "家具を登録しました",
			description: `${formData.name}を${formData.location}に登録しました。`,
		});

		router.push("/furniture");
	};

	const renderSummary = () => (
		<div className="flex items-center space-x-4 mb-8 text-xs">
			<div className="px-2 py-1 bg-kuralis-100 text-kuralis-600 rounded-sm font-bold tracking-tighter-custom">
				{formData.category}
			</div>
			<div className="px-2 py-1 bg-kuralis-100 text-kuralis-600 rounded-sm font-bold tracking-tighter-custom">
				{formData.location}
			</div>
		</div>
	);

	return (
		<div className="flex flex-col from-white to-kuralis-50">
			<header className="sticky top-0 bg-white border-b border-kuralis-200 py-4">
				<div className="container mx-auto max-w-2xl px-6 md:px-12">
					<div className="grid grid-cols-3 items-center">
						<button
							onClick={() => (step === 1 ? router.push("/furniture") : setStep(1))}
							className="text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 group"
						>
							<div className="flex items-center">
								<FiArrowLeft
									size={20}
									className="transform group-hover:-translate-x-1 transition-transform duration-300"
								/>
								<span className="hidden md:inline ml-2 font-bold tracking-tighter-custom">
									{step === 1 ? "Back to Collection" : "Previous Step"}
								</span>
							</div>
						</button>
						<StepIndicator currentStep={step} totalSteps={2} />
						<div />
					</div>
				</div>
			</header>

			<main className="flex-grow container mx-auto max-w-2xl px-6 md:px-12 py-6">
				{step === 1 ? (
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
									{categories.map((category) => (
										<button
											key={category}
											onClick={() => handleCategorySelect(category)}
											className={`py-3 px-4 border rounded-sm transition-all duration-500 font-bold tracking-tighter-custom text-sm relative overflow-hidden group ${
												formData.category === category
													? "border-kuralis-900 text-kuralis-900 bg-kuralis-100"
													: "border-kuralis-200 text-kuralis-600 hover:border-kuralis-400 hover:bg-kuralis-50"
											}`}
										>
											<span
												className={`absolute inset-0 bg-kuralis-100 transform origin-left transition-transform duration-500 ${
													formData.category === category
														? "scale-x-100"
														: "scale-x-0"
												}`}
											/>
											<span className="relative z-10">{category}</span>
										</button>
									))}
								</div>
							</div>

							<div>
								<h2 className="text-sm font-bold tracking-tighter-custom text-kuralis-600 mb-6">
									設置場所
								</h2>
								<div className="grid grid-cols-2 gap-4">
									{locations.map((location) => (
										<button
											key={location}
											onClick={() => handleLocationSelect(location)}
											className={`py-3 px-4 border rounded-sm transition-all duration-500 font-bold tracking-tighter-custom text-sm relative overflow-hidden group ${
												formData.location === location
													? "border-kuralis-900 text-kuralis-900 bg-kuralis-100"
													: "border-kuralis-200 text-kuralis-600 hover:border-kuralis-400 hover:bg-kuralis-50"
											}`}
										>
											<span
												className={`absolute inset-0 bg-kuralis-100 transform origin-left transition-transform duration-500 ${
													formData.location === location
														? "scale-x-100"
														: "scale-x-0"
												}`}
											/>
											<span className="relative z-10">{location}</span>
										</button>
									))}
								</div>
							</div>
						</div>

						<div className="pt-6">
							<button
								onClick={() => setStep(2)}
								disabled={!isStep1Valid}
								className={`w-full py-3 px-4 rounded-sm flex items-center justify-center space-x-2 font-bold tracking-tighter-custom text-sm transition-all duration-300 ${
									isStep1Valid
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
				) : (
					<div className="space-y-4 md:space-y-8">
						<h1 className="text-xl md:text-3xl font-bold tracking-tighter-custom text-center mb-6 text-kuralis-900">
							家具の名前と写真を入力してください
						</h1>

						{renderSummary()}

						<div className="space-y-6">
							<div>
								<label className="text-sm font-bold tracking-tighter-custom text-kuralis-600 mb-4 block">
									家具名
								</label>
								<input
									type="text"
									value={formData.name}
									onChange={(e) =>
										setFormData((prev) => ({ ...prev, name: e.target.value }))
									}
									className="w-full px-6 py-4 border border-kuralis-200 rounded-sm focus:border-kuralis-900 outline-none transition-all duration-500 font-bold tracking-tighter-custom bg-white/80 backdrop-blur-sm focus:bg-white"
									placeholder="例：ウォールナットダイニングテーブル"
								/>
							</div>

							<div>
								<label className="text-sm font-bold tracking-tighter-custom text-kuralis-600 mb-4 block">
									写真
								</label>
								<div
									onDrop={handleDrop}
									onDragOver={handleDragOver}
									className="border-2 border-dashed border-kuralis-200 rounded-sm p-6 text-center hover:border-kuralis-400 transition-all duration-500 bg-white/80 backdrop-blur-sm group"
								>
									<input
										type="file"
										accept="image/*"
										onChange={handleImageChange}
										className="hidden"
										id="furniture-image"
									/>
									{formData.image ? (
										<div className="space-y-2">
											<div className="relative w-full aspect-[4/3] overflow-hidden rounded-sm bg-kuralis-50">
												<img
													src={URL.createObjectURL(formData.image)}
													alt="Preview"
													className="w-full h-full object-cover"
												/>
												<button
													onClick={(e) => {
														e.preventDefault();
														setFormData((prev) => ({
															...prev,
															image: null,
														}));
													}}
													className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors duration-300"
												>
													<FiX size={16} className="text-kuralis-900" />
												</button>
											</div>
											<div className="text-sm text-kuralis-900 font-bold tracking-tighter-custom">
												{formData.image.name}
											</div>
											<button
												onClick={(e) => {
													e.preventDefault();
													document
														.getElementById("furniture-image")
														?.click();
												}}
												className="text-sm text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 font-bold tracking-tighter-custom"
											>
												写真を変更
											</button>
										</div>
									) : (
										<label
											htmlFor="furniture-image"
											className="cursor-pointer space-y-2 w-full aspect-[4/3] flex flex-col items-center justify-center bg-kuralis-50/50"
										>
											<FiUpload
												size={32}
												className="mx-auto text-kuralis-400 group-hover:scale-110 transition-transform duration-500"
											/>
											<div className="text-sm text-kuralis-600 font-bold tracking-tighter-custom">
												クリックまたはドラッグ＆ドロップで写真をアップロード
											</div>
										</label>
									)}
								</div>
							</div>
						</div>

						<div className="pt-8">
							<button
								onClick={handleSubmit}
								disabled={!isStep2Valid}
								className={`w-full py-3 px-4 rounded-sm font-bold tracking-tighter-custom text-sm transition-all duration-300 ${
									isStep2Valid
										? "bg-kuralis-900 text-white hover:bg-kuralis-800 transform hover:-translate-y-1"
										: "bg-kuralis-200 text-kuralis-400 cursor-not-allowed"
								}`}
							>
								登録する
							</button>
						</div>
					</div>
				)}
			</main>
		</div>
	);
};

export default AddFurniturePage;
