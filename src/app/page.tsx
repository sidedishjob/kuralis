import Link from "next/link";
import Image from "next/image";
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

			{/* UI ギャラリー */}
			<section className="py-24 bg-kuralis-50">
				<h2 className="text-3xl md:text-4xl font-bold text-center text-kuralis-900 mb-16">
					アプリ画面で見る「kuralis」
				</h2>
				<div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4">
					<Image
						src="/images/furniture-list.png"
						alt="家具一覧画面"
						className="rounded-xl shadow-md"
					/>
					<Image
						src="/images/furniture-detail.png"
						alt="家具詳細画面"
						className="rounded-xl shadow-md"
					/>
					<Image
						src="/images/maintenance-form.png"
						alt="メンテナンスタスク追加"
						className="rounded-xl shadow-md"
					/>
					<Image
						src="/images/maintenance-calendar.png"
						alt="メンテ履歴カレンダー"
						className="rounded-xl shadow-md"
					/>
				</div>
			</section>

			{/* 使い方の流れ（How it works） */}
			<section className="max-w-5xl mx-auto px-4 py-24">
				<h2 className="text-3xl md:text-4xl font-bold text-center text-kuralis-900 mb-16">
					使い方はかんたん、3ステップ
				</h2>
				<div className="grid md:grid-cols-3 gap-12">
					<div className="text-center">
						<div className="w-16 h-16 bg-kuralis-100 rounded-full flex items-center justify-center mx-auto mb-6">
							<span className="text-2xl font-bold text-kuralis-700">1</span>
						</div>
						<h3 className="text-xl font-semibold text-kuralis-900 mb-3">家具を登録</h3>
						<p className="text-kuralis-600">
							家具の名前やブランド、設置場所、購入日を入力。写真も追加可能です。
						</p>
					</div>
					<div className="text-center">
						<div className="w-16 h-16 bg-kuralis-100 rounded-full flex items-center justify-center mx-auto mb-6">
							<span className="text-2xl font-bold text-kuralis-700">2</span>
						</div>
						<h3 className="text-xl font-semibold text-kuralis-900 mb-3">
							メンテナンスを設定
						</h3>
						<p className="text-kuralis-600">
							定期的な掃除や手入れのタスクを追加。次回の予定日も自動計算。
						</p>
					</div>
					<div className="text-center">
						<div className="w-16 h-16 bg-kuralis-100 rounded-full flex items-center justify-center mx-auto mb-6">
							<span className="text-2xl font-bold text-kuralis-700">3</span>
						</div>
						<h3 className="text-xl font-semibold text-kuralis-900 mb-3">
							次回予定を確認
						</h3>
						<p className="text-kuralis-600">
							家具ごとの次回メンテ日をカレンダーや一覧で確認。通知も対応予定。
						</p>
					</div>
				</div>
			</section>

			{/* アニメーション付き導線セクション */}
			<section className="py-24 bg-white border-t border-kuralis-100">
				<h2 className="text-3xl md:text-4xl font-bold text-center text-kuralis-900 mb-12">
					操作はこのくらいシンプル
				</h2>
				<div className="max-w-4xl mx-auto px-4 text-center">
					<p className="text-kuralis-600 mb-8">
						家具を登録し、タスクを追加して、次の予定を確認。直感的な操作で完結します。
					</p>
					{/* <Image
						src="/images/demo-flow.gif"
						alt="アプリ操作の流れ"
						className="mx-auto rounded-xl shadow-lg max-w-full h-auto"
					/> */}
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
