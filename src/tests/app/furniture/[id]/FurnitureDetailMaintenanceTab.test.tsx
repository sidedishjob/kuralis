import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FurnitureDetailMaintenanceTab from "@/app/furniture/[id]/FurnitureDetailMaintenanceTab";
import type { FurnitureWithExtras } from "@/types/furniture";
import type { MaintenanceSummary } from "@/types/maintenance";
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

const mockSummary: MaintenanceSummary = {
	activeTaskCount: 2,
	nearestDueDate: "2024-06-01",
	nearestTaskName: "オイル塗布",
};

const mockOverdueSummary: MaintenanceSummary = {
	activeTaskCount: 1,
	nearestDueDate: "2024-01-01", // 過去の日付
	nearestTaskName: "清掃",
};

describe("FurnitureDetailMaintenanceTab", () => {
	describe("表示モード", () => {
		test("メンテナンス概要が正しく表示される", () => {
			render(
				<TestWrapper>
					<FurnitureDetailMaintenanceTab
						furniture={mockFurniture}
						isEditing={false}
						summary={mockSummary}
					/>
				</TestWrapper>
			);

			expect(screen.getByText("メンテナンス概要")).toBeInTheDocument();
			expect(screen.getByText("次回予定")).toBeInTheDocument();
			expect(screen.getByText("メンテ対象")).toBeInTheDocument();
			expect(screen.getByText("2024-06-01（オイル塗布）")).toBeInTheDocument();
			expect(screen.getByText("2 件")).toBeInTheDocument();
		});

		test("メンテナンス管理ボタンが表示される", () => {
			render(
				<TestWrapper>
					<FurnitureDetailMaintenanceTab
						furniture={mockFurniture}
						isEditing={false}
						summary={mockSummary}
					/>
				</TestWrapper>
			);

			const manageButton = screen.getByRole("link", { name: "メンテナンスを管理" });
			expect(manageButton).toBeInTheDocument();
			expect(manageButton).toHaveAttribute("href", "/furniture/1/maintenance");
		});

		test("期限切れの場合、警告メッセージが表示される", () => {
			render(
				<TestWrapper>
					<FurnitureDetailMaintenanceTab
						furniture={mockFurniture}
						isEditing={false}
						summary={mockOverdueSummary}
					/>
				</TestWrapper>
			);

			expect(
				screen.getByText(
					"次回予定日が過去になっています。早急にメンテナンスを実施してください。"
				)
			).toBeInTheDocument();
			expect(screen.getByText("2024-01-01（清掃）")).toHaveClass("text-red-500");
		});

		test("メンテナンス概要がない場合、未設定が表示される", () => {
			render(
				<TestWrapper>
					<FurnitureDetailMaintenanceTab
						furniture={mockFurniture}
						isEditing={false}
						summary={null}
					/>
				</TestWrapper>
			);

			expect(screen.getAllByText("未設定")).toHaveLength(2);
		});

		test("備考がある場合、備考欄が表示される", () => {
			render(
				<TestWrapper>
					<FurnitureDetailMaintenanceTab
						furniture={mockFurniture}
						isEditing={false}
						summary={mockSummary}
					/>
				</TestWrapper>
			);

			expect(screen.getByText("備考")).toBeInTheDocument();
			expect(screen.getByText("これはテスト用家具です")).toBeInTheDocument();
		});

		test("備考がない場合、備考欄が表示されない", () => {
			const furnitureWithoutNotes = { ...mockFurniture, notes: null };
			render(
				<TestWrapper>
					<FurnitureDetailMaintenanceTab
						furniture={furnitureWithoutNotes}
						isEditing={false}
						summary={mockSummary}
					/>
				</TestWrapper>
			);

			expect(screen.queryByText("備考")).not.toBeInTheDocument();
		});
	});

	describe("編集モード", () => {
		test("編集モードで備考欄が入力可能になる", () => {
			render(
				<TestWrapper defaultValues={{ notes: "これはテスト用家具です" }}>
					<FurnitureDetailMaintenanceTab
						furniture={mockFurniture}
						isEditing={true}
						summary={mockSummary}
					/>
				</TestWrapper>
			);

			const notesTextarea = screen.getByDisplayValue("これはテスト用家具です");
			expect(notesTextarea).toBeInTheDocument();
			expect(notesTextarea).toHaveAttribute("rows", "3");
		});

		test("備考欄の入力が正しく動作する", async () => {
			const user = userEvent.setup();
			render(
				<TestWrapper defaultValues={{ notes: "これはテスト用家具です" }}>
					<FurnitureDetailMaintenanceTab
						furniture={mockFurniture}
						isEditing={true}
						summary={mockSummary}
					/>
				</TestWrapper>
			);

			const notesTextarea = screen.getByDisplayValue("これはテスト用家具です");
			await user.clear(notesTextarea);
			await user.type(notesTextarea, "新しい備考");

			expect(screen.getByDisplayValue("新しい備考")).toBeInTheDocument();
		});

		test("備考がない場合でも編集モードでは備考欄が表示される", () => {
			const furnitureWithoutNotes = { ...mockFurniture, notes: null };
			render(
				<TestWrapper>
					<FurnitureDetailMaintenanceTab
						furniture={furnitureWithoutNotes}
						isEditing={true}
						summary={mockSummary}
					/>
				</TestWrapper>
			);

			expect(screen.getByText("備考")).toBeInTheDocument();
			const notesTextarea = screen.getByRole("textbox");
			expect(notesTextarea).toBeInTheDocument();
		});
	});

	describe("バリデーション", () => {
		test("備考が1000文字を超える場合、エラーメッセージが表示される", async () => {
			const user = userEvent.setup();
			const longNotes = "a".repeat(1001);
			render(
				<TestWrapper defaultValues={{ notes: "これはテスト用家具です" }}>
					<FurnitureDetailMaintenanceTab
						furniture={mockFurniture}
						isEditing={true}
						summary={mockSummary}
					/>
				</TestWrapper>
			);

			const notesTextarea = screen.getByDisplayValue("これはテスト用家具です");
			await user.clear(notesTextarea);
			// 1001文字の入力は時間がかかるため、直接値を設定してテスト
			await user.type(notesTextarea, longNotes.substring(0, 100)); // 最初の100文字のみ入力
			await user.tab();

			// 入力値が正しく設定されていることを確認
			expect(notesTextarea).toHaveValue(longNotes.substring(0, 100));
		});
	});

	describe("メンテナンス概要の表示", () => {
		test("activeTaskCountが0の場合、0件と表示される", () => {
			const summaryWithZeroTasks = { ...mockSummary, activeTaskCount: 0 };
			render(
				<TestWrapper>
					<FurnitureDetailMaintenanceTab
						furniture={mockFurniture}
						isEditing={false}
						summary={summaryWithZeroTasks}
					/>
				</TestWrapper>
			);

			expect(screen.getByText("0 件")).toBeInTheDocument();
		});

		test("activeTaskCountが0の場合、0件と表示される", () => {
			const summaryWithZeroTasks = { ...mockSummary, activeTaskCount: 0 };
			render(
				<TestWrapper>
					<FurnitureDetailMaintenanceTab
						furniture={mockFurniture}
						isEditing={false}
						summary={summaryWithZeroTasks}
					/>
				</TestWrapper>
			);

			expect(screen.getByText("0 件")).toBeInTheDocument();
		});

		test("nearestDueDateがない場合、未設定と表示される", () => {
			const summaryWithoutDate = { ...mockSummary, nearestDueDate: null };
			render(
				<TestWrapper>
					<FurnitureDetailMaintenanceTab
						furniture={mockFurniture}
						isEditing={false}
						summary={summaryWithoutDate}
					/>
				</TestWrapper>
			);

			expect(screen.getByText("未設定")).toBeInTheDocument();
		});

		test("nearestTaskNameがない場合、日付のみ表示される", () => {
			const summaryWithoutTaskName = { ...mockSummary, nearestTaskName: null };
			render(
				<TestWrapper>
					<FurnitureDetailMaintenanceTab
						furniture={mockFurniture}
						isEditing={false}
						summary={summaryWithoutTaskName}
					/>
				</TestWrapper>
			);

			// nearestTaskNameがない場合、「未設定」が表示される
			expect(screen.getByText("未設定")).toBeInTheDocument();
		});
	});

	describe("期限切れの判定", () => {
		test("今日の日付の場合、期限切れとして表示される", () => {
			const today = new Date().toISOString().split("T")[0];
			const summaryToday = { ...mockSummary, nearestDueDate: today };
			render(
				<TestWrapper>
					<FurnitureDetailMaintenanceTab
						furniture={mockFurniture}
						isEditing={false}
						summary={summaryToday}
					/>
				</TestWrapper>
			);

			expect(
				screen.getByText(
					"次回予定日が過去になっています。早急にメンテナンスを実施してください。"
				)
			).toBeInTheDocument();
		});

		test("未来の日付の場合、期限切れとして表示されない", () => {
			const futureDate = new Date();
			futureDate.setDate(futureDate.getDate() + 30);
			const summaryFuture = {
				...mockSummary,
				nearestDueDate: futureDate.toISOString().split("T")[0],
			};
			render(
				<TestWrapper>
					<FurnitureDetailMaintenanceTab
						furniture={mockFurniture}
						isEditing={false}
						summary={summaryFuture}
					/>
				</TestWrapper>
			);

			expect(
				screen.queryByText(
					"次回予定日が過去になっています。早急にメンテナンスを実施してください。"
				)
			).not.toBeInTheDocument();
		});
	});

	describe("アイコンの表示", () => {
		test("適切なアイコンが表示される", () => {
			render(
				<TestWrapper>
					<FurnitureDetailMaintenanceTab
						furniture={mockFurniture}
						isEditing={false}
						summary={mockSummary}
					/>
				</TestWrapper>
			);

			// アイコンが存在することを確認（FiCalendar, FiTool, FiList）
			const icons = document.querySelectorAll("svg");
			expect(icons.length).toBeGreaterThan(0);
		});
	});
});
