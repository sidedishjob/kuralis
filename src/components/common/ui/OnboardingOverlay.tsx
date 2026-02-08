"use client";

import React from "react";
import Link from "next/link";
import { FiHeart, FiBook, FiPlus, FiX } from "react-icons/fi";

interface OnboardingStep {
	title: string;
	description: string;
	icon: React.ReactNode;
}

interface OnboardingOverlayProps {
	currentStep: number;
	onNext: () => void;
	onSkip: () => void;
	onComplete: () => void;
}

const STEPS: OnboardingStep[] = [
	{
		title: "家具と暮らすための記録アプリ",
		description:
			"kuralisは、家具との思い出を記録し、適切なメンテナンスをサポートするアプリです。",
		icon: <FiHeart className="size-8" />,
	},
	{
		title: "主な機能",
		description:
			"家具の登録、メンテナンス記録の管理、次回メンテナンス予定の確認など、家具との暮らしをより豊かにする機能を提供します。",
		icon: <FiBook className="size-8" />,
	},
	{
		title: "さっそく始めましょう",
		description: "家具を登録して、メンテナンス記録を始めましょう。",
		icon: <FiPlus className="size-8" />,
	},
];

export function OnboardingOverlay({
	currentStep,
	onNext,
	onSkip,
	onComplete,
}: OnboardingOverlayProps) {
	const currentStepData = STEPS[currentStep - 1];

	return (
		<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
			<div className="bg-white rounded-lg max-w-md w-full p-8 relative">
				<button
					onClick={onSkip}
					className="absolute top-4 right-4 text-kuralis-400 hover:text-kuralis-600 transition-colors duration-300"
					aria-label="スキップ"
				>
					<FiX size={20} />
				</button>

				<div className="text-center space-y-6">
					<div className="size-16 rounded-full bg-kuralis-100 flex items-center justify-center mx-auto text-kuralis-600">
						{currentStepData.icon}
					</div>

					<div className="space-y-2">
						<h2 className="text-xl font-bold tracking-tighter-custom">
							{currentStepData.title}
						</h2>
						<p className="text-sm text-kuralis-600">{currentStepData.description}</p>
					</div>

					<div className="flex justify-center space-x-2">
						{STEPS.map((_, index) => (
							<div
								key={index}
								className={`size-2 rounded-full transition-all duration-300 ${
									index + 1 === currentStep
										? "bg-kuralis-900 scale-125"
										: "bg-kuralis-200"
								}`}
							/>
						))}
					</div>

					<div className="space-y-3 pt-4">
						{currentStep === STEPS.length ? (
							<Link
								href="/furniture/register"
								onClick={onComplete}
								className="block w-full py-3 bg-kuralis-900 text-white rounded-sm hover:bg-kuralis-800 transition-colors duration-300 text-sm font-bold tracking-tighter-custom"
							>
								家具を登録する
							</Link>
						) : (
							<button
								onClick={onNext}
								className="w-full py-3 bg-kuralis-900 text-white rounded-sm hover:bg-kuralis-800 transition-colors duration-300 text-sm font-bold tracking-tighter-custom"
							>
								次へ
							</button>
						)}

						<button
							onClick={onSkip}
							className="w-full py-3 text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 text-sm font-bold tracking-tighter-custom"
						>
							スキップ
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
