import { render, screen } from "@testing-library/react";
import { mockAuthUser } from "@/tests/utils/setupAuthMock";

describe("LoadingButton", () => {
	let LoadingButtonComponent: typeof import("@/components/ui/loadingButton").LoadingButton;

	// 共通セットアップ
	const setupComponent = async () => {
		vi.resetModules();
		const mod = await import("@/components/ui/loadingButton");
		LoadingButtonComponent = mod.LoadingButton;
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("通常ユーザー", () => {
		beforeEach(async () => {
			mockAuthUser({ isGuestUser: false });
			await setupComponent();
		});

		test("通常時は子要素（children）を表示する", () => {
			render(<LoadingButtonComponent>登録</LoadingButtonComponent>);
			expect(screen.getByText("登録")).toBeInTheDocument();
		});

		test("isLoading=true のときローディング表示になる", () => {
			render(<LoadingButtonComponent isLoading>登録</LoadingButtonComponent>);
			expect(screen.getByText("処理中...")).toBeInTheDocument(); // デフォルトloadingText
			expect(screen.queryByText("登録")).not.toBeInTheDocument();
		});

		test("loadingText をカスタマイズできる", () => {
			render(
				<LoadingButtonComponent isLoading loadingText="送信中...">
					登録
				</LoadingButtonComponent>
			);
			expect(screen.getByText("送信中...")).toBeInTheDocument();
		});

		test("disabled=true のときボタンは無効になる", () => {
			render(<LoadingButtonComponent disabled>登録</LoadingButtonComponent>);
			expect(screen.getByRole("button")).toBeDisabled();
		});

		test("isLoading=true の場合もボタンは無効になる", () => {
			render(<LoadingButtonComponent isLoading>登録</LoadingButtonComponent>);
			expect(screen.getByRole("button")).toBeDisabled();
		});
	});

	describe("ゲストユーザー", () => {
		beforeEach(async () => {
			mockAuthUser({ isGuestUser: true });
			await setupComponent();
		});

		test("ゲストユーザー時はボタンが無効になる", () => {
			render(<LoadingButtonComponent>登録</LoadingButtonComponent>);
			const button = screen.getByRole("button");
			expect(button).toBeDisabled();
		});

		test("ゲストユーザー時はloadingに関わらずボタンが無効になる", () => {
			render(<LoadingButtonComponent isLoading>登録</LoadingButtonComponent>);
			const button = screen.getByRole("button");
			expect(button).toBeDisabled();
		});

		test("ゲストユーザー時でもchildrenは表示される", () => {
			render(<LoadingButtonComponent>登録</LoadingButtonComponent>);
			expect(screen.getByText("登録")).toBeInTheDocument();
		});

		test("ゲストユーザー時でもloadingTextが表示される", () => {
			render(
				<LoadingButtonComponent isLoading loadingText="送信中...">
					登録
				</LoadingButtonComponent>
			);
			expect(screen.getByText("送信中...")).toBeInTheDocument();
		});
	});

	describe("プロパティの組み合わせ", () => {
		beforeEach(async () => {
			mockAuthUser({ isGuestUser: false });
			await setupComponent();
		});

		test.each([
			// [isLoading, disabled, isGuestUser, expectedDisabled, expectedText]
			[false, false, false, false, "登録"],
			[false, true, false, true, "登録"],
			[true, false, false, true, "処理中..."],
			[true, true, false, true, "処理中..."],
		] as const)(
			"isLoading=%s, disabled=%s の場合、disabled=%s, text=%s",
			(isLoading, disabled, isGuestUser, expectedDisabled, expectedText) => {
				render(
					<LoadingButtonComponent isLoading={isLoading} disabled={disabled}>
						登録
					</LoadingButtonComponent>
				);

				const button = screen.getByRole("button");
				if (expectedDisabled) {
					expect(button).toBeDisabled();
				} else {
					expect(button).not.toBeDisabled();
				}
				expect(screen.getByText(expectedText)).toBeInTheDocument();
			}
		);
	});
});
