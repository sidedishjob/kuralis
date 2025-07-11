import { render, screen } from "@testing-library/react";
import { NavigationLinks } from "@/components/common/navigation/NavigationLinks";

// useAuth() をモックする（通常ユーザー）
vi.mock("@/hooks/useAuth", () => ({
	useAuth: () => ({
		user: null,
		loading: false,
		logout: vi.fn(),
		isGuestUser: false,
	}),
}));

// useToast もモック（使われないがエラー防止）
vi.mock("@/hooks/useToast", () => ({
	useToast: () => ({ toast: vi.fn() }),
}));

// router もモック（未使用）
vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: vi.fn() }),
}));

// gtag モック（クリックイベント用）
vi.mock("@/lib/gtag", () => ({
	event: vi.fn(),
}));

describe("NavigationLinks - 初期レンダリング", () => {
	test("未ログインかつ loading=false のとき、アプリについて・お問い合わせ・ログインが表示される", () => {
		render(<NavigationLinks variant="desktop" />);

		expect(screen.getByText("アプリについて")).toBeInTheDocument();
		expect(screen.getByText("お問い合わせ")).toBeInTheDocument();
		expect(screen.getByText("ログイン")).toBeInTheDocument();
	});
});

describe("NavigationLinks - loading中の表示", () => {
	beforeEach(() => {
		vi.resetModules(); // モックを初期化
	});

	test("loading=true の場合（desktop）、スケルトンが表示される", async () => {
		vi.doMock("@/hooks/useAuth", () => ({
			useAuth: () => ({
				user: null,
				loading: true,
				logout: vi.fn(),
				isGuestUser: false,
			}),
		}));

		const { NavigationLinks } = await import("@/components/common/navigation/NavigationLinks");
		const { render } = await import("@testing-library/react");

		const { container } = render(<NavigationLinks variant="desktop" />);
		const skeleton = container.querySelector("div.w-64.h-10");
		expect(skeleton).toBeInTheDocument();
	});

	test("loading=true の場合（mobile）、何も表示されない", async () => {
		vi.doMock("@/hooks/useAuth", () => ({
			useAuth: () => ({
				user: null,
				loading: true,
				logout: vi.fn(),
				isGuestUser: false,
			}),
		}));

		const { NavigationLinks } = await import("@/components/common/navigation/NavigationLinks");
		const { render } = await import("@testing-library/react");

		const { container } = render(<NavigationLinks variant="mobile" />);
		expect(container).toBeEmptyDOMElement();
	});
});

describe("NavigationLinks - ログイン済みの表示（desktop）", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	test("user が存在するとき、「家具一覧」「メンテナンス予定」リンクとユーザーの dropdown が表示される", async () => {
		vi.doMock("@/hooks/useAuth", () => ({
			useAuth: () => ({
				user: { email: "test@example.com" },
				loading: false,
				logout: vi.fn(),
				isGuestUser: false,
			}),
		}));

		const { NavigationLinks } = await import("@/components/common/navigation/NavigationLinks");
		const { render, screen } = await import("@testing-library/react");

		render(<NavigationLinks variant="desktop" />);

		// 基本リンクの表示を確認
		expect(screen.getByText("家具一覧")).toBeInTheDocument();
		expect(screen.getByText("メンテナンス予定")).toBeInTheDocument();

		// ドロップダウンのボタン（ユーザー名）が表示されていることを確認
		expect(screen.getByText("test@example.com")).toBeInTheDocument();
	});
});

describe("NavigationLinks - ログイン済みの表示（mobile）", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	test("user が存在するとき、「家具一覧」「メンテナンス予定」「設定」「アプリについて」「ログアウト」リンクが表示される", async () => {
		vi.doMock("@/hooks/useAuth", () => ({
			useAuth: () => ({
				user: { email: "test@example.com" },
				loading: false,
				logout: vi.fn(),
				isGuestUser: false,
			}),
		}));

		const { NavigationLinks } = await import("@/components/common/navigation/NavigationLinks");
		const { render, screen } = await import("@testing-library/react");

		render(<NavigationLinks variant="mobile" />);

		// リンクの表示を確認
		expect(screen.getByText("家具一覧")).toBeInTheDocument();
		expect(screen.getByText("メンテナンス予定")).toBeInTheDocument();
		expect(screen.getByText("設定")).toBeInTheDocument();
		expect(screen.getByText("アプリについて")).toBeInTheDocument();
		expect(screen.getByText("ログアウト")).toBeInTheDocument();
	});
});

