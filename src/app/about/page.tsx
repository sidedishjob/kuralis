// app/about/page.tsx

import { FiArrowRight, FiHeart, FiUser, FiFeather, FiArrowDown } from "react-icons/fi";
import Link from "next/link";

export default function AboutPage() {
	return (
		<>
			{/* Hero Section */}
			<section className="flex flex-col items-center justify-center min-h-[90vh] text-center relative">
				<div className="space-y-8">
					<h1 className="text-5xl md:text-6xl font-bold tracking-tighter-custom">
						About kuralis
					</h1>
					<p className="text-xl text-kuralis-600 tracking-tighter-custom">
						使い手として、家具と暮らす。
					</p>
				</div>
				<div className="absolute bottom-16">
					<FiArrowDown size={24} className="text-kuralis-400 animate-bounce" />
				</div>
			</section>

			{/* Concept Section */}
			<section className="py-40 border-t border-kuralis-100">
				<div className="mx-auto max-w-2xl space-y-20 px-6">
					<p className="text-xl md:text-2xl text-kuralis-600 leading-relaxed text-center">
						家具との暮らしを大切にする人のための
						<br />
						シンプルな記録ツール。
					</p>
					<ul className="space-y-8 text-kuralis-600">
						{[
							"家具との思い出を記録し、大切な関係を育んでいく",
							"適切なタイミングでのメンテナンスをサポート",
							"家具との暮らしをより豊かなものに",
						].map((text, idx) => (
							<li key={idx} className="flex items-center space-x-6">
								<span className="w-2 h-2 bg-kuralis-400 rounded-full" />
								<span>{text}</span>
							</li>
						))}
					</ul>
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
								<h3 className="text-lg font-bold tracking-tighter-custom text-center">
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

			{/* Call to Action Section */}
			<section className="py-40 border-t border-kuralis-100">
				<div className="container mx-auto px-6 text-center">
					<p className="text-xl text-kuralis-600 tracking-tighter-custom mb-12">
						β版で家具を育て始める
					</p>
					<Link
						href="/furniture"
						className="inline-flex items-center px-8 py-3 ring-1 ring-kuralis-900 text-kuralis-900 hover:bg-kuralis-900 hover:text-white transition-all duration-300 font-bold tracking-tighter-custom"
					>
						Start Collection
						<FiArrowRight className="ml-2" />
					</Link>
				</div>
			</section>
		</>
	);
}
