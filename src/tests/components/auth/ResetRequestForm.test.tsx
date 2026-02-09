import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResetRequestForm } from "@/components/auth/ResetRequestForm";

describe("ResetRequestForm", () => {
  test("タイトルとメール入力欄とボタンが表示される", () => {
    render(
      <ResetRequestForm
        email=""
        setEmail={() => {}}
        loading={false}
        handleReset={() => {}}
      />,
    );

    expect(screen.getByText("パスワードをリセット")).toBeInTheDocument();
    expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "リセットリンクを送信" }),
    ).toBeInTheDocument();
  });

  test("メールアドレスを入力すると setEmail が呼ばれる", async () => {
    const user = userEvent.setup();
    const setEmail = vi.fn();

    render(
      <ResetRequestForm
        email=""
        setEmail={setEmail}
        loading={false}
        handleReset={() => {}}
      />,
    );

    const input = screen.getByLabelText("メールアドレス");
    await user.type(input, "test@example.com");

    expect(setEmail).toHaveBeenLastCalledWith("m");
  });

  test("メールアドレスが未入力のときボタンが非活性になる", () => {
    render(
      <ResetRequestForm
        email=""
        setEmail={() => {}}
        loading={false}
        handleReset={() => {}}
      />,
    );

    expect(
      screen.getByRole("button", { name: "リセットリンクを送信" }),
    ).toBeDisabled();
  });

  test("loading = true のときボタンが非活性かつラベルが変化", () => {
    render(
      <ResetRequestForm
        email="test@example.com"
        setEmail={() => {}}
        loading={true}
        handleReset={() => {}}
      />,
    );

    const button = screen.getByRole("button", { name: "送信中..." });
    expect(button).toBeDisabled();
  });

  test("有効な状態でボタンを押すと handleReset が呼ばれる", async () => {
    const user = userEvent.setup();
    const handleReset = vi.fn();

    render(
      <ResetRequestForm
        email="test@example.com"
        setEmail={() => {}}
        loading={false}
        handleReset={handleReset}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "リセットリンクを送信" }),
    );
    expect(handleReset).toHaveBeenCalled();
  });

  test("メールアドレスが入力されている場合、その値が表示される", () => {
    render(
      <ResetRequestForm
        email="existing@example.com"
        setEmail={() => {}}
        loading={false}
        handleReset={() => {}}
      />,
    );
    const input = screen.getByLabelText("メールアドレス");
    expect(input).toHaveValue("existing@example.com");
  });

  test("メールアドレスが入力されていてもloadingがtrueの場合はボタンが非活性", () => {
    render(
      <ResetRequestForm
        email="test@example.com"
        setEmail={() => {}}
        loading={true}
        handleReset={() => {}}
      />,
    );
    const button = screen.getByRole("button", { name: "送信中..." });
    expect(button).toBeDisabled();
  });

  test("入力フィールドが適切な属性を持っている", () => {
    render(
      <ResetRequestForm
        email=""
        setEmail={() => {}}
        loading={false}
        handleReset={() => {}}
      />,
    );
    const input = screen.getByLabelText("メールアドレス");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("placeholder", "kuralis@example.com");
  });
});
