import { render, screen } from "@testing-library/react";
import { Mock } from "vitest";
import { mockAuthUser } from "@/tests/utils/setupAuthMock";

// 共通のモック設定
const mockPush = vi.fn();
const mockToast = vi.fn();

vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/hooks/useToast", () => ({
	useToast: () => ({ toast: mockToast }),
}));

vi.mock("@/lib/utils/getErrorMessage", () => ({
	getErrorMessage: (err: unknown, fallback: string) =>
		err instanceof Error ? err.message : fallback,
}));

describe("NavigationLinks", () => {
	let NavigationLinks: typeof import("@/components/common/navigation/NavigationLinks").NavigationLinks;

	// 共通セットアップ
	const setupComponent = async () => {
		vi.resetModules();
		const mod = await import("@/components/common/navigation/NavigationLinks");
		NavigationLinks = mod.NavigationLinks;
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("初期レンダリング", () => {
		beforeEach(async () => {
			mockAuthUser({ user: null });
			await setupComponent();
		});

		test("未ログインかつ loading=false のとき、アプリについて・お問い合わせ・ログインが表示される", () => {
			render(<NavigationLinks variant="desktop" />);

			expect(screen.getByText("アプリについて")).toBeInTheDocument();
			expect(screen.getByText("お問い合わせ")).toBeInTheDocument();
			expect(screen.getByText("ログイン")).toBeInTheDocument();
		});
	});

	describe("loading中の表示", () => {
		beforeEach(async () => {
			mockAuthUser({ user: null, loading: true });
			await setupComponent();
		});

		test("loading=true の場合（desktop）、スケルトンが表示される", () => {
			const { container } = render(<NavigationLinks variant="desktop" />);
			const skeleton = container.querySelector("div.w-64.h-10");
			expect(skeleton).toBeInTheDocument();
		});

		test("loading=true の場合（mobile）、何も表示されない", () => {
			const { container } = render(<NavigationLinks variant="mobile" />);
			expect(container).toBeEmptyDOMElement();
		});
	});

	describe("ログイン済みの表示", () => {
		beforeEach(async () => {
			mockAuthUser();
			await setupComponent();
		});

		test("desktop: user が存在するとき、基本リンクとドロップダウンが表示される", () => {
			render(<NavigationLinks variant="desktop" />);

			expect(screen.getByText("家具一覧")).toBeInTheDocument();
			expect(screen.getByText("メンテナンス予定")).toBeInTheDocument();
			expect(screen.getByText("test@example.com")).toBeInTheDocument();
		});

		test("mobile: user が存在するとき、全てのリンクが表示される", () => {
			render(<NavigationLinks variant="mobile" />);

			expect(screen.getByText("家具一覧")).toBeInTheDocument();
			expect(screen.getByText("メンテナンス予定")).toBeInTheDocument();
			expect(screen.getByText("設定")).toBeInTheDocument();
			expect(screen.getByText("アプリについて")).toBeInTheDocument();
			expect(screen.getByText("ログアウト")).toBeInTheDocument();
		});
	});

	describe("ゲストユーザー表示", () => {
		beforeEach(async () => {
			mockAuthUser({ isGuestUser: true });
			await setupComponent();
		});

		test("isGuestUser = true の場合、「ゲストユーザー」と表示される", () => {
			render(<NavigationLinks variant="desktop" />);
			expect(screen.getByText("ゲストユーザー")).toBeInTheDocument();
		});
	});

	describe("リンクの動作", () => {
		describe("ログイン時", () => {
			beforeEach(async () => {
				mockAuthUser();
				await setupComponent();
			});

			test.each([
				["mobile", "家具一覧", "/furniture"],
				["mobile", "メンテナンス予定", "/maintenance"],
				["mobile", "設定", "/settings"],
				["mobile", "アプリについて", "/about"],
				["desktop", "家具一覧", "/furniture"],
				["desktop", "メンテナンス予定", "/maintenance"],
			] as const)("%s: %s リンクは %s に設定されている", (variant, label, href) => {
				render(<NavigationLinks variant={variant} />);
				const link = screen.getByRole("link", { name: label });
				expect(link).toHaveAttribute("href", href);
			});

			test("desktop: ドロップダウン内に設定・アプリについてが表示される", async () => {
				const user = (await import("@testing-library/user-event")).default.setup();

				render(<NavigationLinks variant="desktop" />);
				await user.click(screen.getByRole("button", { name: "test@example.com" }));

				expect(await screen.findByRole("menuitem", { name: "設定" })).toBeInTheDocument();
				expect(
					await screen.findByRole("menuitem", { name: "アプリについて" })
				).toBeInTheDocument();
			});
		});

		describe("未ログイン時", () => {
			beforeEach(async () => {
				mockAuthUser({ user: null });
				await setupComponent();
			});

			test.each([
				["アプリについて", "/about"],
				["お問い合わせ", "/contact"],
				["ログイン", "/auth/login"],
			])("desktop: %s リンクは %s に設定されている", (label, href) => {
				render(<NavigationLinks variant="desktop" />);
				const link = screen.getByRole("link", { name: label });
				expect(link).toHaveAttribute("href", href);
			});
		});
	});

	describe("ログアウト動作", () => {
		let logoutMock: Mock<() => Promise<void>>;

		beforeEach(async () => {
			logoutMock = vi.fn();
			mockAuthUser({ logout: logoutMock });
			await setupComponent();
		});

		test("ログアウトボタンを押すと logout() が呼ばれる", async () => {
			const userEvent = (await import("@testing-library/user-event")).default;

			render(<NavigationLinks variant="mobile" />);
			await userEvent.click(screen.getByRole("button", { name: "ログアウト" }));

			expect(logoutMock).toHaveBeenCalledTimes(1);
		});

		test("ログアウト成功時にトーストが表示され、ホームに遷移する", async () => {
			logoutMock.mockResolvedValue(undefined);
			const userEvent = (await import("@testing-library/user-event")).default;

			render(<NavigationLinks variant="mobile" />);
			await userEvent.click(screen.getByRole("button", { name: "ログアウト" }));

			expect(logoutMock).toHaveBeenCalledTimes(1);
			expect(mockToast).toHaveBeenCalledWith(
				expect.objectContaining({ title: "ログアウトしました" })
			);
			expect(mockPush).toHaveBeenCalledWith("/");
		});

		test("ログアウト失敗時にエラートーストが表示される", async () => {
			const error = new Error("サーバーエラー");
			logoutMock.mockRejectedValue(error);

			// 一時的に console.error を抑制
			const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
			const userEvent = (await import("@testing-library/user-event")).default;

			render(<NavigationLinks variant="mobile" />);
			await userEvent.click(screen.getByRole("button", { name: "ログアウト" }));

			expect(logoutMock).toHaveBeenCalledTimes(1);
			expect(mockToast).toHaveBeenCalledWith(
				expect.objectContaining({
					title: "ログアウトに失敗しました",
					description: "サーバーエラー",
					variant: "destructive",
				})
			);

			// 元に戻す（他のテストへの影響を防ぐ）
			consoleErrorSpy.mockRestore();
		});
	});
});
