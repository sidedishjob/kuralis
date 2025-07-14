import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("PasswordChangeForm", () => {
	// ローカルモック関数定義
	let mockGetUser: ReturnType<typeof vi.fn>;
	let mockSignInWithPassword: ReturnType<typeof vi.fn>;
	let mockUpdateUser: ReturnType<typeof vi.fn>;
	let mockToast: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		vi.resetModules();

		mockGetUser = vi.fn();
		mockSignInWithPassword = vi.fn();
		mockUpdateUser = vi.fn();
		mockToast = vi.fn();

		vi.doMock("@/lib/supabase/client", () => ({
			supabase: {
				auth: {
					getUser: mockGetUser,
					signInWithPassword: mockSignInWithPassword,
					updateUser: mockUpdateUser,
				},
			},
		}));

		vi.doMock("@/hooks/useToast", () => ({
			useToast: () => ({ toast: mockToast }),
		}));

		vi.doMock("@/lib/utils/getErrorMessage", () => ({
			getErrorMessage: (err: unknown, fallback: string) =>
				err instanceof Error ? err.message : fallback,
		}));
	});

	test("フォームの要素が表示される", async () => {
		const { default: PasswordChangeForm } = await import(
			"@/components/auth/PasswordChangeForm"
		);
		render(<PasswordChangeForm />);
		expect(screen.getByLabelText("現在のパスワード")).toBeInTheDocument();
		expect(screen.getByLabelText("新しいパスワード")).toBeInTheDocument();
		expect(screen.getByLabelText("新しいパスワード（確認）")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "パスワードを更新" })).toBeInTheDocument();
	});

	test("正しくパスワード変更処理が呼ばれる", async () => {
		mockGetUser.mockResolvedValue({
			data: { user: { email: "test@example.com" } },
			error: null,
		});

		mockSignInWithPassword.mockResolvedValue({ data: {}, error: null });
		mockUpdateUser.mockResolvedValue({ data: {}, error: null });

		const { default: PasswordChangeForm } = await import(
			"@/components/auth/PasswordChangeForm"
		);
		const user = userEvent.setup();

		render(<PasswordChangeForm />);
		await user.type(screen.getByLabelText("現在のパスワード"), "current123");
		await user.type(screen.getByLabelText("新しいパスワード"), "newPassword123");
		await user.type(screen.getByLabelText("新しいパスワード（確認）"), "newPassword123");
		await user.click(screen.getByRole("button", { name: "パスワードを更新" }));

		await waitFor(() => {
			expect(mockSignInWithPassword).toHaveBeenCalledWith({
				email: "test@example.com",
				password: "current123",
			});
			expect(mockUpdateUser).toHaveBeenCalledWith({
				password: "newPassword123",
			});
			expect(mockToast).toHaveBeenCalledWith(
				expect.objectContaining({ title: "パスワードを更新しました。" })
			);
		});

		expect(screen.getByLabelText("現在のパスワード")).toHaveValue("");
		expect(screen.getByLabelText("新しいパスワード")).toHaveValue("");
		expect(screen.getByLabelText("新しいパスワード（確認）")).toHaveValue("");
	});

	test("認証に失敗した場合にエラートーストを表示", async () => {
		mockGetUser.mockResolvedValue({
			data: { user: { email: "test@example.com" } },
			error: null,
		});
		mockSignInWithPassword.mockResolvedValue({ error: { message: "Invalid password" } });

		const { default: PasswordChangeForm } = await import(
			"@/components/auth/PasswordChangeForm"
		);
		const user = userEvent.setup();

		render(<PasswordChangeForm />);
		await user.type(screen.getByLabelText("現在のパスワード"), "wrongpassword");
		await user.type(screen.getByLabelText("新しいパスワード"), "newpassword123");
		await user.type(screen.getByLabelText("新しいパスワード（確認）"), "newpassword123");
		await user.click(screen.getByRole("button", { name: "パスワードを更新" }));

		await waitFor(() => {
			expect(mockToast).toHaveBeenCalledWith(
				expect.objectContaining({
					title: "認証に失敗しました",
				})
			);
		});
	});

	describe("フォームバリデーション", () => {
		test("現在のパスワードが空の場合、エラーが表示される", async () => {
			const { default: PasswordChangeForm } = await import(
				"@/components/auth/PasswordChangeForm"
			);
			const user = userEvent.setup();

			render(<PasswordChangeForm />);
			await user.type(screen.getByLabelText("新しいパスワード"), "newpassword123");
			await user.type(screen.getByLabelText("新しいパスワード（確認）"), "newpassword123");
			await user.click(screen.getByRole("button", { name: "パスワードを更新" }));

			await waitFor(() => {
				expect(
					screen.getByText("現在のパスワードは6文字以上で入力してください")
				).toBeInTheDocument();
			});

			expect(mockSignInWithPassword).not.toHaveBeenCalled();
			expect(mockUpdateUser).not.toHaveBeenCalled();
		});

		test("新しいパスワードが空または短すぎる場合、エラーが表示される", async () => {
			const { default: PasswordChangeForm } = await import(
				"@/components/auth/PasswordChangeForm"
			);
			const user = userEvent.setup();

			render(<PasswordChangeForm />);
			await user.type(screen.getByLabelText("現在のパスワード"), "currentpassword");
			await user.type(screen.getByLabelText("新しいパスワード"), "123");
			await user.type(screen.getByLabelText("新しいパスワード（確認）"), "123");
			await user.click(screen.getByRole("button", { name: "パスワードを更新" }));

			await waitFor(() => {
				expect(
					screen.getByText("新しいパスワードは6文字以上で入力してください")
				).toBeInTheDocument();
			});

			expect(mockSignInWithPassword).not.toHaveBeenCalled();
			expect(mockUpdateUser).not.toHaveBeenCalled();
		});

		test("新しいパスワードと確認用が一致しない場合、エラーが表示される", async () => {
			const { default: PasswordChangeForm } = await import(
				"@/components/auth/PasswordChangeForm"
			);
			const user = userEvent.setup();

			render(<PasswordChangeForm />);
			await user.type(screen.getByLabelText("現在のパスワード"), "currentpassword");
			await user.type(screen.getByLabelText("新しいパスワード"), "newpassword123");
			await user.type(screen.getByLabelText("新しいパスワード（確認）"), "mismatch123");
			await user.click(screen.getByRole("button", { name: "パスワードを更新" }));

			await waitFor(() => {
				expect(screen.getByText("パスワードが一致しません")).toBeInTheDocument();
			});

			expect(mockSignInWithPassword).not.toHaveBeenCalled();
			expect(mockUpdateUser).not.toHaveBeenCalled();
		});
	});
});
