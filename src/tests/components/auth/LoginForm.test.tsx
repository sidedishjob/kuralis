import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockAuthUser } from "@/tests/utils/setupAuthMock";
import type { AuthResponse } from "@supabase/supabase-js";

// 共通のモック設定
const mockPush = vi.fn();
const mockSignInWithPassword = vi.fn();
const mockSignInWithOAuth = vi.fn();

vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/lib/supabase/client", () => ({
	supabase: {
		auth: {
			signInWithPassword: mockSignInWithPassword,
			signInWithOAuth: mockSignInWithOAuth,
		},
	},
}));

// GuestLoginButtonをモック
vi.mock("./GuestLoginButton", () => ({
	GuestLoginButton: () => <button>ゲストログイン</button>,
}));

describe("LoginForm", () => {
	let LoginFormComponent: typeof import("@/components/auth/LoginForm").LoginForm;

	const setupComponent = async () => {
		vi.resetModules();
		const mod = await import("@/components/auth/LoginForm");
		LoginFormComponent = mod.LoginForm;
	};

	beforeEach(async () => {
		vi.clearAllMocks();
		// 通常ユーザーとしてセットアップ（LoadingButtonが有効になるように）
		mockAuthUser({ isGuestUser: false });
		await setupComponent();
	});

	describe("レンダリング", () => {
		test("フォームの基本要素が表示される", () => {
			render(<LoginFormComponent />);

			expect(screen.getByText("おかえりなさい")).toBeInTheDocument();
			expect(screen.getByText("Googleアカウントまたはメールでログイン")).toBeInTheDocument();
			expect(screen.getByText("Googleでログイン")).toBeInTheDocument();
			expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
			expect(screen.getByLabelText("パスワード")).toBeInTheDocument();
			expect(screen.getByRole("button", { name: "ログイン" })).toBeInTheDocument();
			expect(screen.getByRole("button", { name: "ゲストモードで試す" })).toBeInTheDocument();
		});

		test("リンクが正しく設定されている", () => {
			render(<LoginFormComponent />);

			const forgotPasswordLink = screen.getByText("パスワードをお忘れですか？");
			expect(forgotPasswordLink.closest("a")).toHaveAttribute("href", "/auth/reset-request");

			const signupLink = screen.getByText("サインアップ");
			expect(signupLink.closest("a")).toHaveAttribute("href", "/auth/signup");

			const termsLink = screen.getByText("利用規約");
			expect(termsLink.closest("a")).toHaveAttribute("href", "/terms");

			const privacyLink = screen.getByText("プライバシーポリシー");
			expect(privacyLink.closest("a")).toHaveAttribute("href", "/privacy");
		});
	});

	describe("Googleログイン", () => {
		test("Googleログインボタンクリック時にOAuth認証が実行される", async () => {
			const user = userEvent.setup();
			render(<LoginFormComponent />);

			const googleButton = screen.getByText("Googleでログイン");
			await user.click(googleButton);

			expect(mockSignInWithOAuth).toHaveBeenCalledWith({
				provider: "google",
				options: {
					redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
				},
			});
		});
	});

	describe("メール・パスワードログイン", () => {
		test("有効な情報でログイン成功時、家具ページに遷移する", async () => {
			const user = userEvent.setup();
			mockSignInWithPassword.mockResolvedValue({ error: null });

			render(<LoginFormComponent />);

			await user.type(screen.getByLabelText("メールアドレス"), "test@example.com");
			await user.type(screen.getByLabelText("パスワード"), "password123");
			await user.click(screen.getByRole("button", { name: "ログイン" }));

			await waitFor(() => {
				expect(mockSignInWithPassword).toHaveBeenCalledWith({
					email: "test@example.com",
					password: "password123",
				});
			});

			expect(mockPush).toHaveBeenCalledWith("/furniture");
		});

		test("ログイン失敗時、エラーメッセージが表示される", async () => {
			const user = userEvent.setup();
			mockSignInWithPassword.mockResolvedValue({
				error: { message: "Invalid credentials" },
			});

			render(<LoginFormComponent />);

			await user.type(screen.getByLabelText("メールアドレス"), "test@example.com");
			await user.type(screen.getByLabelText("パスワード"), "wrongpassword");
			await user.click(screen.getByRole("button", { name: "ログイン" }));

			await waitFor(() => {
				expect(
					screen.getByText("メールアドレスまたはパスワードが違います")
				).toBeInTheDocument();
			});

			expect(mockPush).not.toHaveBeenCalled();
		});

		test("ログイン中はボタンがローディング状態になる", async () => {
			const user = userEvent.setup();

			// ログイン処理を遅延させる
			let resolveSignIn: (value: AuthResponse) => void;
			const signInPromise = new Promise<AuthResponse>((resolve) => {
				resolveSignIn = resolve;
			});
			mockSignInWithPassword.mockReturnValue(signInPromise);

			render(<LoginFormComponent />);

			await user.type(screen.getByLabelText("メールアドレス"), "test@example.com");
			await user.type(screen.getByLabelText("パスワード"), "password123");
			await user.click(screen.getByRole("button", { name: "ログイン" }));

			// ローディング状態をチェック
			expect(screen.getByText("ログイン中...")).toBeInTheDocument();
			expect(screen.getByRole("button", { name: /ログイン中.../ })).toBeDisabled();

			// ログイン完了
			resolveSignIn!({ error: null } as AuthResponse);

			await waitFor(() => {
				expect(mockPush).toHaveBeenCalledWith("/furniture");
			});
		});
	});

	describe("フォームバリデーション", () => {
		test("メールアドレスが空の場合、エラーメッセージが表示される", async () => {
			const user = userEvent.setup();
			render(<LoginFormComponent />);

			await user.type(screen.getByLabelText("パスワード"), "password123");
			await user.click(screen.getByRole("button", { name: "ログイン" }));

			await waitFor(() => {
				expect(screen.getByText("メールアドレスを入力してください")).toBeInTheDocument();
			});

			expect(mockSignInWithPassword).not.toHaveBeenCalled();
		});

		test("無効なメールアドレス形式の場合、エラーメッセージが表示される", async () => {
			const user = userEvent.setup();
			render(<LoginFormComponent />);

			await user.type(screen.getByLabelText("メールアドレス"), "invalid@email");
			await user.type(screen.getByLabelText("パスワード"), "password123");
			await user.click(screen.getByRole("button", { name: "ログイン" }));

			await waitFor(() => {
				expect(
					screen.getByText("有効なメールアドレスを入力してください")
				).toBeInTheDocument();
			});

			expect(mockSignInWithPassword).not.toHaveBeenCalled();
		});

		test("パスワードが空の場合、エラーメッセージが表示される", async () => {
			const user = userEvent.setup();
			render(<LoginFormComponent />);

			await user.type(screen.getByLabelText("メールアドレス"), "test@example.com");
			await user.click(screen.getByRole("button", { name: "ログイン" }));

			await waitFor(() => {
				expect(
					screen.getByText("パスワードは6文字以上で入力してください")
				).toBeInTheDocument();
			});

			expect(mockSignInWithPassword).not.toHaveBeenCalled();
		});

		test("パスワードが短すぎる場合、エラーメッセージが表示される", async () => {
			const user = userEvent.setup();
			render(<LoginFormComponent />);

			await user.type(screen.getByLabelText("メールアドレス"), "test@example.com");
			await user.type(screen.getByLabelText("パスワード"), "12345");
			await user.click(screen.getByRole("button", { name: "ログイン" }));

			await waitFor(() => {
				expect(
					screen.getByText("パスワードは6文字以上で入力してください")
				).toBeInTheDocument();
			});

			expect(mockSignInWithPassword).not.toHaveBeenCalled();
		});
	});

	describe("エラーハンドリング", () => {
		test("認証エラー後、再度ログインを試すとエラーメッセージがクリアされる", async () => {
			const user = userEvent.setup();

			// 最初のログイン試行：失敗
			mockSignInWithPassword.mockResolvedValueOnce({
				error: { message: "Invalid credentials" },
			});

			render(<LoginFormComponent />);

			await user.type(screen.getByLabelText("メールアドレス"), "test@example.com");
			await user.type(screen.getByLabelText("パスワード"), "wrongpassword");
			await user.click(screen.getByRole("button", { name: "ログイン" }));

			await waitFor(() => {
				expect(
					screen.getByText("メールアドレスまたはパスワードが違います")
				).toBeInTheDocument();
			});

			// 2回目のログイン試行：成功
			mockSignInWithPassword.mockResolvedValueOnce({ error: null });

			await user.clear(screen.getByLabelText("パスワード"));
			await user.type(screen.getByLabelText("パスワード"), "correctpassword");
			await user.click(screen.getByRole("button", { name: "ログイン" }));

			await waitFor(() => {
				expect(
					screen.queryByText("メールアドレスまたはパスワードが違います")
				).not.toBeInTheDocument();
			});

			expect(mockPush).toHaveBeenCalledWith("/furniture");
		});
	});

	describe("カスタムクラス", () => {
		test("カスタムクラスが適用される", () => {
			const { container } = render(<LoginFormComponent className="custom-class" />);
			expect(container.firstChild).toHaveClass("custom-class");
		});

		test("追加のpropsが適用される", () => {
			const { container } = render(<LoginFormComponent data-testid="login-form" />);
			expect(container.firstChild).toHaveAttribute("data-testid", "login-form");
		});
	});
});
