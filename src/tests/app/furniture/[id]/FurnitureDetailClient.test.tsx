import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FurnitureDetailClient from "@/app/furniture/[id]/FurnitureDetailClient";
import type { FurnitureWithExtras } from "@/types/furniture";
import type { Location } from "@/types/furniture_meta";
import type { MaintenanceSummary } from "@/types/maintenance";

// --- モック関数 ---
const deleteFurnitureMock = vi.fn();
const updateFurnitureMock = vi.fn();
const mutateMock = vi.fn();
const pushMock = vi.fn();
const refreshMock = vi.fn();
const toastMock = vi.fn();

vi.mock("@/lib/supabase/hooks/useSupabaseClient", () => ({
  useSupabaseClient: () => ({
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockResolvedValue({ data: [], error: null }),
  }),
}));

// --- Hooks モック ---
vi.mock("@/hooks/useFurnitureById", () => ({
  useFurnitureById: vi.fn(() => ({
    furniture: mockFurniture,
    isLoading: false,
    error: null,
    mutate: mutateMock,
  })),
}));

vi.mock("@/hooks/useUpdateFurniture", () => ({
  useUpdateFurniture: () => ({
    updateFurniture: updateFurnitureMock,
  }),
}));

vi.mock("@/hooks/useDeleteFurniture", () => ({
  useDeleteFurniture: () => ({
    deleteFurniture: deleteFurnitureMock,
  }),
}));

vi.mock("next/navigation", async () => {
  const actual =
    await vi.importActual<typeof import("next/navigation")>("next/navigation");
  return {
    ...actual,
    useRouter: vi.fn(() => ({
      push: pushMock,
      refresh: refreshMock,
    })),
  };
});

vi.mock("@/hooks/useToast", () => ({
  useToast: () => ({
    toast: toastMock,
  }),
}));

// --- モックデータ ---
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

const mockLocations: Location[] = [
  { id: 1, name: "リビング" },
  { id: 2, name: "ダイニング" },
];

const mockSummary: MaintenanceSummary = {
  activeTaskCount: 2,
  nearestDueDate: "2024-06-01",
  nearestTaskName: "オイル塗布",
};

