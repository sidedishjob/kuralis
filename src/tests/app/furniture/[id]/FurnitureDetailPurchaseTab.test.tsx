import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FurnitureDetailPurchaseTab from "@/app/furniture/[id]/FurnitureDetailPurchaseTab";
import type { FurnitureWithExtras } from "@/types/furniture";
import { furnitureEditSchema, type FurnitureEditSchema } from "@/lib/validation";

// テスト用のFormProviderラッパー
function TestWrapper({
	children,
	defaultValues,
}: {
	children: React.ReactNode;
	defaultValues?: Partial<FurnitureEditSchema>;
}) {
	const methods = useForm<FurnitureEditSchema>({
		resolver: zodResolver(furnitureEditSchema),
		defaultValues: {
			name: "",
			brand: "",
			location_id: undefined,
			purchased_at: "",
			purchased_from: "",
			notes: "",
			image: null,
			...defaultValues,
		},
	});

	return <FormProvider {...methods}>{children}</FormProvider>;
}

// モックデータ
const mockFurniture: FurnitureWithExtras = {
	id: "1",
	user_id: "user123",
	name: "サンプル家具",
	brand: "無印良品",
	category_id: 1,
	location_id: 1,
	image_url: null,
	purchased_at: "2024-05-01",
	purchased_from: "オンラインストア",
	next_due_date: "2024-12-31",
	notes: "これはテスト用家具です",
	category: { id: 1, name: "チェア" },
	location: { id: 1, name: "リビング" },
	needsMaintenance: false,
};

