import { FiHeart, FiTarget, FiTrendingUp } from "react-icons/fi";

const features = [
  {
    icon: <FiTarget className="size-8" />,
    title: "シンプル",
    desc: "必要最小限の機能で、直感的に使える",
  },
  {
    icon: <FiHeart className="size-8" />,
    title: "愛情",
    desc: "家具への思いを形に残せる",
  },
  {
    icon: <FiTrendingUp className="size-8" />,
    title: "成長",
    desc: "記録が積み重なることで物語が生まれる",
  },
];

export function ConceptSection() {
  return (
    <section className="py-40 relative">
      <div className="absolute inset-0 bg-linear-to-r from-kuralis-50 to-white opacity-50"></div>
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

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white p-8 rounded-2xl shadow-lg border border-kuralis-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="size-16 bg-kuralis-100 rounded-2xl flex items-center justify-center text-kuralis-600 mb-6">
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
  );
}
