"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { zodResolver } from "@hookform/resolvers/zod";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { registerFurnitureSchema, type RegisterFurnitureSchema } from "@/lib/validation";
import StepIndicator from "./StepIndicator";
import Step1UI from "./Step1UI";
import Step2UI from "./Step2UI";
import { useToast } from "@/hooks/useToast";
import { useRegisterFurniture } from "@/hooks/useRegisterFurniture";
import type { Category, Location } from "@/types/furniture_meta";

export default function RegisterFurnitureClient() {
	const router = useRouter();
	const [step, setStep] = useState(1);
	const [category, setCategory] = useState<Category | null>(null);
	const [location, setLocation] = useState<Location | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();
	const { register } = useRegisterFurniture();

	const {
		register: formRegister,
		handleSubmit,
		formState: { errors, isValid },
		getValues,
		setValue,
	} = useForm<RegisterFurnitureSchema>({
		resolver: zodResolver(registerFurnitureSchema),
		defaultValues: {
			name: "",
			image: null,
		},
		mode: "onChange",
	});

	const handleFinalSubmit = async (data: RegisterFurnitureSchema) => {
		if (!category || !location) {
			toast({
				title: "STEP1の入力に不備があります",
				description: "カテゴリと設置場所を選択してください",
				variant: "destructive",
			});
			return;
		}

		const form = new FormData();
		form.append("name", data.name);
		form.append("category_id", String(category.id));
		form.append("location_id", String(location.id));
		if (data.image) form.append("image", data.image);

		setIsLoading(true);

		try {
			await register(form);

			toast({
				title: "家具を登録しました",
				description: `${data.name} を ${location.name} に登録しました。`,
			});
			router.push("/furniture");
			router.refresh();
		} catch (error: unknown) {
			console.error("家具登録エラー:", error);
			toast({
				title: "家具の登録に失敗しました",
				description: getErrorMessage(error, "もう一度お試しください"),
				variant: "destructive",
			});
			setIsLoading(false);
		}
	};

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

			<main className="grow container mx-auto max-w-2xl px-6 md:px-12 py-6">
				{step === 1 ? (
					<Step1UI
						category={category}
						location={location}
						setCategory={setCategory}
						setLocation={setLocation}
						onNext={() => setStep(2)}
					/>
				) : (
					<Step2UI
						category={category}
						location={location}
						formRegister={formRegister}
						setValue={setValue}
						getValues={getValues}
						errors={errors}
						onSubmit={handleSubmit(handleFinalSubmit)}
						isValid={isValid}
						isLoading={isLoading}
					/>
				)}
			</main>
		</div>
	);
}
