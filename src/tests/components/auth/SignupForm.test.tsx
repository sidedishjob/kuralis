import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockAuthUser } from "@/tests/utils/setupAuthMock";
import type { AuthResponse } from "@supabase/supabase-js";

// 共通のモック設定
const mockPush = vi.fn();
const mockSignUp = vi.fn();
const mockSignInWithPassword = vi.fn();
const mockSignInWithOAuth = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/lib/supabase/client", () => ({
  supabase: {
    auth: {
      signUp: mockSignUp,
      signInWithPassword: mockSignInWithPassword,
      signInWithOAuth: mockSignInWithOAuth,
    },
  },
}));

describe("SignupForm", () => {
  let SignupFormComponent: typeof import("@/components/auth/SignupForm").SignupForm;

  const setupComponent = async () => {
    vi.resetModules();
    const mod = await import("@/components/auth/SignupForm");
    SignupFormComponent = mod.SignupForm;
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    // 通常ユーザーとしてセットアップ（LoadingButtonが有効になるように）
    mockAuthUser();
    await setupComponent();
  });

  describe("レンダリング", () => {
    test("フォームの基本要素が表示される", () => {
      render(<SignupFormComponent />);

      expect(screen.getByText("アカウントを作成")).toBeInTheDocument();
      expect(
        screen.getByText("Googleまたはメールアドレスで登録"),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Googleで登録" }),
      ).toBeInTheDocument();
      expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
      expect(screen.getByLabelText("パスワード")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "登録する" }),
      ).toBeInTheDocument();
    });

    test("リンクが正しく設定されている", () => {
      render(<SignupFormComponent />);

      const signupLink = screen.getByRole("link", {
        name: "ログイン",
      });
      expect(signupLink).toHaveAttribute("href", "/auth/login");
    });
  });

  describe("Google登録", () => {
    test("Google登録ボタンクリック時にOAuth認証が実行される", async () => {
      const user = userEvent.setup();
      render(<SignupFormComponent />);

      const googleButton = screen.getByRole("button", { name: "Googleで登録" });
      await user.click(googleButton);

      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: "google",
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      });
    });
  });

  describe("メール・パスワード登録", () => {
    test("有効な情報で登録成功時、家具ページに遷移する", async () => {
      const user = userEvent.setup();
      mockSignUp.mockResolvedValue({ error: null });
      mockSignInWithPassword.mockResolvedValue({ error: null });

      render(<SignupFormComponent />);

      await user.type(
        screen.getByLabelText("メールアドレス"),
        "test@example.com",
      );
      await user.type(screen.getByLabelText("パスワード"), "password123");
      await user.click(screen.getByRole("button", { name: "登録する" }));

      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith({
          email: "test@example.com",
          password: "password123",
        });
      });

      expect(mockPush).toHaveBeenCalledWith("/furniture");
    });

    test("登録失敗時、エラーメッセージが表示される", async () => {
      const user = userEvent.setup();
      mockSignUp.mockResolvedValue({
        error: { message: "Invalid credentials" },
      });

      render(<SignupFormComponent />);

      await user.type(
        screen.getByLabelText("メールアドレス"),
        "test@example.com",
      );
      await user.type(screen.getByLabelText("パスワード"), "wrongpassword");
      await user.click(screen.getByRole("button", { name: "登録する" }));

      await waitFor(() => {
        expect(screen.getByText("もう一度お試しください")).toBeInTheDocument();
      });

      expect(mockPush).not.toHaveBeenCalled();
    });

    test("登録中はボタンがローディング状態になる", async () => {
      const user = userEvent.setup();

      // 登録処理を遅延させる
      let resolveSignIn: (value: AuthResponse) => void;
      const signInPromise = new Promise<AuthResponse>((resolve) => {
        resolveSignIn = resolve;
      });
      mockSignUp.mockReturnValue(signInPromise);

      render(<SignupFormComponent />);

      await user.type(
        screen.getByLabelText("メールアドレス"),
        "test@example.com",
      );
      await user.type(screen.getByLabelText("パスワード"), "password123");
      await user.click(screen.getByRole("button", { name: "登録する" }));

      // ローディング状態をチェック
      expect(screen.getByText("登録中...")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /登録中.../ })).toBeDisabled();

      // 登録完了
      resolveSignIn!({ error: null } as AuthResponse);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/furniture");
      });
    });
  });

  describe("フォームバリデーション", () => {
    test("メールアドレスが空の場合、エラーメッセージが表示される", async () => {
      const user = userEvent.setup();
      render(<SignupFormComponent />);

      await user.type(screen.getByLabelText("パスワード"), "password123");
      await user.click(screen.getByRole("button", { name: "登録する" }));

      await waitFor(() => {
        expect(
          screen.getByText("メールアドレスを入力してください"),
        ).toBeInTheDocument();
      });

      expect(mockSignUp).not.toHaveBeenCalled();
    });

    test("無効なメールアドレス形式の場合、エラーメッセージが表示される", async () => {
      const user = userEvent.setup();
      render(<SignupFormComponent />);

      await user.type(screen.getByLabelText("メールアドレス"), "invalid@email");
      await user.type(screen.getByLabelText("パスワード"), "password123");
      await user.click(screen.getByRole("button", { name: "登録する" }));

      await waitFor(() => {
        expect(
          screen.getByText("有効なメールアドレスを入力してください"),
        ).toBeInTheDocument();
      });

      expect(mockSignUp).not.toHaveBeenCalled();
    });

    test("パスワードが空の場合、エラーメッセージが表示される", async () => {
      const user = userEvent.setup();
      render(<SignupFormComponent />);

      await user.type(
        screen.getByLabelText("メールアドレス"),
        "test@example.com",
      );
      await user.click(screen.getByRole("button", { name: "登録する" }));

      await waitFor(() => {
        expect(
          screen.getByText("パスワードは6文字以上で入力してください"),
        ).toBeInTheDocument();
      });

      expect(mockSignUp).not.toHaveBeenCalled();
    });

    test("パスワードが短すぎる場合、エラーメッセージが表示される", async () => {
      const user = userEvent.setup();
      render(<SignupFormComponent />);

      await user.type(
        screen.getByLabelText("メールアドレス"),
        "test@example.com",
      );
      await user.type(screen.getByLabelText("パスワード"), "12345");
      await user.click(screen.getByRole("button", { name: "登録する" }));

      await waitFor(() => {
        expect(
          screen.getByText("パスワードは6文字以上で入力してください"),
        ).toBeInTheDocument();
      });

      expect(mockSignUp).not.toHaveBeenCalled();
    });
  });

  describe("エラーハンドリング", () => {
    test("認証エラー後、再度登録を試すとエラーメッセージがクリアされる", async () => {
      const user = userEvent.setup();

      // 最初の登録試行：失敗
      mockSignUp.mockResolvedValueOnce({
        error: { message: "Invalid credentials" },
      });

      render(<SignupFormComponent />);

      await user.type(
        screen.getByLabelText("メールアドレス"),
        "test@example.com",
      );
      await user.type(screen.getByLabelText("パスワード"), "wrongpassword");
      await user.click(screen.getByRole("button", { name: "登録する" }));

      await waitFor(() => {
        expect(screen.getByText("もう一度お試しください")).toBeInTheDocument();
      });

      // 2回目の登録試行：成功
      mockSignUp.mockResolvedValueOnce({ error: null });
      mockSignInWithPassword.mockResolvedValue({ error: null });

      await user.clear(screen.getByLabelText("パスワード"));
      await user.type(screen.getByLabelText("パスワード"), "correctpassword");
      await user.click(screen.getByRole("button", { name: "登録する" }));

      await waitFor(() => {
        expect(
          screen.queryByText("もう一度お試しください"),
        ).not.toBeInTheDocument();
      });

      expect(mockPush).toHaveBeenCalledWith("/furniture");
    });
  });

  describe("カスタムクラス", () => {
    test("カスタムクラスが適用される", () => {
      const { container } = render(
        <SignupFormComponent className="custom-class" />,
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });

    test("追加のpropsが適用される", () => {
      const { container } = render(
        <SignupFormComponent data-testid="signup-form" />,
      );
      expect(container.firstChild).toHaveAttribute(
        "data-testid",
        "signup-form",
      );
    });
  });
});
