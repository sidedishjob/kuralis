"use client";

interface StepIndicatorProps {
	currentStep: number;
	totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
	return (
		<div className="flex items-center justify-center">
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
};

export default StepIndicator;
