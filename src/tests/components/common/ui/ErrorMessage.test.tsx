import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorMessage } from "@/components/common/ui/ErrorMessage";

describe("ErrorMessage", () => {
	// 1. Error オブジェクトを渡した場合
	test("Errorインスタンスを表示できる", () => {
		const error = new Error("ネットワークエラー");
		render(<ErrorMessage error={error} />);
		expect(screen.getByText("ネットワークエラー")).toBeInTheDocument();
	});

	// 2. string 型を渡した場合
	test("string型のエラーも表示できる", () => {
		render(<ErrorMessage error="不正なリクエストです" />);
		expect(screen.getByText("不正なリクエストです")).toBeInTheDocument();
	});

	// 3. unknown 型（数値など）を渡した場合
	test("unknown型はデフォルトメッセージになる", () => {
		render(<ErrorMessage error={12345} />);
		expect(screen.getByText("不明なエラーが発生しました")).toBeInTheDocument();
	});

	// 4. onRetry が指定された場合
	test("再試行ボタンが表示され、クリックできる", () => {
		const handleRetry = vi.fn();
		render(<ErrorMessage error="test" onRetry={handleRetry} />);
		const button = screen.getByRole("button", { name: /再試行/i });
		expect(button).toBeInTheDocument();

		fireEvent.click(button);
		expect(handleRetry).toHaveBeenCalledTimes(1);
	});

	// 5. onRetry が指定されていない場合
	test("再試行ボタンが無い場合、表示されない", () => {
		render(<ErrorMessage error="test" />);
		expect(screen.queryByRole("button", { name: /再試行/i })).not.toBeInTheDocument();
	});
});
