import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-neutral-950 px-6 py-16 text-center">
			<h1 className="text-6xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">404</h1>
			<p className="text-lg text-neutral-600 dark:text-neutral-300 mb-8">
				お探しのページが見つかりませんでした。
			</p>
			<Link
				href="/"
				className="px-6 py-2 rounded-full bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 transition-transform hover:scale-105"
			>
				ホームに戻る
			</Link>
		</div>
	);
}
