import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("GuestLoginButton", () => {
	const originalEnv = process.env;

	let mockSignInWithPassword: ReturnType<typeof vi.fn>;
	let mockToast: ReturnType<typeof vi.fn>;
	let mockRouterPush: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		vi.resetModules(); // モジュールキャッシュをクリア

		process.env = {
			...originalEnv,
			NEXT_PUBLIC_GUEST_EMAIL: "guest@example.com",
			NEXT_PUBLIC_GUEST_PASSWORD: "guestpassword",
		};

		mockSignInWithPassword = vi.fn();
		mockToast = vi.fn();
		mockRouterPush = vi.fn();

		// 必ず beforeEach 内でモック定義
		vi.doMock("@/lib/supabase/client", () => ({
			supabase: {
				auth: {
					signInWithPassword: mockSignInWithPassword,
				},
			},
		}));

		vi.doMock("@/hooks/useToast", () => ({
			useToast: () => ({ toast: mockToast }),
		}));

		vi.doMock("next/navigation", () => ({
			useRouter: () => ({ push: mockRouterPush }),
		}));

		vi.doMock("@/lib/gtag", () => ({
			event: vi.fn(),
		}));

		vi.doMock("@/lib/utils/getErrorMessage", () => ({
			getErrorMessage: (_err: unknown, fallback: string) => fallback,
		}));
	});

	afterEach(() => {
		vi.clearAllMocks();
		process.env = originalEnv;
	});

	test("ボタンが表示される", async () => {
		const { GuestLoginButton } = await import("@/components/auth/GuestLoginButton");
		render(<GuestLoginButton />);
		expect(screen.getByRole("button", { name: "ゲストモードで試す" })).toBeInTheDocument();
	});

	test("クリックで signInWithPassword が呼ばれ、成功時に遷移する", async () => {
		const { GuestLoginButton } = await import("@/components/auth/GuestLoginButton");
		const user = userEvent.setup();
		mockSignInWithPassword.mockResolvedValue({ error: null });

		render(<GuestLoginButton />);
		await user.click(screen.getByRole("button", { name: "ゲストモードで試す" }));

		await waitFor(() => {
			expect(mockSignInWithPassword).toHaveBeenCalledWith({
				email: "guest@example.com",
				password: "guestpassword",
			});
			expect(mockRouterPush).toHaveBeenCalledWith("/furniture");
		});
	});

	test("クリック時にローディング状態が表示される", async () => {
		const { GuestLoginButton } = await import("@/components/auth/GuestLoginButton");
		const user = userEvent.setup();

		let resolveLogin: () => void;
		mockSignInWithPassword.mockImplementation(
			() =>
				new Promise((resolve) => {
					resolveLogin = () => resolve({ error: null });
				})
		);

		render(<GuestLoginButton />);
		await user.click(screen.getByRole("button", { name: "ゲストモードで試す" }));

		// ローディング状態の確認
		expect(screen.getByRole("button", { name: "ゲストでログイン中..." })).toBeDisabled();

		resolveLogin!();
		await waitFor(() => {
			expect(mockRouterPush).toHaveBeenCalledWith("/furniture");
		});
	});

	test("失敗時にエラートーストが表示される", async () => {
		// 一時的に console.error を抑制
		const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

		const { GuestLoginButton } = await import("@/components/auth/GuestLoginButton");
		const user = userEvent.setup();
		mockSignInWithPassword.mockResolvedValue({
			error: { message: "invalid login" },
		});

		render(<GuestLoginButton />);
		await user.click(screen.getByRole("button", { name: "ゲストモードで試す" }));

		await waitFor(() => {
			expect(mockToast).toHaveBeenCalledWith({
				title: "ログインに失敗しました。",
				description: "もう一度お試しください",
				variant: "destructive",
			});
		});

		// エラー時にローディング状態が解除されることもテスト
		expect(screen.getByRole("button", { name: "ゲストモードで試す" })).not.toBeDisabled();

		// 元に戻す（他のテストへの影響を防ぐ）
		consoleErrorSpy.mockRestore();
	});

	describe("環境変数が設定されていない場合", () => {
		test("GUEST_EMAILがない場合、ボタンは表示されるがクリック時にエラーが発生する", async () => {
			// 環境変数を個別に削除
			process.env = {
				...originalEnv,
				NEXT_PUBLIC_GUEST_PASSWORD: "guestpassword",
			};
			delete process.env.NEXT_PUBLIC_GUEST_EMAIL;

			// 一時的に console.error を抑制
			const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

			const { GuestLoginButton } = await import("@/components/auth/GuestLoginButton");
			const user = userEvent.setup();
			mockSignInWithPassword.mockResolvedValue({
				error: { message: "invalid login" },
			});

			render(<GuestLoginButton />);
			expect(screen.getByRole("button", { name: "ゲストモードで試す" })).toBeInTheDocument();

			await user.click(screen.getByRole("button", { name: "ゲストモードで試す" }));

			await waitFor(() => {
				expect(mockSignInWithPassword).toHaveBeenCalledWith({
					email: undefined,
					password: "guestpassword",
				});
			});

			// 元に戻す（他のテストへの影響を防ぐ）
			consoleErrorSpy.mockRestore();
		});

		test("GUEST_PASSWORDがない場合、ボタンは表示されるがクリック時にエラーが発生する", async () => {
			// 環境変数を個別に削除
			process.env = {
				...originalEnv,
				NEXT_PUBLIC_GUEST_EMAIL: "guest@example.com",
			};
			delete process.env.NEXT_PUBLIC_GUEST_PASSWORD;

			// 一時的に console.error を抑制
			const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

			const { GuestLoginButton } = await import("@/components/auth/GuestLoginButton");
			const user = userEvent.setup();
			mockSignInWithPassword.mockResolvedValue({
				error: { message: "invalid login" },
			});

			render(<GuestLoginButton />);
			expect(screen.getByRole("button", { name: "ゲストモードで試す" })).toBeInTheDocument();

			await user.click(screen.getByRole("button", { name: "ゲストモードで試す" }));

			await waitFor(() => {
				expect(mockSignInWithPassword).toHaveBeenCalledWith({
					email: "guest@example.com",
					password: undefined,
				});
			});

			// 元に戻す（他のテストへの影響を防ぐ）
			consoleErrorSpy.mockRestore();
		});
	});
});