describe("NavigationLinks - ゲストユーザー表示（desktop）", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	test("isGuestUser = true の場合、「ゲストユーザー」と表示される", async () => {
		vi.doMock("@/hooks/useAuth", () => ({
			useAuth: () => ({
				user: { email: "test@example.com" },
				loading: false,
				logout: vi.fn(),
				isGuestUser: true,
			}),
		}));

		const { NavigationLinks } = await import("@/components/common/navigation/NavigationLinks");
		const { render, screen } = await import("@testing-library/react");

		render(<NavigationLinks variant="desktop" />);

		expect(screen.getByText("ゲストユーザー")).toBeInTheDocument();
	});
});

describe("NavigationLinks - ログアウト動作", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	test("ログアウトボタンをクリックすると logout() が呼ばれる", async () => {
		const logoutMock = vi.fn();

		vi.doMock("@/hooks/useAuth", () => ({
			useAuth: () => ({
				user: { email: "test@example.com" },
				loading: false,
				logout: logoutMock,
				isGuestUser: false,
			}),
		}));

		const { NavigationLinks } = await import("@/components/common/navigation/NavigationLinks");
		const { render, screen } = await import("@testing-library/react");
		const userEvent = (await import("@testing-library/user-event")).default;

		render(<NavigationLinks variant="mobile" />);

		const logoutButton = screen.getByRole("button", { name: "ログアウト" });
		await userEvent.click(logoutButton);

		expect(logoutMock).toHaveBeenCalledTimes(1);
	});
});

describe("NavigationLinks - ログアウト後に toast が呼ばれる", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	test("ログアウト成功時に toast が呼ばれる", async () => {
		const logoutMock = vi.fn().mockResolvedValue(undefined); // logout() 成功を想定
		const toastMock = vi.fn();

		vi.doMock("@/hooks/useAuth", () => ({
			useAuth: () => ({
				user: { email: "test@example.com" },
				loading: false,
				logout: logoutMock,
				isGuestUser: false,
			}),
		}));

		vi.doMock("@/hooks/useToast", () => ({
			useToast: () => ({ toast: toastMock }),
		}));

		const { NavigationLinks } = await import("@/components/common/navigation/NavigationLinks");
		const { render, screen } = await import("@testing-library/react");
		const userEvent = (await import("@testing-library/user-event")).default;

		render(<NavigationLinks variant="mobile" />);
		const logoutButton = screen.getByRole("button", { name: "ログアウト" });

		await userEvent.click(logoutButton);

		expect(logoutMock).toHaveBeenCalledTimes(1);
		expect(toastMock).toHaveBeenCalledWith(
			expect.objectContaining({ title: "ログアウトしました" })
		);
	});
});

describe("NavigationLinks - ログアウト失敗時にエラートーストが表示される", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	test("logout() がエラーを投げた場合、エラートーストが表示される", async () => {
		const logoutMock = vi.fn().mockRejectedValue(new Error("サーバーエラー"));
		const toastMock = vi.fn();

		vi.doMock("@/hooks/useAuth", () => ({
			useAuth: () => ({
				user: { email: "error@example.com" },
				loading: false,
				logout: logoutMock,
				isGuestUser: false,
			}),
		}));

		vi.doMock("@/hooks/useToast", () => ({
			useToast: () => ({ toast: toastMock }),
		}));

		vi.doMock("@/lib/utils/getErrorMessage", () => ({
			getErrorMessage: (err: unknown, fallback: string) =>
				err instanceof Error ? err.message : fallback,
		}));

		const { NavigationLinks } = await import("@/components/common/navigation/NavigationLinks");
		const { render, screen } = await import("@testing-library/react");
		const userEvent = (await import("@testing-library/user-event")).default;

		render(<NavigationLinks variant="mobile" />);
		const logoutButton = screen.getByRole("button", { name: "ログアウト" });

		await userEvent.click(logoutButton);

		expect(logoutMock).toHaveBeenCalledTimes(1);

		expect(toastMock).toHaveBeenCalledWith(
			expect.objectContaining({
				title: "ログアウトに失敗しました",
				description: "サーバーエラー",
				variant: "destructive",
			})
		);
	});
});
