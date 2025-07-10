import { render, screen } from "@testing-library/react";
import { LoadingButton } from "@/components/ui/loadingButton";

// useAuth() をモックする（通常ユーザー）
vi.mock("@/hooks/useAuth", () => ({
	useAuth: () => ({ isGuestUser: false }),
}));

describe("LoadingButton", () => {
	// 1. 通常状態：childrenが表示される
	test("通常時は子要素（children）を表示する", () => {
		render(<LoadingButton>登録</LoadingButton>);
		expect(screen.getByText("登録")).toBeInTheDocument();
	});

	// 2. isLoading: true のときローディング表示になる
	test("isLoading=true のときローディング表示になる", () => {
		render(<LoadingButton isLoading>登録</LoadingButton>);
		expect(screen.getByText("処理中...")).toBeInTheDocument(); // デフォルトloadingText
		expect(screen.queryByText("登録")).not.toBeInTheDocument();
	});

	// 3. loadingText をカスタマイズできる
	test("loadingText をカスタマイズできる", () => {
		render(
			<LoadingButton isLoading loadingText="送信中...">
				登録
			</LoadingButton>
		);
		expect(screen.getByText("送信中...")).toBeInTheDocument();
	});

	// 4. disabled = true でボタンが無効になる
	test("disabled=true のときボタンは無効になる", () => {
		render(<LoadingButton disabled>登録</LoadingButton>);
		expect(screen.getByRole("button")).toBeDisabled();
	});
});
