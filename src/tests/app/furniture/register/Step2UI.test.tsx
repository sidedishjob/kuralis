import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Step2UI from "@/app/furniture/register/Step2UI";

describe("Step2UI（正常系）", () => {
  const formRegister = vi.fn();
  const getValues = vi.fn().mockReturnValue(null);
  const setValue = vi.fn();
  const errors = {};
  const onSubmit = vi.fn();

  const baseProps = {
    category: { id: 1, name: "チェア" },
    location: { id: 2, name: "リビング" },
    formRegister,
    getValues,
    setValue,
    errors,
    onSubmit,
    isValid: true,
    isLoading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("家具名入力欄とラベルが表示される", () => {
    render(<Step2UI {...baseProps} />);
    expect(
      screen.getByPlaceholderText("例：ウォールナットダイニングテーブル"),
    ).toBeInTheDocument();
  });

  test("登録ボタンが有効でクリックできる", async () => {
    const user = userEvent.setup();
    render(<Step2UI {...baseProps} />);
    const button = screen.getByRole("button", { name: /登録する/i });
    expect(button).toBeEnabled();

    await user.click(button);
    expect(onSubmit).toHaveBeenCalled();
  });

  test("無効状態だと登録ボタンは押せない", () => {
    render(<Step2UI {...baseProps} isValid={false} />);
    const button = screen.getByRole("button", { name: /登録する/i });
    expect(button).toBeDisabled();
  });

  test("画像ファイルを選択すると setValue が呼ばれる", async () => {
    const user = userEvent.setup();
    render(<Step2UI {...baseProps} />);
    const file = new File(["dummy"], "sample.jpg", { type: "image/jpeg" });

    const input = screen.getByLabelText(/写真をアップロード/i);
    await user.upload(input, file);

    expect(setValue).toHaveBeenCalledWith("image", file, {
      shouldValidate: true,
      shouldDirty: true,
    });
  });
});
