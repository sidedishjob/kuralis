import Link from "next/link";
import { redirect } from "next/navigation";
import { FiArrowRight } from "react-icons/fi";
import { getUserFromCookie } from "@/lib/server/auth";

export default async function Page() {
	const user = await getUserFromCookie();
	if (user) {
		redirect("/furniture");
	}

	return (
		<main className="bg-white">
			{/* ファーストビュー */}
			<section className="min-h-[85vh] flex flex-col justify-center items-center text-center px-4">
				<h1 className="text-5xl md:text-7xl font-light tracking-tight mb-8 text-kuralis-900">
					kuralis
				</h1>
				<p className="text-xl md:text-2xl text-kuralis-700 font-light tracking-wide mb-12">
					使い手として、家具と暮らす。
				</p>
				<div className="flex flex-col md:flex-row gap-5 mt-6">
					<Link
						href="/signup"
						className="inline-flex items-center gap-2 px-8 py-3 border border-kuralis-900 text-kuralis-900 text-base font-medium hover:bg-kuralis-900 hover:text-white transition-all duration-200 shadow-none"
					>
						Start Collection
						<FiArrowRight className="w-5 h-5" />
					</Link>
					<Link
						href="/auth/login"
						className="inline-flex items-center gap-2 px-8 py-3 border border-kuralis-100 text-kuralis-400 text-base font-medium hover:bg-kuralis-100 hover:text-kuralis-700 transition-all duration-200 shadow-none"
					>
						Login
					</Link>
				</div>
			</section>

			{/* Value Props */}
			<section className="max-w-5xl mx-auto px-4 py-32 grid md:grid-cols-3 gap-16 border-t border-kuralis-100">
				<div>
					<h3 className="text-lg font-semibold text-kuralis-800 mb-3 tracking-tight">
						家具を記録する
					</h3>
					<p className="text-base text-kuralis-500 leading-relaxed">
						お気に入りの家具や写真、設置場所をシンプルに管理できます。
					</p>
				</div>
				<div>
					<h3 className="text-lg font-semibold text-kuralis-800 mb-3 tracking-tight">
						メンテナンスを可視化
					</h3>
					<p className="text-base text-kuralis-500 leading-relaxed">
						家具ごとにメンテナンス履歴や実施予定を記録し、いつでも見返せます。
					</p>
				</div>
				<div>
					<h3 className="text-lg font-semibold text-kuralis-800 mb-3 tracking-tight">
						思い出とストーリー
					</h3>
					<p className="text-base text-kuralis-500 leading-relaxed">
						家具にまつわる思い出や家族のストーリーも、そっと残せます。
					</p>
				</div>
			</section>

			{/* サブCTA */}
			<section className="py-20 text-center border-t border-kuralis-100">
				<p className="text-lg text-kuralis-700 mb-10 font-light tracking-wide">
					家具のある暮らしを、もっと心地よく。
				</p>
				<Link
					href="/signup"
					className="inline-flex items-center gap-2 px-8 py-3 border border-kuralis-900 text-kuralis-900 text-base font-medium hover:bg-kuralis-900 hover:text-white transition-all duration-200 shadow-none"
				>
					無料ではじめる
					<FiArrowRight className="w-5 h-5" />
				</Link>
			</section>

			{/* フッター的な世界観説明（SEO用） */}
			<section className="py-12 text-center text-kuralis-400 border-t border-kuralis-100">
				<p className="text-sm leading-relaxed">
					kuralis（クラリス）は、大切な家具との毎日をシンプルに、美しく管理できるサービスです。
					<br />
					あなたと家具の物語を、これからも。
				</p>
			</section>
		</main>
	);
}
