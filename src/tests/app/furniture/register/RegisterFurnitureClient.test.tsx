import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterFurnitureClient from "@/app/furniture/register/RegisterFurnitureClient";

// Routerモック
const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: vi.fn(),
  }),
}));

// Toastモック
vi.mock("@/hooks/useToast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// 登録APIモック
vi.mock("@/hooks/useRegisterFurniture", () => ({
  useRegisterFurniture: () => ({
    register: vi.fn(),
  }),
}));

// Step1UI モック
vi.mock("@/app/furniture/register/Step1UI", () => ({
  __esModule: true,
  default: ({ onNext }: { onNext: () => void }) => (
    <div>
      <p>Step1モック</p>
      <button onClick={onNext}>次へ</button>
    </div>
  ),
}));

// Step2UI モック
vi.mock("@/app/furniture/register/Step2UI", () => ({
  __esModule: true,
  default: () => (
    <div>
      <p>Step2モック</p>
    </div>
  ),
}));

describe("RegisterFurnitureClient", () => {
  test("初期表示は Step1UI", () => {
    render(<RegisterFurnitureClient />);
    expect(screen.getByText("Step1モック")).toBeInTheDocument();
  });

  test("「次へ」ボタンで Step2UI に切り替わる", async () => {
    const user = userEvent.setup();
    render(<RegisterFurnitureClient />);
    await user.click(screen.getByText("次へ"));
    expect(screen.getByText("Step2モック")).toBeInTheDocument();
  });

  test("Step1 の「戻る」ボタンで /furniture に遷移", async () => {
    const user = userEvent.setup();
    render(<RegisterFurnitureClient />);
    const backBtn = screen.getByRole("button", { name: /Back to Collection/i });
    await user.click(backBtn);
    expect(pushMock).toHaveBeenCalledWith("/furniture");
  });

  test("Step2 の「戻る」ボタンで Step1 に戻る", async () => {
    const user = userEvent.setup();
    render(<RegisterFurnitureClient />);
    await user.click(screen.getByText("次へ")); // Step2に進む

    // Step2で「戻る」押す → Step1に戻る
    const backBtn = screen.getByRole("button", { name: /Previous Step/i });
    await user.click(backBtn);
    expect(screen.getByText("Step1モック")).toBeInTheDocument();
  });
});
