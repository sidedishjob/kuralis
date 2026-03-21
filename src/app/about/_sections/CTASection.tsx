import Link from "next/link";
import { FiArrowRight, FiMail } from "react-icons/fi";

const stats = [
  { number: "無料", label: "利用料金" },
  { number: "即座", label: "開始可能" },
];

export function CTASection() {
  return (
    <section className="py-40 bg-linear-to-br from-kuralis-800 to-kuralis-600 relative overflow-hidden">
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
              <FiArrowRight className="size-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 px-10 py-5 border-2 border-white text-white rounded-xl hover:bg-white hover:text-kuralis-900 transition-all duration-300 font-semibold text-lg"
            >
              お問い合わせ
              <FiMail className="size-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto pt-12 border-t border-kuralis-200">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
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
  );
}
