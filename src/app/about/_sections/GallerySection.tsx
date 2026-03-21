import Image from "next/image";
import { FiCheckCircle, FiImage } from "react-icons/fi";

const galleryItems = [
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
];

export function GallerySection() {
  return (
    <section className="relative py-32 bg-linear-to-bl from-kuralis-50 via-white to-kuralis-100">
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
          {galleryItems.map((img) => (
            <div
              key={img.src}
              className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group hover:-translate-y-2"
            >
              <div className="relative aspect-video overflow-hidden">
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
                  <FiImage className="text-kuralis-500 size-6" />
                  <h3 className="text-xl font-bold text-kuralis-900">
                    {img.title}
                  </h3>
                </div>
                <p className="text-kuralis-700 bg-kuralis-50 px-4 py-3 rounded-xl text-sm font-medium">
                  {img.caption}
                </p>
                <ul className="space-y-2">
                  {img.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-kuralis-600"
                    >
                      <FiCheckCircle className="size-4 text-kuralis-500 shrink-0" />
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
  );
}