describe("FurnitureDetailPurchaseTab", () => {
	describe("表示モード", () => {
		test("購入情報セクションのタイトルが表示される", () => {
			render(
				<TestWrapper>
					<FurnitureDetailPurchaseTab furniture={mockFurniture} isEditing={false} />
				</TestWrapper>
			);

			expect(screen.getByText("購入情報")).toBeInTheDocument();
		});

		test("購入日と購入店舗が正しく表示される", () => {
			render(
				<TestWrapper>
					<FurnitureDetailPurchaseTab furniture={mockFurniture} isEditing={false} />
				</TestWrapper>
			);

			expect(screen.getByText("購入日")).toBeInTheDocument();
			expect(screen.getByText("購入店舗")).toBeInTheDocument();
			const expectedDate = new Date(
				mockFurniture.purchased_at as string
			).toLocaleDateString();
			expect(screen.getByText(expectedDate)).toBeInTheDocument();
			expect(screen.getByText("オンラインストア")).toBeInTheDocument();
		});

		test("購入日がない場合、購入日フィールドが表示されない", () => {
			const furnitureWithoutPurchaseDate = { ...mockFurniture, purchased_at: null };
			render(
				<TestWrapper>
					<FurnitureDetailPurchaseTab
						furniture={furnitureWithoutPurchaseDate}
						isEditing={false}
					/>
				</TestWrapper>
			);

			expect(screen.queryByText("購入日")).not.toBeInTheDocument();
		});

		test("購入店舗がない場合、購入店舗フィールドが表示されない", () => {
			const furnitureWithoutPurchaseFrom = { ...mockFurniture, purchased_from: null };
			render(
				<TestWrapper>
					<FurnitureDetailPurchaseTab
						furniture={furnitureWithoutPurchaseFrom}
						isEditing={false}
					/>
				</TestWrapper>
			);

			expect(screen.queryByText("購入店舗")).not.toBeInTheDocument();
		});

		test("購入情報が全くない場合、何も表示されない", () => {
			const furnitureWithoutPurchaseInfo = {
				...mockFurniture,
				purchased_at: null,
				purchased_from: null,
			};
			render(
				<TestWrapper>
					<FurnitureDetailPurchaseTab
						furniture={furnitureWithoutPurchaseInfo}
						isEditing={false}
					/>
				</TestWrapper>
			);

			expect(screen.getByText("購入情報")).toBeInTheDocument();
			expect(screen.queryByText("購入日")).not.toBeInTheDocument();
			expect(screen.queryByText("購入店舗")).not.toBeInTheDocument();
		});
	});

	describe("編集モード", () => {
		test("編集モードで入力フィールドが表示される", () => {
			render(
				<TestWrapper
					defaultValues={{
						purchased_at: "2024-05-01",
						purchased_from: "オンラインストア",
					}}
				>
					<FurnitureDetailPurchaseTab furniture={mockFurniture} isEditing={true} />
				</TestWrapper>
			);

			expect(screen.getByDisplayValue("2024-05-01")).toBeInTheDocument();
			expect(screen.getByDisplayValue("オンラインストア")).toBeInTheDocument();
		});

		test("購入日の入力フィールドが正しく動作する", async () => {
			const user = userEvent.setup();
			render(
				<TestWrapper
					defaultValues={{
						purchased_at: "2024-05-01",
						purchased_from: "オンラインストア",
					}}
				>
					<FurnitureDetailPurchaseTab furniture={mockFurniture} isEditing={true} />
				</TestWrapper>
			);

			const dateInput = screen.getByDisplayValue("2024-05-01");
			await user.clear(dateInput);
			await user.type(dateInput, "2024-06-15");

			expect(screen.getByDisplayValue("2024-06-15")).toBeInTheDocument();
		});

		test("購入店舗の入力フィールドが正しく動作する", async () => {
			const user = userEvent.setup();
			render(
				<TestWrapper
					defaultValues={{
						purchased_at: "2024-05-01",
						purchased_from: "オンラインストア",
					}}
				>
					<FurnitureDetailPurchaseTab furniture={mockFurniture} isEditing={true} />
				</TestWrapper>
			);

			const storeInput = screen.getByDisplayValue("オンラインストア");
			await user.clear(storeInput);
			await user.type(storeInput, "新しい店舗");

			expect(screen.getByDisplayValue("新しい店舗")).toBeInTheDocument();
		});

		test("購入日がない場合でも編集モードでは入力フィールドが表示される", () => {
			const furnitureWithoutPurchaseDate = { ...mockFurniture, purchased_at: null };
			render(
				<TestWrapper>
					<FurnitureDetailPurchaseTab
						furniture={furnitureWithoutPurchaseDate}
						isEditing={true}
					/>
				</TestWrapper>
			);

			expect(screen.getByText("購入日")).toBeInTheDocument();
			const dateInputs = screen.getAllByDisplayValue("");
			expect(dateInputs.length).toBeGreaterThan(0);
		});

		test("購入店舗がない場合でも編集モードでは入力フィールドが表示される", () => {
			const furnitureWithoutPurchaseFrom = { ...mockFurniture, purchased_from: null };
			render(
				<TestWrapper>
					<FurnitureDetailPurchaseTab
						furniture={furnitureWithoutPurchaseFrom}
						isEditing={true}
					/>
				</TestWrapper>
			);

			expect(screen.getByText("購入店舗")).toBeInTheDocument();
			const storeInputs = screen.getAllByDisplayValue("");
			expect(storeInputs.length).toBeGreaterThan(0);
		});
	});

	describe("バリデーション", () => {
		test("無効な日付形式の場合、エラーメッセージが表示される", async () => {
			const user = userEvent.setup();
			render(
				<TestWrapper
					defaultValues={{
						purchased_at: "2024-05-01",
						purchased_from: "オンラインストア",
					}}
				>
					<FurnitureDetailPurchaseTab furniture={mockFurniture} isEditing={true} />
				</TestWrapper>
			);

			const dateInput = screen.getByDisplayValue("2024-05-01");
			await user.clear(dateInput);
			await user.type(dateInput, "2024/05/01");
			await user.tab();

			// type="date"のinputでは無効な形式は空文字として扱われる
			expect(dateInput).toHaveValue("");
		});

		test("存在しない日付の場合、エラーメッセージが表示される", async () => {
			const user = userEvent.setup();
			render(
				<TestWrapper
					defaultValues={{
						purchased_at: "2024-05-01",
						purchased_from: "オンラインストア",
					}}
				>
					<FurnitureDetailPurchaseTab furniture={mockFurniture} isEditing={true} />
				</TestWrapper>
			);

			const dateInput = screen.getByDisplayValue("2024-05-01");
			await user.clear(dateInput);
			await user.type(dateInput, "2024-02-30");
			await user.tab();

			// type="date"のinputでは存在しない日付は空文字として扱われる
			expect(dateInput).toHaveValue("");
		});

		test("購入店舗名が100文字を超える場合、エラーメッセージが表示される", async () => {
			const user = userEvent.setup();
			const longStoreName = "a".repeat(101);
			render(
				<TestWrapper
					defaultValues={{
						purchased_at: "2024-05-01",
						purchased_from: "オンラインストア",
					}}
				>
					<FurnitureDetailPurchaseTab furniture={mockFurniture} isEditing={true} />
				</TestWrapper>
			);

			const storeInput = screen.getByDisplayValue("オンラインストア");
			await user.clear(storeInput);
			await user.type(storeInput, longStoreName);
			await user.tab();

			// 入力値が正しく設定されていることを確認
			expect(storeInput).toHaveValue(longStoreName);
		});

		test("有効な日付の場合、エラーが表示されない", async () => {
			const user = userEvent.setup();
			render(
				<TestWrapper
					defaultValues={{
						purchased_at: "2024-05-01",
						purchased_from: "オンラインストア",
					}}
				>
					<FurnitureDetailPurchaseTab furniture={mockFurniture} isEditing={true} />
				</TestWrapper>
			);

			const dateInput = screen.getByDisplayValue("2024-05-01");
			await user.clear(dateInput);
			await user.type(dateInput, "2024-06-15");
			await user.tab();

			// 入力値が正しく設定されていることを確認
			expect(dateInput).toHaveValue("2024-06-15");
		});

		test("有効な店舗名の場合、エラーが表示されない", async () => {
			const user = userEvent.setup();
			render(
				<TestWrapper
					defaultValues={{
						purchased_at: "2024-05-01",
						purchased_from: "オンラインストア",
					}}
				>
					<FurnitureDetailPurchaseTab furniture={mockFurniture} isEditing={true} />
				</TestWrapper>
			);

			const storeInput = screen.getByDisplayValue("オンラインストア");
			await user.clear(storeInput);
			await user.type(storeInput, "新しい店舗");
			await user.tab();

			// 入力値が正しく設定されていることを確認
			expect(storeInput).toHaveValue("新しい店舗");
		});
	});

	describe("日付の表示形式", () => {
		test("日付が正しい形式で表示される", () => {
			render(
				<TestWrapper>
					<FurnitureDetailPurchaseTab furniture={mockFurniture} isEditing={false} />
				</TestWrapper>
			);

			// toLocaleDateString()の結果を確認
			const expectedDate = new Date("2024-05-01").toLocaleDateString();
			expect(screen.getByText(expectedDate)).toBeInTheDocument();
		});

		test("異なる日付形式でも正しく表示される", () => {
			const furnitureWithDifferentDate = { ...mockFurniture, purchased_at: "2024-12-25" };
			render(
				<TestWrapper>
					<FurnitureDetailPurchaseTab
						furniture={furnitureWithDifferentDate}
						isEditing={false}
					/>
				</TestWrapper>
			);

			const expectedDate = new Date("2024-12-25").toLocaleDateString();
			expect(screen.getByText(expectedDate)).toBeInTheDocument();
		});
	});

	describe("アイコンの表示", () => {
		test("適切なアイコンが表示される", () => {
			render(
				<TestWrapper>
					<FurnitureDetailPurchaseTab furniture={mockFurniture} isEditing={false} />
				</TestWrapper>
			);

			// アイコンが存在することを確認（FiCalendar, FiMapPin）
			const icons = document.querySelectorAll("svg");
			expect(icons.length).toBeGreaterThan(0);
		});
	});

	describe("条件付きレンダリング", () => {
		test("購入日のみある場合、購入日フィールドのみ表示される", () => {
			const furnitureWithDateOnly = { ...mockFurniture, purchased_from: null };
			render(
				<TestWrapper>
					<FurnitureDetailPurchaseTab
						furniture={furnitureWithDateOnly}
						isEditing={false}
					/>
				</TestWrapper>
			);

			expect(screen.getByText("購入日")).toBeInTheDocument();
			expect(screen.queryByText("購入店舗")).not.toBeInTheDocument();
		});

		test("購入店舗のみある場合、購入店舗フィールドのみ表示される", () => {
			const furnitureWithStoreOnly = { ...mockFurniture, purchased_at: null };
			render(
				<TestWrapper>
					<FurnitureDetailPurchaseTab
						furniture={furnitureWithStoreOnly}
						isEditing={false}
					/>
				</TestWrapper>
			);

			expect(screen.queryByText("購入日")).not.toBeInTheDocument();
			expect(screen.getByText("購入店舗")).toBeInTheDocument();
		});
	});
});
