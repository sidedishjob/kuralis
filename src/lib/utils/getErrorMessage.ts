export function getErrorMessage(error: unknown, fallback = "エラーが発生しました"): string {
	return error instanceof Error ? error.message : fallback;
}
