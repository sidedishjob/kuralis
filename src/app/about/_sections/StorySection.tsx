export function StorySection() {
  return (
    <section className="py-40 bg-linear-to-b from-kuralis-50 to-white relative">
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
  );
}
