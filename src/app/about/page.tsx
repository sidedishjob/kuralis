import { FiArrowRight, FiHeart, FiUser, FiFeather, FiArrowDown } from "react-icons/fi";
import Link from "next/link";

export default function AboutPage() {
	return (
		<main>
			{/* Hero Section */}
			<section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
				<div className="space-y-8">
					<h1 className="text-5xl md:text-6xl tracking-tight text-kuralis-900 animate-fade-in">
						About kuralis
					</h1>
					<p className="text-xl md:text-2xl text-kuralis-700 tracking-wide max-w-2xl mx-auto">
						使い手として、
						<span className="text-kuralis-900">家具と暮らす。</span>
					</p>
				</div>
				<div className="absolute bottom-16 animate-bounce">
					<FiArrowDown size={24} className="text-kuralis-600" />
				</div>
			</section>

			{/* Concept Section */}
			<section className="py-40">
				<div className="mx-auto max-w-3xl space-y-20 px-6">
					<p className="text-lg md:text-3xl text-kuralis-800 leading-relaxed text-center">
						家具との暮らしを大切にする人のための
						<br />
						シンプルな記録ツール。
					</p>
				</div>
			</section>

			{/* Core Values Section */}
			<section className="py-40 border-t border-kuralis-100">
				<div className="container mx-auto px-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-20 max-w-5xl mx-auto">
						{[
							{
								icon: <FiHeart className="w-6 h-6 text-kuralis-600" />,
								title: "育てる記録",
								desc: "メンテナンス履歴や思い出を記録し、\n家具との関係を育んでいきます。",
							},
							{
								icon: <FiUser className="w-6 h-6 text-kuralis-600" />,
								title: "使い手の体験",
								desc: "使い手の視点から、\n家具との暮らしをより豊かにします。",
							},
							{
								icon: <FiFeather className="w-6 h-6 text-kuralis-600" />,
								title: "感性に訴えるUI",
								desc: "美しく使いやすいインターフェースで、\n日々の記録を楽しく続けられます。",
							},
						].map((item, idx) => (
							<div key={idx} className="space-y-8">
								<div className="w-12 h-12 rounded-full bg-kuralis-100 flex items-center justify-center mx-auto">
									{item.icon}
								</div>
								<h3 className="text-lg tracking-tighter-custom text-center">
									{item.title}
								</h3>
								<p className="text-sm text-kuralis-600 text-center leading-relaxed whitespace-pre-line">
									{item.desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="py-40 border-t border-kuralis-100">
				<div className="container mx-auto px-6 text-center">
					<p className="text-xl text-kuralis-600 tracking-tighter-custom mb-12">
						家具を育て始める
					</p>
					<Link
						href="/furniture"
						className="group inline-flex items-center gap-2 px-8 py-4 bg-kuralis-900 border-2 border-kuralis-900 text-white rounded-lg hover:bg-kuralis-50 hover:text-kuralis-900 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
					>
						Start Collection
						<FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
					</Link>
				</div>
			</section>
		</main>
	);
}
