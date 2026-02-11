import { redirect } from "next/navigation";
import {
  FiArrowRight,
  FiHeart,
  FiClock,
  FiBookOpen,
  FiEdit,
  FiTool,
  FiCalendar,
} from "react-icons/fi";

import { createServerSupabase } from "@/lib/supabase/server";
import TrackedLink from "@/components/common/navigation/TrackedLink";
import UIGallerySection from "@/components/common/sections/UIGallerySection";

// Value Props セクションの内容
const valueProps = [
  {
    icon: <FiHeart className="size-6 text-kuralis-700" />,
    title: "家具を記録する",
    desc: "お気に入りの家具や写真、設置場所をシンプルに管理できます。",
  },
  {
    icon: <FiClock className="size-6 text-kuralis-700" />,
    title: "メンテナンスを可視化",
    desc: "家具ごとにメンテナンス履歴や実施予定を記録し、いつでも見返せます。",
  },
  {
    icon: <FiBookOpen className="size-6 text-kuralis-700" />,
    title: "思い出とストーリー",
    desc: "家具にまつわる思い出や家族のストーリーも、そっと残せます。",
  },
];

// How it works セクションの内容
const howItWorksSteps = [
  {
    step: 1,
    title: "家具を登録",
    desc: "家具名・設置場所を入力し、写真をアップロード。",
    icon: <FiEdit className="size-6 text-kuralis-700" />,
  },
  {
    step: 2,
    title: "メンテナンスを設定",
    desc: "掃除やケアの頻度を登録し、自動で予定日を管理。",
    icon: <FiTool className="size-6 text-kuralis-700" />,
  },
  {
    step: 3,
    title: "次回予定を確認",
    desc: "カレンダーや一覧画面で、次のメンテ日をひと目で把握。",
    icon: <FiCalendar className="size-6 text-kuralis-700" />,
  },
];

export default async function Page() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/furniture");
  }

  return (
    <main>
      {/* ヒーローセクション */}
      <section className="relative isolate min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center text-center bg-white dark:bg-black">
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
            className="relative left-1/2 -translate-x-1/2 rotate-30 aspect-video w-xl bg-linear-to-tr from-kuralis-600 to-kuralis-300 opacity-30 sm:left-[calc(50%-30rem)] sm:w-6xl"
          />
        </div>

        {/* 中央コンテンツ */}
        <h1 className="text-6xl md:text-8xl tracking-tight mb-10 text-kuralis-900 font-bold">
          kuralis
        </h1>
        <p className="text-2xl md:text-3xl text-kuralis-700 tracking-wide mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
          使い手として、<span className="text-kuralis-900">家具と暮らす。</span>
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-5">
          <TrackedLink
            href="/auth/signup"
            label="Start Collection"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-kuralis-900 border-2 border-kuralis-900 text-white text-lg font-medium rounded-lg hover:bg-kuralis-50 hover:text-kuralis-900 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Start Collection
            <FiArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
          </TrackedLink>
          <TrackedLink
            href="/auth/login"
            label="Login"
            className="px-8 py-4 text-kuralis-900 text-lg font-medium bg-white border-2 border-kuralis-900 rounded-lg hover:bg-kuralis-300 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Login
          </TrackedLink>
        </div>

        {/* 下部のぼかし背景 */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-32 sm:-bottom-64 -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-42rem)]"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-1/2 -translate-x-1/2 aspect-video w-xl bg-linear-to-tr from-kuralis-600 to-kuralis-300 opacity-30 sm:left-[calc(50%+36rem)] sm:w-6xl"
          />
        </div>
      </section>

      {/* Value Props */}
      <section className="max-w-6xl mx-auto px-4 py-32 grid md:grid-cols-3 gap-12">
        {valueProps.map((item, index) => (
          <div
            key={index}
            className="group p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="size-12 bg-kuralis-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-kuralis-200 transition-colors">
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
      <UIGallerySection />

      {/* 使い方の流れ（How it works） */}
      <section className="max-w-6xl mx-auto px-4 py-28">
        <h2 className="text-4xl md:text-5xl text-center text-kuralis-900 font-bold tracking-tight mb-8">
          How it works
        </h2>
        <p className="text-center text-kuralis-600 text-base md:text-lg max-w-2xl mx-auto mb-20 leading-relaxed">
          3つのステップで、今日から始められます。
        </p>

        <div className="grid md:grid-cols-3 gap-12">
          {howItWorksSteps.map((item) => (
            <div
              key={item.step}
              className="flex flex-col items-center text-center px-4"
            >
              <div className="size-16 bg-kuralis-100 rounded-full flex flex-col items-center justify-center mb-6 shadow-sm">
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
      <section className="relative py-32 text-center overflow-hidden bg-linear-to-br from-kuralis-50 via-white to-kuralis-100">
        {/* 背景装飾 */}
        <div className="absolute inset-0">
          {/* グラデーション円 */}
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 size-96 bg-linear-to-r from-kuralis-200/30 to-kuralis-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 size-80 bg-linear-to-l from-kuralis-100/40 to-kuralis-200/30 rounded-full blur-2xl animate-pulse delay-1000"></div>

          {/* 浮遊する装飾要素 */}
          <div className="absolute top-1/4 left-1/6 size-3 bg-kuralis-300 rounded-full animate-bounce delay-500"></div>
          <div className="absolute top-3/4 right-1/5 size-2 bg-kuralis-400 rounded-full animate-bounce delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 size-4 bg-kuralis-200 rounded-full animate-bounce delay-1500"></div>
        </div>

        {/* メインコンテンツ */}
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          {/* アイコン */}
          <div className="mb-8 inline-flex items-center justify-center size-20 bg-white rounded-full shadow-lg border border-kuralis-100">
            <FiHeart className="size-8 text-kuralis-600" />
          </div>

          {/* メインテキスト */}
          <h2 className="text-3xl md:text-4xl mb-6 tracking-tight font-bold text-kuralis-900 leading-tight">
            大切な家具と、
            <br />
            <span className="bg-linear-to-r from-kuralis-700 to-kuralis-900 bg-clip-text text-transparent">
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
          <TrackedLink
            href="/auth/signup"
            label="無料ではじめる"
            className="group inline-flex items-center gap-3 px-8 py-4 text-lg font-medium rounded-full bg-kuralis-900 text-white border-2 border-kuralis-900 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] transition-all duration-300 hover:bg-kuralis-50 hover:text-kuralis-900 hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.15)] hover:-translate-y-0.5"
          >
            無料ではじめる
            <FiArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </TrackedLink>

          {/* 追加情報 */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-kuralis-500">
            <div className="flex items-center gap-2">
              <div className="size-2 bg-kuralis-400 rounded-full"></div>
              <span>登録無料</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 bg-kuralis-400 rounded-full"></div>
              <span>3分で開始</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 bg-kuralis-400 rounded-full"></div>
              <span>いつでも退会可能</span>
            </div>
          </div>
        </div>

        {/* 下部グラデーション */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-linear-to-t from-white to-transparent pointer-events-none"></div>
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
