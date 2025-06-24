"use client";

import Image from "next/image";
import { FiImage } from "react-icons/fi";

const images = [
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
];

export default function UIGallerySection() {
	return (
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
				{images.map((img) => (
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
								priority={img.src === "/images/furniture-list.png"}
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
	);
}
