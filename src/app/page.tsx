import Link from "next/link";
import { redirect } from "next/navigation";
import { FiArrowRight, FiGrid, FiClock, FiBook } from "react-icons/fi";
import { getUserFromCookie } from "@/lib/supabase/server";

export default async function Page() {
	const user = await getUserFromCookie();
	if (user) {
		redirect("/furniture");
	}

	return (
		<main className="bg-white">
			{/* ヒーローセクション */}
			<section className="relative min-h-screen flex items-center">
				{/* 背景の装飾要素 */}
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-50 via-white to-white" />
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:4rem_4rem]" />

				{/* メインコンテンツ */}
				<div className="container mx-auto px-6 relative z-10">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
						{/* 左側：テキストコンテンツ */}
						<div className="space-y-8">
							<div className="space-y-4">
								<h1 className="text-6xl md:text-7xl font-light tracking-tighter text-neutral-900">
									kuralis
								</h1>
								<p className="text-xl md:text-2xl text-neutral-600 font-light tracking-wide">
									家具との物語を、
									<br />
									デジタルで紡ぐ。
								</p>
							</div>
							<div className="flex flex-col sm:flex-row gap-4">
								<Link
									href="/auth/signup"
									className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-neutral-900 text-white text-base font-medium overflow-hidden"
								>
									<span className="relative z-10">はじめる</span>
									<FiArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
									<div className="absolute inset-0 bg-gradient-to-r from-neutral-800 to-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								</Link>
								<Link
									href="/auth/login"
									className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 border border-neutral-200 text-neutral-600 text-base font-medium overflow-hidden"
								>
									<span className="relative z-10">ログイン</span>
									<div className="absolute inset-0 bg-neutral-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								</Link>
							</div>
						</div>

						{/* 右側：装飾的な要素 */}
						<div className="relative hidden lg:block">
							<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-100 via-white to-white rounded-full" />
							<div className="relative aspect-square rounded-full border border-neutral-100 flex items-center justify-center">
								<div className="absolute inset-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-50 via-white to-white rounded-full" />
								<div className="absolute inset-16 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-100 via-white to-white rounded-full" />
							</div>
						</div>
					</div>
				</div>

				{/* スクロールインジケーター */}
				<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
					<div className="w-6 h-10 border-2 border-neutral-200 rounded-full flex justify-center">
						<div className="w-1 h-3 bg-neutral-400 rounded-full mt-2 animate-scroll" />
					</div>
				</div>
			</section>

			{/* 特徴セクション */}
			<section className="py-32 relative">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-50 via-white to-white" />
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:4rem_4rem]" />

				<div className="container mx-auto px-6 relative z-10">
					<div className="max-w-3xl mx-auto text-center mb-20">
						<h2 className="text-3xl md:text-4xl font-light text-neutral-900 mb-6">
							家具との暮らしを、
							<br />
							もっと豊かに。
						</h2>
						<p className="text-lg text-neutral-600">
							大切な家具との日々を、デジタルで記録し、
							<br />
							より深い関係性を育んでいきましょう。
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto">
						<div className="group space-y-6">
							<div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center group-hover:bg-neutral-100 transition-colors duration-300">
								<FiGrid className="w-8 h-8 text-neutral-600" />
							</div>
							<h3 className="text-xl font-medium text-neutral-900 tracking-tight">
								家具を記録する
							</h3>
							<p className="text-base text-neutral-600 leading-relaxed">
								お気に入りの家具や写真、設置場所を
								<br />
								シンプルに管理できます。
							</p>
						</div>
						<div className="group space-y-6">
							<div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center group-hover:bg-neutral-100 transition-colors duration-300">
								<FiClock className="w-8 h-8 text-neutral-600" />
							</div>
							<h3 className="text-xl font-medium text-neutral-900 tracking-tight">
								メンテナンスを可視化
							</h3>
							<p className="text-base text-neutral-600 leading-relaxed">
								家具ごとにメンテナンス履歴や
								<br />
								実施予定を記録し、いつでも見返せます。
							</p>
						</div>
						<div className="group space-y-6">
							<div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center group-hover:bg-neutral-100 transition-colors duration-300">
								<FiBook className="w-8 h-8 text-neutral-600" />
							</div>
							<h3 className="text-xl font-medium text-neutral-900 tracking-tight">
								思い出とストーリー
							</h3>
							<p className="text-base text-neutral-600 leading-relaxed">
								家具にまつわる思い出や
								<br />
								家族のストーリーも、そっと残せます。
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTAセクション */}
			<section className="py-32 relative">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-50 via-white to-white" />
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:4rem_4rem]" />

				<div className="container mx-auto px-6 text-center relative z-10">
					<div className="max-w-3xl mx-auto space-y-8">
						<p className="text-2xl md:text-3xl text-neutral-900 font-light tracking-wide">
							家具との物語を、
							<br />
							はじめませんか？
						</p>
						<Link
							href="/auth/signup"
							className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-neutral-900 text-white text-base font-medium overflow-hidden"
						>
							<span className="relative z-10">無料ではじめる</span>
							<FiArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
							<div className="absolute inset-0 bg-gradient-to-r from-neutral-800 to-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
						</Link>
					</div>
				</div>
			</section>

			{/* フッターセクション */}
			<section className="py-16 relative border-t border-neutral-100">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-50 via-white to-white" />
				<div className="container mx-auto px-6 text-center relative z-10">
					<p className="text-sm text-neutral-500 leading-relaxed max-w-2xl mx-auto">
						kuralis（クラリス）は、大切な家具との毎日を
						<br />
						シンプルに、美しく管理できるサービスです。
						<br />
						あなたと家具の物語を、これからも。
					</p>
				</div>
			</section>
		</main>
	);
}
