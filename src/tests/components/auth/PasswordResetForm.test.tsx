import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { PasswordResetForm } from "@/components/auth/PasswordResetForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordResetSchema } from "@/lib/validation";
import type { PasswordResetSchema } from "@/lib/validation";

// テスト用のフォームフック
const TestWrapper = ({
  pageState,
  onSubmit,
  defaultValues = {},
}: {
  pageState: "loading" | "authorized";
  onSubmit: (values: PasswordResetSchema) => Promise<void>;
  defaultValues?: Partial<PasswordResetSchema>;
}) => {
  const form = useForm<PasswordResetSchema>({
    defaultValues: {
      newPassword: "",
      ...defaultValues,
    },
    resolver: zodResolver(passwordResetSchema),
  });

  return (
    <PasswordResetForm pageState={pageState} form={form} onSubmit={onSubmit} />
  );
};

describe("PasswordResetForm", () => {
  test("loading状態でスケルトンが表示される", () => {
    const { container } = render(
      <TestWrapper pageState="loading" onSubmit={vi.fn()} />,
    );

    // タイトルのスケルトン
    const skeletonTitle = container.querySelector("div.h-10");
    expect(skeletonTitle).toBeInTheDocument();

    // 入力ブロックのスケルトン
    const skeletonInput = container.querySelector("div.space-y-2.p-2");
    expect(skeletonInput).toBeInTheDocument();

    // フォームは表示されない
    expect(screen.queryByLabelText("新しいパスワード")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "パスワードを更新" }),
    ).not.toBeInTheDocument();
  });

  test("authorized状態でフォームが表示される", () => {
    render(<TestWrapper pageState="authorized" onSubmit={vi.fn()} />);

    expect(screen.getByText("新しいパスワードを設定")).toBeInTheDocument();
    expect(screen.getByLabelText("新しいパスワード")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "パスワードを更新" }),
    ).toBeInTheDocument();
  });

  test("パスワード入力フィールドが適切な属性を持つ", () => {
    render(<TestWrapper pageState="authorized" onSubmit={vi.fn()} />);

    const passwordInput = screen.getByLabelText("新しいパスワード");
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(passwordInput).toHaveAttribute(
      "placeholder",
      "新しいパスワードを入力してください",
    );
  });

  test("パスワードを入力できる", async () => {
    const user = userEvent.setup();
    render(<TestWrapper pageState="authorized" onSubmit={vi.fn()} />);

    const passwordInput = screen.getByLabelText("新しいパスワード");
    await user.type(passwordInput, "newPassword123");

    expect(passwordInput).toHaveValue("newPassword123");
  });

  test("フォーム送信時にonSubmitが呼ばれる", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<TestWrapper pageState="authorized" onSubmit={onSubmit} />);

    const passwordInput = screen.getByLabelText("新しいパスワード");
    const submitButton = screen.getByRole("button", {
      name: "パスワードを更新",
    });

    await user.type(passwordInput, "newPassword123");
    await user.click(submitButton);

    await waitFor(() => {
      const [data] = onSubmit.mock.calls[0]; // 引数の1個目だけ取り出す
      expect(data).toMatchObject({ newPassword: "newPassword123" });
    });
  });

  test("送信中はボタンが無効化され、ローディングテキストが表示される", async () => {
    const user = userEvent.setup();
    let resolveSubmit: () => void;
    const onSubmit = vi.fn(() => {
      return new Promise<void>((resolve) => {
        resolveSubmit = resolve;
      });
    });

    render(<TestWrapper pageState="authorized" onSubmit={onSubmit} />);

    const passwordInput = screen.getByLabelText("新しいパスワード");
    const submitButton = screen.getByRole("button", {
      name: "パスワードを更新",
    });

    await user.type(passwordInput, "newPassword123");
    await user.click(submitButton);

    // 送信中の状態を確認
    await waitFor(() => {
      expect(screen.getByText("更新中...")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "更新中..." })).toBeDisabled();
    });

    // 送信完了
    resolveSubmit!();
    await waitFor(() => {
      expect(screen.getByText("パスワードを更新")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "パスワードを更新" }),
      ).not.toBeDisabled();
    });
  });

  test("パスワードが短すぎる場合、エラーメッセージが表示される", async () => {
    const user = userEvent.setup();
    render(<TestWrapper pageState="authorized" onSubmit={vi.fn()} />);

    await user.type(screen.getByLabelText("新しいパスワード"), "123");
    await user.click(screen.getByRole("button", { name: "パスワードを更新" }));

    await waitFor(() => {
      expect(
        screen.getByText("パスワードは6文字以上で入力してください"),
      ).toBeInTheDocument();
    });
  });

  test("LoadingButtonに適切なpropsが渡される", () => {
    render(<TestWrapper pageState="authorized" onSubmit={vi.fn()} />);

    const submitButton = screen.getByRole("button", {
      name: "パスワードを更新",
    });
    expect(submitButton).toHaveAttribute("type", "submit");
    expect(submitButton).toHaveClass("w-full");
  });
});
