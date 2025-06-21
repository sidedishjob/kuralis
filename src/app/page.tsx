import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
	FiArrowRight,
	FiHeart,
	FiClock,
	FiBookOpen,
	FiImage,
	FiEdit,
	FiTool,
	FiCalendar,
} from "react-icons/fi";
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
					<h1 className="text-6xl md:text-8xl tracking-tight mb-10 text-kuralis-900 font-bold animate-fade-in">
						kuralis
					</h1>
					<p className="text-2xl md:text-3xl text-kuralis-700 tracking-wide mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
						使い手として、
						<span className="text-kuralis-900">家具と暮らす。</span>
					</p>
					<div className="flex flex-col md:flex-row justify-center gap-5">
						<Link
							href="/auth/signup"
							className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-kuralis-900 border-2 border-kuralis-900 text-white text-lg font-medium rounded-lg hover:bg-kuralis-50 hover:text-kuralis-900 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
						>
							Start Collection
							<FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
						</Link>
						<Link
							href="/auth/login"
							className="px-8 py-4 text-kuralis-900 text-lg font-medium bg-white border-2 border-kuralis-900 rounded-lg hover:bg-kuralis-300 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
						>
							Login
						</Link>
					</div>
				</div>
				<div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
			</section>

			{/* Value Props */}
			<section className="max-w-6xl mx-auto px-4 py-32 grid md:grid-cols-3 gap-12">
				{[
					{
						icon: <FiHeart className="w-6 h-6 text-kuralis-700" />,
						title: "家具を記録する",
						desc: "お気に入りの家具や写真、設置場所をシンプルに管理できます。",
					},
					{
						icon: <FiClock className="w-6 h-6 text-kuralis-700" />,
						title: "メンテナンスを可視化",
						desc: "家具ごとにメンテナンス履歴や実施予定を記録し、いつでも見返せます。",
					},
					{
						icon: <FiBookOpen className="w-6 h-6 text-kuralis-700" />,
						title: "思い出とストーリー",
						desc: "家具にまつわる思い出や家族のストーリーも、そっと残せます。",
					},
				].map((item, index) => (
					<div
						key={index}
						className="group p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
					>
						<div className="w-12 h-12 bg-kuralis-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-kuralis-200 transition-colors">
							{item.icon}
						</div>
						<h3 className="text-xl text-kuralis-900 mb-4 font-semibold">
							{item.title}
						</h3>
						<p className="text-base text-kuralis-600 leading-relaxed font-normal">
							{item.desc}
						</p>
					</div>
				))}
			</section>

			{/* UI ギャラリー */}
			<section className="relative py-24  bg-gradient-to-bl from-kuralis-50 via-white to-kuralis-100">
				<h2 className="text-4xl md:text-5xl tracking-tight text-center font-bold text-kuralis-900 mb-8">
					kuralis in Action
				</h2>
				<p className="text-center text-kuralis-600 text-base md:text-lg max-w-xl mx-auto mb-16 leading-relaxed">
					家具の記録から日々の手入れまで。
					<br />
					その日常のすべてを、シンプルな画面で。
				</p>

				<div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto px-4">
					{[
						{
							src: "/images/furniture-list.png",
							alt: "家具一覧画面",
							title: "家具一覧",
							caption: "登録された家具の一覧を確認",
						},
						{
							src: "/images/furniture-detail.png",
							alt: "家具詳細画面",
							title: "家具詳細",
							caption: "選択した家具の詳細情報を閲覧・編集",
						},
						{
							src: "/images/furniture-register.png",
							alt: "家具登録",
							title: "家具登録",
							caption: "家具名・設置場所・写真を入力し、家具を登録",
						},
						{
							src: "/images/maintenance-calendar.png",
							alt: "メンテ履歴カレンダー",
							title: "メンテ履歴カレンダー",
							caption: "メンテナンス履歴をカレンダー形式で確認",
						},
					].map((img) => (
						<div
							key={img.src}
							className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
						>
							<div className="relative aspect-[16/9] group">
								<Image
									src={img.src}
									alt={img.alt}
									fill
									sizes="(max-width: 768px) 100vw, 50vw"
									className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
								/>
							</div>
							<div className="p-4 md:p-6 space-y-2">
								<h3 className="text-base text-kuralis-900 tracking-tight flex items-center gap-2 font-semibold">
									<FiImage className="text-kuralis-500 w-5 h-5" />
									{img.title}
								</h3>
								<p className="text-sm uppercase text-kuralis-700 bg-kuralis-50 px-3 py-1 rounded shadow-sm tracking-wide font-medium">
									{img.caption}
								</p>
							</div>
						</div>
					))}
				</div>
				{/* 下部グラデーション */}
				<div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
			</section>

			{/* 使い方の流れ（How it works） */}
			<section className="max-w-6xl mx-auto px-4 py-28">
				<h2 className="text-4xl md:text-5xl text-center text-kuralis-900 font-bold tracking-tight mb-8">
					How it works
				</h2>
				<p className="text-center text-kuralis-600 text-base md:text-lg max-w-2xl mx-auto mb-20 leading-relaxed">
					3つのステップで、今日から始められます。
				</p>

				<div className="grid md:grid-cols-3 gap-12">
					{[
						{
							step: 1,
							title: "家具を登録",
							desc: "家具名・設置場所を入力し、写真をアップロード。",
							icon: <FiEdit className="w-6 h-6 text-kuralis-700" />,
						},
						{
							step: 2,
							title: "メンテナンスを設定",
							desc: "掃除やケアの頻度を登録し、自動で予定日を管理。",
							icon: <FiTool className="w-6 h-6 text-kuralis-700" />,
						},
						{
							step: 3,
							title: "次回予定を確認",
							desc: "カレンダーや一覧画面で、次のメンテ日をひと目で把握。",
							icon: <FiCalendar className="w-6 h-6 text-kuralis-700" />,
						},
					].map((item) => (
						<div
							key={item.step}
							className="flex flex-col items-center text-center px-4"
						>
							<div className="w-16 h-16 bg-kuralis-100 rounded-full flex flex-col items-center justify-center mb-6 shadow-sm">
								{item.icon}
								<span className="text-sm text-kuralis-500 mt-1 font-semibold">
									STEP {item.step}
								</span>
							</div>
							<h3 className="text-lg md:text-xl text-kuralis-900 mb-2 tracking-tight font-semibold">
								{item.title}
							</h3>
							<p className="text-sm md:text-base text-kuralis-600 leading-relaxed font-normal">
								{item.desc}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* サブCTA */}
			<section className="relative py-32 text-center overflow-hidden bg-gradient-to-br from-kuralis-50 via-white to-kuralis-100">
				{/* 背景装飾 */}
				<div className="absolute inset-0">
					{/* グラデーション円 */}
					<div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-kuralis-200/30 to-kuralis-300/20 rounded-full blur-3xl animate-pulse"></div>
					<div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-l from-kuralis-100/40 to-kuralis-200/30 rounded-full blur-2xl animate-pulse delay-1000"></div>

					{/* 浮遊する装飾要素 */}
					<div className="absolute top-1/4 left-1/6 w-3 h-3 bg-kuralis-300 rounded-full animate-bounce delay-500"></div>
					<div className="absolute top-3/4 right-1/5 w-2 h-2 bg-kuralis-400 rounded-full animate-bounce delay-1000"></div>
					<div className="absolute top-1/2 right-1/3 w-4 h-4 bg-kuralis-200 rounded-full animate-bounce delay-1500"></div>
				</div>

				{/* メインコンテンツ */}
				<div className="relative z-10 max-w-4xl mx-auto px-4">
					{/* アイコン */}
					<div className="mb-8 inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg border border-kuralis-100">
						<FiHeart className="w-8 h-8 text-kuralis-600" />
					</div>

					{/* メインテキスト */}
					<h2 className="text-3xl md:text-4xl mb-6 tracking-tight font-bold text-kuralis-900 leading-tight">
						大切な家具と、
						<br />
						<span className="bg-gradient-to-r from-kuralis-700 to-kuralis-900 bg-clip-text text-transparent">
							もっと心地よく暮らそう。
						</span>
					</h2>

					{/* サブテキスト */}
					<p className="text-lg md:text-xl text-kuralis-600 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
						家具の記録から日常の手入れまで。
						<br />
						あなたの暮らしをもっと豊かにする、新しい習慣を始めませんか？
					</p>

					{/* CTA ボタン */}
					<Link
						href="/auth/signup"
						className="group inline-flex items-center gap-3 px-8 py-4 text-lg font-medium rounded-full bg-kuralis-900 text-white border-2 border-kuralis-900 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] transition-all duration-300 hover:bg-kuralis-50 hover:text-kuralis-900 hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.15)] hover:-translate-y-0.5"
					>
						無料ではじめる
						<FiArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
					</Link>

					{/* 追加情報 */}
					<div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-kuralis-500">
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 bg-kuralis-400 rounded-full"></div>
							<span>登録無料</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 bg-kuralis-400 rounded-full"></div>
							<span>3分で開始</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 bg-kuralis-400 rounded-full"></div>
							<span>いつでも退会可能</span>
						</div>
					</div>
				</div>

				{/* 下部グラデーション */}
				<div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
			</section>

			{/* フッター */}
			<section className="py-16 text-center bg-kuralis-950 text-kuralis-600">
				<div className="max-w-3xl mx-auto px-4">
					<p className="text-base leading-relaxed">
						kuralis（クラリス）は、大切な家具を長く使い続けるための、シンプルで美しい管理ツールです。
					</p>
				</div>
			</section>
		</main>
	);
}
