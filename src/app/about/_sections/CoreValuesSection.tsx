import { FiCheckCircle, FiFeather, FiHeart, FiUser } from "react-icons/fi";

const values = [
  {
    icon: <FiHeart className="size-8 text-kuralis-600" />,
    title: "育てる記録",
    desc: "メンテナンス履歴や思い出を記録し、家具との関係を育んでいきます。",
    features: ["メンテナンス履歴", "思い出の記録", "成長の可視化"],
  },
  {
    icon: <FiUser className="size-8 text-kuralis-600" />,
    title: "使い手の体験",
    desc: "使い手の視点から、家具との暮らしをより豊かにします。",
    features: ["直感的な操作", "パーソナライズ", "使い手中心設計"],
  },
  {
    icon: <FiFeather className="size-8 text-kuralis-600" />,
    title: "感性に訴えるUI",
    desc: "美しく使いやすいインターフェースで、日々の記録を楽しく続けられます。",
    features: ["美しいデザイン", "快適な操作性", "継続しやすさ"],
  },
];

export function CoreValuesSection() {
  return (
    <section className="py-40 bg-linear-to-b from-white to-kuralis-50 relative">
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
          {values.map((item) => (
            <div
              key={item.title}
              className="bg-white p-8 rounded-2xl shadow-lg border border-kuralis-100 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="size-16 rounded-2xl bg-kuralis-100 flex items-center justify-center mx-auto mb-8 group-hover:bg-kuralis-200 transition-colors">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-kuralis-900 text-center mb-6">
                {item.title}
              </h3>
              <p className="text-kuralis-700 text-center leading-relaxed mb-8">
                {item.desc}
              </p>
              <ul className="space-y-3">
                {item.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-kuralis-600"
                  >
                    <FiCheckCircle className="size-4 text-kuralis-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
