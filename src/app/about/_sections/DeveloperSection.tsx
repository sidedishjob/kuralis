export function DeveloperSection() {
  return (
    <section className="py-40 bg-linear-to-b from-kuralis-50 to-white">
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
              <div className="bg-linear-to-br from-kuralis-100 to-kuralis-300 p-8 rounded-2xl text-center">
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
  );
}