describe("FurnitureDetailClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("初期表示", () => {
    test("家具の基本情報が表示される", () => {
      render(
        <FurnitureDetailClient
          initialFurniture={mockFurniture}
          initialLocations={mockLocations}
          initialMaintenanceSummary={mockSummary}
        />,
      );

      expect(screen.getByText("サンプル家具")).toBeInTheDocument();
      expect(screen.getByText("リビング")).toBeInTheDocument();
      expect(screen.getByText("チェア")).toBeInTheDocument();
      expect(screen.getByText("Back to Collection")).toBeInTheDocument();
    });

    test("編集・削除ボタンが表示される", () => {
      render(
        <FurnitureDetailClient
          initialFurniture={mockFurniture}
          initialLocations={mockLocations}
          initialMaintenanceSummary={mockSummary}
        />,
      );

      expect(screen.getByRole("button", { name: "編集" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "削除" })).toBeInTheDocument();
    });
  });

  describe("編集機能", () => {
    test("編集ボタンで編集モードに切り替わる", async () => {
      const user = userEvent.setup();
      render(
        <FurnitureDetailClient
          initialFurniture={mockFurniture}
          initialLocations={mockLocations}
          initialMaintenanceSummary={mockSummary}
        />,
      );

      await user.click(screen.getByRole("button", { name: "編集" }));

      expect(
        screen.getByRole("button", { name: "キャンセル" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "保存する" }),
      ).toBeInTheDocument();
      expect(screen.getByDisplayValue("サンプル家具")).toBeInTheDocument();
    });

    test("キャンセルボタンで編集モードが解除される", async () => {
      const user = userEvent.setup();
      render(
        <FurnitureDetailClient
          initialFurniture={mockFurniture}
          initialLocations={mockLocations}
          initialMaintenanceSummary={mockSummary}
        />,
      );

      // 編集モードに切り替え
      await user.click(screen.getByRole("button", { name: "編集" }));
      expect(
        screen.getByRole("button", { name: "キャンセル" }),
      ).toBeInTheDocument();

      // キャンセルをクリック
      await user.click(screen.getByRole("button", { name: "キャンセル" }));

      // 編集モード終了：再び「編集」ボタンが表示される
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "編集" }),
        ).toBeInTheDocument();
      });
    });
  });

  describe("保存機能", () => {
    test("保存時にupdateFurnitureが正しいデータで呼ばれる", async () => {
      const user = userEvent.setup();
      const updatedFurniture = { ...mockFurniture, name: "変更後の名前" };
      updateFurnitureMock.mockResolvedValue(updatedFurniture);

      render(
        <FurnitureDetailClient
          initialFurniture={mockFurniture}
          initialLocations={mockLocations}
          initialMaintenanceSummary={mockSummary}
        />,
      );

      await user.click(screen.getByRole("button", { name: "編集" }));

      // 名前を変更する
      const nameInput = screen.getByDisplayValue("サンプル家具");
      await user.clear(nameInput);
      await user.type(nameInput, "変更後の名前");

      // 保存ボタン押下
      await user.click(screen.getByRole("button", { name: "保存する" }));

      await waitFor(() => {
        expect(updateFurnitureMock).toHaveBeenCalledWith(expect.any(FormData));
      });

      // FormDataの中身を確認
      const formData = updateFurnitureMock.mock.calls[0][0];
      expect(formData.get("name")).toBe("変更後の名前");
    });

    test("保存成功時にトーストが表示される", async () => {
      const user = userEvent.setup();
      const updatedFurniture = { ...mockFurniture, name: "変更後の名前" };
      updateFurnitureMock.mockResolvedValue(updatedFurniture);

      render(
        <FurnitureDetailClient
          initialFurniture={mockFurniture}
          initialLocations={mockLocations}
          initialMaintenanceSummary={mockSummary}
        />,
      );

      await user.click(screen.getByRole("button", { name: "編集" }));
      await user.click(screen.getByRole("button", { name: "保存する" }));

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "変更を保存しました",
          description: "変更後の名前 を更新しました。",
        });
      });
    });

    test("保存失敗時にエラートーストが表示される", async () => {
      // 一時的に console.error を抑制
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const user = userEvent.setup();
      updateFurnitureMock.mockRejectedValue(new Error("保存に失敗しました"));

      render(
        <FurnitureDetailClient
          initialFurniture={mockFurniture}
          initialLocations={mockLocations}
          initialMaintenanceSummary={mockSummary}
        />,
      );

      await user.click(screen.getByRole("button", { name: "編集" }));
      await user.click(screen.getByRole("button", { name: "保存する" }));

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "家具の更新に失敗しました",
          description: expect.stringContaining("もう一度お試しください"),
          variant: "destructive",
        });
      });

      // 元に戻す（他のテストへの影響を防ぐ）
      consoleErrorSpy.mockRestore();
    });
  });

  describe("削除機能", () => {
    test("削除ダイアログが表示され、削除が実行される", async () => {
      const user = userEvent.setup();
      deleteFurnitureMock.mockResolvedValue(undefined);

      render(
        <FurnitureDetailClient
          initialFurniture={mockFurniture}
          initialLocations={mockLocations}
          initialMaintenanceSummary={mockSummary}
        />,
      );

      // 削除ボタン押下
      await user.click(screen.getByRole("button", { name: "削除" }));

      // モーダル内のテキストが表示されていることを確認
      const title = await screen.findByText("家具を削除しますか？");
      expect(title).toBeInTheDocument();

      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();

      // ダイアログ内の家具名を確認
      const furnitureNameInDialog = within(dialog).getByText((text) =>
        text.includes("サンプル家具"),
      );
      expect(furnitureNameInDialog).toBeInTheDocument();

      // 「削除する」ボタンを押す
      await user.click(screen.getByRole("button", { name: "削除する" }));

      // deleteFurniture が呼ばれたことを確認
      await waitFor(() => {
        expect(deleteFurnitureMock).toHaveBeenCalledWith();
      });
    });

    test("削除成功時にトーストが表示され、ページが遷移する", async () => {
      const user = userEvent.setup();
      deleteFurnitureMock.mockResolvedValue(undefined);

      render(
        <FurnitureDetailClient
          initialFurniture={mockFurniture}
          initialLocations={mockLocations}
          initialMaintenanceSummary={mockSummary}
        />,
      );

      await user.click(screen.getByRole("button", { name: "削除" }));
      await user.click(screen.getByRole("button", { name: "削除する" }));

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "家具を削除しました",
          description: "サンプル家具 を削除しました。",
        });
        expect(pushMock).toHaveBeenCalledWith("/furniture");
        expect(refreshMock).toHaveBeenCalled();
      });
    });

    test("削除失敗時にエラートーストが表示される", async () => {
      // 一時的に console.error を抑制
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const user = userEvent.setup();
      deleteFurnitureMock.mockRejectedValue(new Error("削除に失敗しました"));

      render(
        <FurnitureDetailClient
          initialFurniture={mockFurniture}
          initialLocations={mockLocations}
          initialMaintenanceSummary={mockSummary}
        />,
      );

      await user.click(screen.getByRole("button", { name: "削除" }));
      await user.click(screen.getByRole("button", { name: "削除する" }));

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "家具の削除に失敗しました",
          description: expect.stringContaining("もう一度お試しください"),
          variant: "destructive",
        });
      });

      // 元に戻す（他のテストへの影響を防ぐ）
      consoleErrorSpy.mockRestore();
    });
  });

  describe("フォームバリデーション", () => {
    test("必須フィールドが空の場合、保存できない", async () => {
      const user = userEvent.setup();
      render(
        <FurnitureDetailClient
          initialFurniture={mockFurniture}
          initialLocations={mockLocations}
          initialMaintenanceSummary={mockSummary}
        />,
      );

      await user.click(screen.getByRole("button", { name: "編集" }));

      // 名前フィールドを空にする
      const nameInput = screen.getByDisplayValue("サンプル家具");
      await user.clear(nameInput);

      // 保存ボタン押下
      await user.click(screen.getByRole("button", { name: "保存する" }));

      // updateFurnitureが呼ばれないことを確認
      expect(updateFurnitureMock).not.toHaveBeenCalled();
    });

    test("名前が空の場合、エラーメッセージが表示される", async () => {
      const user = userEvent.setup();
      render(
        <FurnitureDetailClient
          initialFurniture={mockFurniture}
          initialLocations={mockLocations}
          initialMaintenanceSummary={mockSummary}
        />,
      );

      await user.click(screen.getByRole("button", { name: "編集" }));
      const nameInput = screen.getByDisplayValue("サンプル家具");
      await user.clear(nameInput);

      await user.click(screen.getByRole("button", { name: "保存する" }));

      expect(screen.getByText(/家具名を入力してください/)).toBeInTheDocument();
    });
  });

  describe("タブ切り替え", () => {
    test("購入情報タブに切り替わると、購入日や店舗が表示される", async () => {
      render(
        <FurnitureDetailClient
          initialFurniture={mockFurniture}
          initialLocations={mockLocations}
          initialMaintenanceSummary={mockSummary}
        />,
      );

      await userEvent.click(screen.getByRole("tab", { name: /購入情報/ }));
      expect(screen.getByText("購入日")).toBeInTheDocument();
      expect(screen.getByText("購入店舗")).toBeInTheDocument();
    });

    test("メンテナンスタブに切り替えると、メンテナンス概要が表示される", async () => {
      render(
        <FurnitureDetailClient
          initialFurniture={mockFurniture}
          initialLocations={mockLocations}
          initialMaintenanceSummary={mockSummary}
        />,
      );

      await userEvent.click(screen.getByRole("tab", { name: /メンテナンス/ }));
      expect(screen.getByText("メンテナンス概要")).toBeInTheDocument();
      expect(screen.getByText("次回予定")).toBeInTheDocument();
      expect(screen.getByText("メンテ対象")).toBeInTheDocument();
    });
  });
});
