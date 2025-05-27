"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { toast } from "@/hooks/use-toast";
import StepIndicator from "./StepIndicator";
import Step1UI from "./Step1UI";
import Step2UI from "./Step2UI";
import { Category, Location } from "@/types/furniture_meta";

interface FormData {
	category: Category | null;
	location: Location | null;
	name: string;
	image: File | null;
}

const AddFurnitureClient = () => {
	const router = useRouter();
	const [step, setStep] = useState(1);
	const [formData, setFormData] = useState<FormData>({
		category: null,
		location: null,
		name: "",
		image: null,
	});

	const handleSubmit = async () => {
		const form = new FormData();
		form.append("name", formData.name);
		form.append("category_id", String(formData.category?.id));
		form.append("location_id", String(formData.location?.id));
		if (formData.image) form.append("image", formData.image);

		const res = await fetch("/api/furniture", {
			method: "POST",
			body: form,
		});

		const result = await res.json();
		if (!res.ok) {
			toast({ title: "登録失敗", description: result.error });
			return;
		}

		toast({
			title: "家具を登録しました",
			description: `${formData.name}を${formData.location?.name}に登録しました。`,
		});
		router.push("/furniture");
	};

	// const handleSubmit = () => {
	// 	const newFurniture = {
	// 		id: (sampleFurniture.length + 1).toString(),
	// 		name: formData.name,
	// 		brand: "Unknown",
	// 		category: formData.category,
	// 		location: formData.location,
	// 		needsMaintenance: false,
	// 		imageUrl: formData.image ? URL.createObjectURL(formData.image) : undefined,
	// 	};

	// 	sampleFurniture.unshift(newFurniture);

	// 	toast({
	// 		title: "家具を登録しました",
	// 		description: `${formData.name}を${formData.location}に登録しました。`,
	// 	});

	// 	router.push("/furniture");
	// };

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
					<Step1UI
						formData={formData}
						setFormData={setFormData}
						onNext={() => setStep(2)}
					/>
				) : (
					<Step2UI
						formData={formData}
						setFormData={setFormData}
						onSubmit={handleSubmit}
					/>
				)}
			</main>
		</div>
	);
};

export default AddFurnitureClient;
