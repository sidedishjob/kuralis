import { render } from "@testing-library/react";
import StepIndicator from "@/app/furniture/register/StepIndicator";

describe("StepIndicator", () => {
	test("ステップ数に応じて丸が表示される", () => {
		const { container } = render(<StepIndicator currentStep={1} totalSteps={3} />);
		const dots = container.querySelectorAll("div.rounded-full");
		expect(dots.length).toBe(3);
	});

	test("現在のステップに応じてアクティブな丸が変わる", () => {
		const { container } = render(<StepIndicator currentStep={2} totalSteps={3} />);
		const dots = container.querySelectorAll("div.rounded-full");

		expect(dots[0]).toHaveClass("bg-kuralis-900");
		expect(dots[1]).toHaveClass("bg-kuralis-900");
		expect(dots[1]).toHaveClass("scale-125");
		expect(dots[2]).toHaveClass("bg-kuralis-200");
	});

	test("ステップ間の線がステップに応じて色が変わる", () => {
		const { container } = render(<StepIndicator currentStep={2} totalSteps={3} />);
		const lines = container.querySelectorAll("div.w-16");

		expect(lines[0]).toHaveClass("bg-kuralis-900"); // step 1→2 は完了
		expect(lines[1]).toHaveClass("bg-kuralis-200"); // step 2→3 は未完了
	});
});
