import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FurnitureListClient from "@/app/furniture/FurnitureListClient";
import type { Furniture } from "@/types/furniture";
import type { Category, Location } from "@/types/furniture_meta";

// モックデータ
const mockFurniture: Furniture[] = [
	{
		id: "1",
		user_id: "user1",
		name: "チェアA",
		brand: "Herman Miller",
		category_id: 10,
		location_id: 100,
		image_url: "https://example.com/chair.jpg",
		purchased_at: "2023-01-15",
		purchased_from: "Amazon",
		next_due_date: "2024-01-15",
		notes: "保証期間内",
	},
	{
		id: "2",
		user_id: "",
		name: "テーブルB",
		brand: "無印良品",
		category_id: 20,
		location_id: 200,
		image_url: null,
		purchased_at: null,
		purchased_from: null,
		next_due_date: null,
		notes: null,
	},
];

const mockCategories: Category[] = [
	{ id: 10, name: "チェア" },
	{ id: 20, name: "テーブル" },
];

const mockLocations: Location[] = [
	{ id: 100, name: "リビング" },
	{ id: 200, name: "ダイニング" },
];

describe("FurnitureListClient", () => {
	// localStorageのモック
	beforeEach(() => {
		vi.spyOn(window.localStorage.__proto__, "getItem").mockReturnValue("true");
		vi.spyOn(window.localStorage.__proto__, "setItem").mockImplementation(() => {});
	});

	describe("初期表示", () => {
		test("家具一覧が表示される", () => {
			render(
				<FurnitureListClient
					initialFurniture={mockFurniture}
					initialCategories={mockCategories}
					initialLocations={mockLocations}
				/>
			);
			expect(screen.getByText("チェアA")).toBeInTheDocument();
			expect(screen.getByText("テーブルB")).toBeInTheDocument();
		});

		test("家具が存在しない場合にメッセージを表示", () => {
			render(
				<FurnitureListClient
					initialFurniture={[]}
					initialCategories={mockCategories}
					initialLocations={mockLocations}
				/>
			);
			expect(screen.getByText("家具が登録されていません。")).toBeInTheDocument();
			expect(screen.getByText("家具を登録する")).toHaveAttribute(
				"href",
				"/furniture/register"
			);
		});
	});

	describe("検索機能", () => {
		test("家具名でフィルターされる", async () => {
			const user = userEvent.setup();
			render(
				<FurnitureListClient
					initialFurniture={mockFurniture}
					initialCategories={mockCategories}
					initialLocations={mockLocations}
				/>
			);
			const input = screen.getByPlaceholderText("search...");
			await user.clear(input);
			await user.type(input, "チェア");
			expect(screen.getByText("チェアA")).toBeInTheDocument();
			expect(screen.queryByText("テーブルB")).not.toBeInTheDocument();
		});

		test("ブランド名でもフィルターされる", async () => {
			const user = userEvent.setup();
			render(
				<FurnitureListClient
					initialFurniture={mockFurniture}
					initialCategories={mockCategories}
					initialLocations={mockLocations}
				/>
			);
			const input = screen.getByPlaceholderText("search...");
			await user.clear(input);
			await user.type(input, "無印");
			expect(screen.getByText("テーブルB")).toBeInTheDocument();
			expect(screen.queryByText("チェアA")).not.toBeInTheDocument();
		});
	});

	describe("フィルタ機能", () => {
		test("カテゴリフィルタが動作する", async () => {
			const user = userEvent.setup();
			render(
				<FurnitureListClient
					initialFurniture={mockFurniture}
					initialCategories={mockCategories}
					initialLocations={mockLocations}
				/>
			);

			await user.click(screen.getByText("Category"));
			await user.click(screen.getByText("チェア"));

			expect(screen.getByText("チェアA")).toBeInTheDocument();
			expect(screen.queryByText("テーブルB")).not.toBeInTheDocument();
		});

		test("ロケーションフィルタが動作する", async () => {
			const user = userEvent.setup();
			render(
				<FurnitureListClient
					initialFurniture={mockFurniture}
					initialCategories={mockCategories}
					initialLocations={mockLocations}
				/>
			);

			await user.click(screen.getByText("Location"));
			await user.click(screen.getByText("ダイニング"));

			expect(screen.getByText("テーブルB")).toBeInTheDocument();
			expect(screen.queryByText("チェアA")).not.toBeInTheDocument();
		});
	});

	describe("オンボーディング", () => {
		beforeEach(() => {
			vi.clearAllMocks();
			vi.spyOn(window.localStorage.__proto__, "setItem").mockImplementation(() => {});
		});

		test("localStorage未設定でオンボーディングが表示される", () => {
			vi.spyOn(window.localStorage.__proto__, "getItem").mockReturnValue(null);

			render(
				<FurnitureListClient
					initialFurniture={mockFurniture}
					initialCategories={mockCategories}
					initialLocations={mockLocations}
				/>
			);

			expect(screen.getByText("家具と暮らすための記録アプリ")).toBeInTheDocument(); // ステップ1
			expect(screen.getByText("次へ")).toBeInTheDocument();
		});

		test("次へボタンでステップが進む", async () => {
			vi.spyOn(window.localStorage.__proto__, "getItem").mockReturnValue(null);
			const user = userEvent.setup();

			render(
				<FurnitureListClient
					initialFurniture={mockFurniture}
					initialCategories={mockCategories}
					initialLocations={mockLocations}
				/>
			);

			await user.click(screen.getByText("次へ"));

			expect(screen.getByText("主な機能")).toBeInTheDocument(); // ステップ2
		});

		test("スキップボタンでオンボーディングが終了し、localStorageが設定される", async () => {
			const setItemMock = window.localStorage.setItem;
			vi.spyOn(window.localStorage.__proto__, "getItem").mockReturnValue(null);
			const user = userEvent.setup();

			render(
				<FurnitureListClient
					initialFurniture={mockFurniture}
					initialCategories={mockCategories}
					initialLocations={mockLocations}
				/>
			);

			await user.click(screen.getByText("スキップ"));

			expect(setItemMock).toHaveBeenCalledWith("hasSeenOnboarding", "true");
			expect(screen.queryByText("次へ")).not.toBeInTheDocument();
		});

		test("最終ステップで完了ボタンをクリックするとlocalStorageに設定される", async () => {
			const setItemMock = window.localStorage.setItem;
			vi.spyOn(window.localStorage.__proto__, "getItem").mockReturnValue(null);
			const user = userEvent.setup();

			render(
				<FurnitureListClient
					initialFurniture={mockFurniture}
					initialCategories={mockCategories}
					initialLocations={mockLocations}
				/>
			);

			await user.click(screen.getByText("次へ"));
			await user.click(screen.getByText("次へ"));

			expect(screen.getByText("さっそく始めましょう")).toBeInTheDocument(); // 最終ステップ
			await user.click(screen.getByText("家具を登録する"));

			expect(setItemMock).toHaveBeenCalledWith("hasSeenOnboarding", "true");
			expect(screen.queryByText("次へ")).not.toBeInTheDocument();
		});
	});

	describe("エラーハンドリング", () => {
		test("初期データがundefinedでもクラッシュしない", () => {
			render(
				<FurnitureListClient
					initialFurniture={undefined as unknown as Furniture[]}
					initialCategories={mockCategories}
					initialLocations={mockLocations}
				/>
			);

			expect(screen.getByText("家具が登録されていません。")).toBeInTheDocument();
		});

		test("カテゴリやロケーションが空でも動作する", () => {
			render(
				<FurnitureListClient
					initialFurniture={mockFurniture}
					initialCategories={[]}
					initialLocations={[]}
				/>
			);

			expect(screen.getByText("チェアA")).toBeInTheDocument();
			expect(screen.getByText("テーブルB")).toBeInTheDocument();
		});
	});
});
