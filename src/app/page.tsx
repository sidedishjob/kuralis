import Link from "next/link";
import { redirect } from "next/navigation";
import { FiArrowRight, FiHeart, FiClock, FiBookOpen } from "react-icons/fi";
import { getUserFromCookie } from "@/lib/supabase/server";

export default async function Page() {
	const user = await getUserFromCookie();
	if (user) {
		redirect("/furniture");
	}

	return (
		<main>
			{/* ヒーローセクション */}
			<section className="min-h-[85vh] relative flex flex-col justify-center items-center text-center px-4 overflow-hidden bg-gradient-to-b from-white to-kuralis-50">
				<div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-50"></div>
				<div className="relative z-10">
					<h1 className="text-6xl md:text-8xl tracking-tight mb-10 text-kuralis-900 animate-fade-in">
						kuralis
					</h1>
					<p className="text-2xl md:text-3xl text-kuralis-700 tracking-wide mb-8 max-w-2xl mx-auto leading-relaxed">
						使い手として、
						<span className="text-kuralis-900">家具と暮らす。</span>
					</p>
					<div className="flex flex-col md:flex-row justify-center gap-5">
						<Link
							href="/auth/signup"
							className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-kuralis-900 border-2 border-kuralis-900 text-white text-lg rounded-lg hover:bg-kuralis-50 hover:text-kuralis-900 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
						>
							Start Collection
							<FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
						</Link>
						<Link
							href="/auth/login"
							className="px-8 py-4 text-kuralis-900 text-lg bg-white border-2 border-kuralis-900 rounded-lg hover:bg-kuralis-300 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
						>
							Login
						</Link>
					</div>
				</div>
				<div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
			</section>

			{/* Value Props */}
			<section className="max-w-6xl mx-auto px-4 py-32 grid md:grid-cols-3 gap-12">
				<div className="group p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
					<div className="w-12 h-12 bg-kuralis-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-kuralis-200 transition-colors">
						<FiHeart className="w-6 h-6 text-kuralis-700" />
					</div>
					<h3 className="text-xl text-kuralis-900 mb-4">家具を記録する</h3>
					<p className="text-base text-kuralis-600 leading-relaxed">
						お気に入りの家具や写真、設置場所をシンプルに管理できます。
					</p>
				</div>
				<div className="group p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
					<div className="w-12 h-12 bg-kuralis-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-kuralis-200 transition-colors">
						<FiClock className="w-6 h-6 text-kuralis-700" />
					</div>
					<h3 className="text-xl text-kuralis-900 mb-4">メンテナンスを可視化</h3>
					<p className="text-base text-kuralis-600 leading-relaxed">
						家具ごとにメンテナンス履歴や実施予定を記録し、いつでも見返せます。
					</p>
				</div>
				<div className="group p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
					<div className="w-12 h-12 bg-kuralis-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-kuralis-200 transition-colors">
						<FiBookOpen className="w-6 h-6 text-kuralis-700" />
					</div>
					<h3 className="text-xl text-kuralis-900 mb-4">思い出とストーリー</h3>
					<p className="text-base text-kuralis-600 leading-relaxed">
						家具にまつわる思い出や家族のストーリーも、そっと残せます。
					</p>
				</div>
			</section>

			{/* サブCTA */}
			<section className="py-32 text-center border-t border-kuralis-100">
				<div className="max-w-3xl mx-auto px-4">
					<p className="text-2xl md:text-3xl mb-12 tracking-wide">
						家具のある暮らしを、
						<br className="block md:hidden" />
						もっと心地よく。
					</p>
					<Link
						href="/auth/signup"
						className="group inline-flex items-center gap-2 px-8 py-4 bg-kuralis-900 border-2 border-kuralis-900 text-white rounded-lg hover:bg-kuralis-50 hover:text-kuralis-900 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
					>
						無料ではじめる
						<FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
					</Link>
				</div>
			</section>

			{/* フッター */}
			<section className="py-16 text-center bg-kuralis-950 text-kuralis-600">
				<div className="max-w-3xl mx-auto px-4">
					<p className="text-base leading-relaxed">
						kuralis（クラリス）は、大切な家具との毎日をシンプルに、美しく管理できるサービスです。
						<br />
						あなたと家具の物語を、これからも。
					</p>
				</div>
			</section>
		</main>
	);
}
