import { FiArrowDown, FiStar } from "react-icons/fi";

export function HeroSection() {
  return (
    <section className="relative isolate min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-4">
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

      <div className="relative space-y-12 pb-30">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-kuralis-100 rounded-full text-kuralis-700 text-sm font-medium animate-fade-in">
          <FiStar className="size-4" />
          家具管理の新しい体験
        </div>
        <h1 className="text-6xl md:text-8xl tracking-tight text-kuralis-900 animate-fade-in font-bold">
          About kuralis
        </h1>
        <p className="text-2xl md:text-3xl text-kuralis-700 tracking-wide max-w-3xl mx-auto leading-relaxed">
          使い手として、
          <span className="text-kuralis-900 font-semibold">家具と暮らす。</span>
          <br />
          <span className="text-lg md:text-xl text-kuralis-600 mt-4 block">
            記録が物語を紡ぐ、新しい家具管理体験
          </span>
        </p>
      </div>

      <div className="absolute bottom-16 animate-bounce">
        <FiArrowDown size={32} className="text-kuralis-600" />
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
  );
}
