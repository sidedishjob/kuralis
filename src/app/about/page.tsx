import {
	FiArrowRight,
	FiHeart,
	FiUser,
	FiFeather,
	FiArrowDown,
	FiImage,
	FiStar,
	FiTarget,
	FiTrendingUp,
	FiCheckCircle,
	FiMail,
} from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
	return (
		<main>
			{/* Hero Section */}
			<section className="relative isolate min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-4">
				{/* 上部のぼかし背景 */}
				<div
					aria-hidden="true"
					className="absolute inset-x-0 -top-40 -z-10 overflow-hidden blur-3xl sm:-top-80"
				>
					<div
						style={{
							clipPath:
								"polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
						}}
						className="relative left-1/2 -translate-x-1/2 rotate-[30deg] aspect-video w-[36rem] bg-gradient-to-tr from-kuralis-600 to-kuralis-300 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72rem]"
					/>
				</div>

				<div className="relative space-y-12 pb-30">
					<div className="inline-flex items-center gap-2 px-4 py-2 bg-kuralis-100 rounded-full text-kuralis-700 text-sm font-medium animate-fade-in">
						<FiStar className="w-4 h-4" />
						家具管理の新しい体験
					</div>
					<h1 className="text-6xl md:text-8xl tracking-tight text-kuralis-900 animate-fade-in font-bold">
						About kuralis
					</h1>
					<p className="text-2xl md:text-3xl text-kuralis-700 tracking-wide max-w-3xl mx-auto leading-relaxed">
						使い手として、
						<span className="text-kuralis-900 font-semibold">家具と暮らす。</span>
						<br />
						<span className="text-lg md:text-xl text-kuralis-600 mt-4 block">
							記録が物語を紡ぐ、新しい家具管理体験
						</span>
					</p>
				</div>

				<div className="absolute bottom-16 animate-bounce">
					<FiArrowDown size={32} className="text-kuralis-600" />
				</div>
				{/* 下部のぼかし背景 */}
				<div
					aria-hidden="true"
					className="absolute inset-x-0 bottom-[-8rem] sm:bottom-[-16rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-42rem)]"
				>
					<div
						style={{
							clipPath:
								"polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
						}}
						className="relative left-1/2 -translate-x-1/2 aspect-video w-[36rem] bg-gradient-to-tr from-kuralis-600 to-kuralis-300 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72rem]"
					/>
				</div>
			</section>

			{/* Story Section */}
			<section className="py-40 bg-gradient-to-b from-kuralis-50 to-white relative">
				<div className="max-w-5xl mx-auto px-6 space-y-8">
					<div className="space-y-4">
						<h2 className="text-3xl md:text-5xl font-bold text-kuralis-900 tracking-tight">
							なぜ「kuralis」なのか？
						</h2>
						<div className="w-20 h-1 bg-kuralis-600 rounded-full"></div>
					</div>
					<div className="space-y-6 text-kuralis-700 text-lg leading-relaxed">
						<p>
							家は、暮らしの舞台
							<br className="md:hidden" />
							そして家具は、その演出家
						</p>
						<p>
							私たちは家具を「使い捨て」ではなく、「共に育てる存在」として見ています。
						</p>
						<div className="bg-kuralis-100 p-6 rounded-xl border-l-4 border-kuralis-600">
							<p className="font-semibold text-kuralis-900 text-xl">
								思い出・手入れ・変化。
							</p>
							<p className="text-kuralis-700 mt-2">
								それらを記録することで、家具との暮らしがより豊かに、愛おしくなる。
							</p>
						</div>
						<p>
							そんな体験をすべての人へ届けたいという思いから、このアプリは生まれました。
						</p>
					</div>
				</div>
			</section>

			{/* Concept Section */}
			<section className="py-40 relative">
				<div className="absolute inset-0 bg-gradient-to-r from-kuralis-50 to-white opacity-50"></div>
				<div className="relative z-10 mx-auto max-w-4xl space-y-16 px-6">
					<div className="text-center space-y-8">
						<h2 className="text-3xl md:text-5xl text-kuralis-900 leading-tight font-bold">
							家具との暮らしを
							<br />
							<span className="text-kuralis-600">大切にする人のための</span>
							<br />
							シンプルな記録ツール
						</h2>
						<p className="text-xl text-kuralis-700 max-w-2xl mx-auto leading-relaxed">
							複雑な機能は必要ありません。
							<br />
							大切なのは、あなたと家具との関係を記録し、育てていくこと。
						</p>
					</div>

					{/* Feature Cards */}
					<div className="grid md:grid-cols-3 gap-8">
						{[
							{
								icon: <FiTarget className="w-8 h-8" />,
								title: "シンプル",
								desc: "必要最小限の機能で、直感的に使える",
							},
							{
								icon: <FiHeart className="w-8 h-8" />,
								title: "愛情",
								desc: "家具への思いを形に残せる",
							},
							{
								icon: <FiTrendingUp className="w-8 h-8" />,
								title: "成長",
								desc: "記録が積み重なることで物語が生まれる",
							},
						].map((feature, idx) => (
							<div
								key={idx}
								className="bg-white p-8 rounded-2xl shadow-lg border border-kuralis-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
							>
								<div className="w-16 h-16 bg-kuralis-100 rounded-2xl flex items-center justify-center text-kuralis-600 mb-6">
									{feature.icon}
								</div>
								<h3 className="text-xl font-bold text-kuralis-900 mb-4">
									{feature.title}
								</h3>
								<p className="text-kuralis-700 leading-relaxed">{feature.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Core Values Section */}
			<section className="py-40 bg-gradient-to-b from-white to-kuralis-50 relative">
				<div className="container mx-auto px-6">
					<div className="text-center mb-20">
						<h2 className="text-3xl md:text-5xl font-bold text-kuralis-900 mb-6">
							私たちの価値観
						</h2>
						<p className="text-xl text-kuralis-700 max-w-2xl mx-auto">
							家具との暮らしを豊かにするための3つの柱
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
						{[
							{
								icon: <FiHeart className="w-8 h-8 text-kuralis-600" />,
								title: "育てる記録",
								desc: "メンテナンス履歴や思い出を記録し、家具との関係を育んでいきます。",
								features: ["メンテナンス履歴", "思い出の記録", "成長の可視化"],
							},
							{
								icon: <FiUser className="w-8 h-8 text-kuralis-600" />,
								title: "使い手の体験",
								desc: "使い手の視点から、家具との暮らしをより豊かにします。",
								features: ["直感的な操作", "パーソナライズ", "使い手中心設計"],
							},
							{
								icon: <FiFeather className="w-8 h-8 text-kuralis-600" />,
								title: "感性に訴えるUI",
								desc: "美しく使いやすいインターフェースで、日々の記録を楽しく続けられます。",
								features: ["美しいデザイン", "快適な操作性", "継続しやすさ"],
							},
						].map((item, idx) => (
							<div
								key={idx}
								className="bg-white p-8 rounded-2xl shadow-lg border border-kuralis-100 hover:shadow-xl transition-all duration-300 group"
							>
								<div className="w-16 h-16 rounded-2xl bg-kuralis-100 flex items-center justify-center mx-auto mb-8 group-hover:bg-kuralis-200 transition-colors">
									{item.icon}
								</div>
								<h3 className="text-2xl font-bold text-kuralis-900 text-center mb-6">
									{item.title}
								</h3>
								<p className="text-kuralis-700 text-center leading-relaxed mb-8">
									{item.desc}
								</p>
								<ul className="space-y-3">
									{item.features.map((feature, featureIdx) => (
										<li
											key={featureIdx}
											className="flex items-center gap-3 text-sm text-kuralis-600"
										>
											<FiCheckCircle className="w-4 h-4 text-kuralis-500 flex-shrink-0" />
											{feature}
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* UI ギャラリー */}
			<section className="relative py-32 bg-gradient-to-bl from-kuralis-50 via-white to-kuralis-100">
				<div className="max-w-7xl mx-auto px-6">
					<div className="text-center mb-20">
						<h2 className="text-3xl md:text-5xl tracking-tight font-bold text-kuralis-900 mb-8">
							kuralis in Action
						</h2>
						<p className="text-xl text-kuralis-700 max-w-3xl mx-auto leading-relaxed">
							家具の記録から日々の手入れまで。
							<br />
							その日常のすべてを、シンプルで美しい画面で。
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
						{[
							{
								src: "/images/furniture-list.png",
								alt: "家具一覧画面",
								title: "家具一覧",
								caption: "登録された家具の一覧を確認",
								features: ["写真付き一覧", "検索・フィルター", "簡単アクセス"],
							},
							{
								src: "/images/furniture-detail.png",
								alt: "家具詳細画面",
								title: "家具詳細",
								caption: "選択した家具の詳細情報を閲覧・編集",
								features: ["基本情報", "購入情報", "メンテナンス"],
							},
							{
								src: "/images/furniture-register.png",
								alt: "家具登録",
								title: "家具登録",
								caption: "家具名・設置場所・写真を入力し、家具を登録",
								features: ["簡単登録", "写真アップロード", "場所設定"],
							},
							{
								src: "/images/maintenance-calendar.png",
								alt: "メンテ履歴カレンダー",
								title: "メンテ履歴カレンダー",
								caption: "メンテナンス履歴をカレンダー形式で確認",
								features: ["カレンダー表示", "ボード表示", "履歴管理"],
							},
						].map((img) => (
							<div
								key={img.src}
								className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group hover:-translate-y-2"
							>
								<div className="relative aspect-[16/9] overflow-hidden">
									<Image
										src={img.src}
										alt={img.alt}
										fill
										sizes="(max-width: 768px) 100vw, 50vw"
										className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
									/>
								</div>
								<div className="p-8 space-y-6">
									<div className="flex items-center gap-3">
										<FiImage className="text-kuralis-500 w-6 h-6" />
										<h3 className="text-xl font-bold text-kuralis-900">
											{img.title}
										</h3>
									</div>
									<p className="text-kuralis-700 bg-kuralis-50 px-4 py-3 rounded-xl text-sm font-medium">
										{img.caption}
									</p>
									<ul className="space-y-2">
										{img.features.map((feature, featureIdx) => (
											<li
												key={featureIdx}
												className="flex items-center gap-2 text-sm text-kuralis-600"
											>
												<FiCheckCircle className="w-4 h-4 text-kuralis-500 flex-shrink-0" />
												{feature}
											</li>
										))}
									</ul>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Developer Section */}
			<section className="py-40 bg-gradient-to-b from-kuralis-50 to-white">
				<div className="max-w-4xl mx-auto px-6">
					<div className="text-center space-y-12">
						<div className="space-y-6">
							<h2 className="text-3xl md:text-5xl font-bold text-kuralis-900">
								開発者について
							</h2>
							<div className="w-20 h-1 bg-kuralis-600 rounded-full mx-auto"></div>
						</div>

						<div className="bg-white p-12 rounded-2xl shadow-xl border border-kuralis-100">
							<div className="grid md:grid-cols-2 gap-12 items-center">
								<div className="space-y-6">
									<p className="text-lg text-kuralis-700 leading-relaxed">
										インテリアを愛する一人の開発者が、
										<br />
										家具との暮らしをもっと楽しめるようにと開発しました。
									</p>
									<div className="bg-kuralis-100 p-6 rounded-xl">
										<p className="text-lg font-semibold text-kuralis-900">
											「日々の記録が、やがて物語になる」
										</p>
										<p className="text-kuralis-700 mt-2">
											そんなツールを目指しています。
										</p>
									</div>
								</div>
								<div className="bg-gradient-to-br from-kuralis-100 to-kuralis-300 p-8 rounded-2xl text-center">
									<div className="text-6xl mb-4">🏠</div>
									<div className="text-2xl font-bold text-kuralis-900 mb-2">
										家具愛好家
									</div>
									<div className="text-kuralis-700 text-sm md:text-base">
										インテリア × テクノロジー
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="py-40 bg-gradient-to-br from-kuralis-800 to-kuralis-600 relative overflow-hidden">
				<div className="relative z-10 container mx-auto px-6 text-center">
					<div className="max-w-3xl mx-auto space-y-12">
						<div className="space-y-6">
							<h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
								家具を育て始める
							</h2>
							<p className="text-xl text-kuralis-200 leading-relaxed">
								今日から、あなたの家具との物語を始めませんか？
								<br />
								記録が積み重なることで、新しい発見があります。
							</p>
						</div>

						<div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
							<Link
								href="/auth/signup"
								className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-kuralis-900 rounded-xl hover:bg-kuralis-50 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:-translate-y-1 font-semibold text-lg"
							>
								Start Collection
								<FiArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
							</Link>
							<Link
								href="/contact"
								className="group inline-flex items-center gap-3 px-10 py-5 border-2 border-white text-white rounded-xl hover:bg-white hover:text-kuralis-900 transition-all duration-300 font-semibold text-lg"
							>
								お問い合わせ
								<FiMail className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
							</Link>
						</div>

						<div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto pt-12 border-t border-kuralis-200">
							{[
								{ number: "無料", label: "利用料金" },
								{ number: "即座", label: "開始可能" },
							].map((stat, idx) => (
								<div key={idx} className="text-center">
									<div className="text-2xl font-bold text-white">
										{stat.number}
									</div>
									<div className="text-sm text-kuralis-300">{stat.label}</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
