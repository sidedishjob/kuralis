import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Step1UI from "@/app/furniture/register/Step1UI";

// 共通props
const baseProps = {
	category: null,
	location: null,
	setCategory: vi.fn(),
	setLocation: vi.fn(),
	onNext: vi.fn(),
};

// useFurnitureMeta を直接モック
vi.mock("@/hooks/useFurnitureMeta", () => ({
	useFurnitureMeta: () => ({
		isLoading: false,
		error: null,
		data: {
			categories: [
				{ id: 1, name: "チェア" },
				{ id: 2, name: "ソファ" },
			],
			locations: [
				{ id: 1, name: "リビング" },
				{ id: 2, name: "寝室" },
			],
		},
	}),
}));

describe("Step1UI", () => {
	const setCategory = vi.fn();
	const setLocation = vi.fn();
	const onNext = vi.fn();

	beforeEach(() => {
		setCategory.mockClear();
		setLocation.mockClear();
		onNext.mockClear();
	});

	test("カテゴリ・設置場所が表示される", () => {
		render(
			<Step1UI
				category={null}
				location={null}
				setCategory={setCategory}
				setLocation={setLocation}
				onNext={onNext}
			/>
		);

		expect(screen.getByText("チェア")).toBeInTheDocument();
		expect(screen.getByText("ソファ")).toBeInTheDocument();
		expect(screen.getByText("リビング")).toBeInTheDocument();
		expect(screen.getByText("寝室")).toBeInTheDocument();
	});

	test("カテゴリボタンをクリックすると setCategory が呼ばれる", async () => {
		const user = userEvent.setup();
		render(
			<Step1UI
				category={null}
				location={null}
				setCategory={setCategory}
				setLocation={setLocation}
				onNext={onNext}
			/>
		);

		await user.click(screen.getByText("ソファ"));
		expect(setCategory).toHaveBeenCalledWith({ id: 2, name: "ソファ" });
	});

	test("設置場所ボタンをクリックすると setLocation が呼ばれる", async () => {
		const user = userEvent.setup();
		render(
			<Step1UI
				category={null}
				location={null}
				setCategory={setCategory}
				setLocation={setLocation}
				onNext={onNext}
			/>
		);

		await user.click(screen.getByText("寝室"));
		expect(setLocation).toHaveBeenCalledWith({ id: 2, name: "寝室" });
	});

	test("カテゴリと設置場所が選択されていると onNext が呼ばれる", async () => {
		const user = userEvent.setup();
		render(
			<Step1UI
				category={{ id: 1, name: "チェア" }}
				location={{ id: 1, name: "リビング" }}
				setCategory={setCategory}
				setLocation={setLocation}
				onNext={onNext}
			/>
		);

		await user.click(screen.getByText("次へ"));
		expect(onNext).toHaveBeenCalled();
	});
});
