import Link from "next/link";

export default function ContactThanksPage() {
  return (
    <div className="container mx-auto py-20 px-6 text-center">
      <h1 className="text-3xl font-bold mb-6">
        お問い合わせありがとうございました
      </h1>
      <p className="text-lg text-kuralis-600 mb-8">
        ご入力いただいた内容を受け付けました。内容を確認の上、担当よりご連絡させていただきます。
      </p>
      <Link
        href="/"
        className="inline-block bg-kuralis-500 text-white px-6 py-3 rounded-md hover:bg-kuralis-600 transition"
      >
        ホームへ戻る
      </Link>
    </div>
  );
}
