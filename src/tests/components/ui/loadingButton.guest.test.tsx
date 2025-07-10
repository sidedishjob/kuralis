import { render, screen } from "@testing-library/react";
import { LoadingButton } from "@/components/ui/loadingButton";

// useAuth() をモックする（ゲストユーザー）
vi.mock("@/hooks/useAuth", () => ({
	useAuth: () => ({ isGuestUser: true }),
}));

describe("LoadingButton (ゲストユーザー)", () => {
	test("ゲストユーザー時はボタンが無効になる", () => {
		render(<LoadingButton>登録</LoadingButton>);
		const button = screen.getByRole("button");
		expect(button).toBeDisabled();
	});
});
