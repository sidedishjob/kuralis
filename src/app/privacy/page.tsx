import Link from "next/link";
import { BackToHomeButton } from "@/components/common/layout/BackToHomeButton";

export default function PrivacyPage() {
	return (
		<div className="container mx-auto py-12 px-6 md:px-12">
			<BackToHomeButton />

			<div className="max-w-3xl mx-auto">
				<h1 className="text-3xl font-bold tracking-tighter-custom mb-12">
					プライバシーポリシー
				</h1>

				<div className="prose prose-kuralis max-w-none">
					<section className="mb-12" aria-labelledby="policy-1">
						<h2 id="policy-1" className="text-xl font-bold mb-4">
							1. 個人情報の収集
						</h2>
						<p>
							kuralis（以下「当社」）は、本サービスの提供にあたり、以下の個人情報を収集することがあります：
						</p>
						<ul className="list-disc list-inside space-y-2">
							<li>メールアドレス</li>
							<li>ユーザー名</li>
							<li>家具情報（名称、ブランド、購入日、購入場所、設置場所等）</li>
							<li>メンテナンス情報（実施日、内容等）</li>
							<li>その他当社が定める入力フォームにユーザーが入力する情報</li>
						</ul>
					</section>

					<section className="mb-12" aria-labelledby="policy-2">
						<h2 id="policy-2" className="text-xl font-bold mb-4">
							2. 個人情報の利用目的
						</h2>
						<p>収集した個人情報は、以下の目的で利用します：</p>
						<ul className="list-disc list-inside space-y-2">
							<li>家具管理サービスの提供・運営</li>
							<li>メンテナンスリマインダーの送信</li>
							<li>家具の状態管理と履歴記録</li>
							<li>お問い合わせ対応</li>
							<li>利用規約違反への対応</li>
							<li>本サービスの改善・新機能開発</li>
							<li>統計情報の作成</li>
						</ul>
					</section>

					<section className="mb-12" aria-labelledby="policy-3">
						<h2 id="policy-3" className="text-xl font-bold mb-4">
							3. 個人情報の管理
						</h2>
						<p>
							当社は、ユーザーの個人情報を適切に管理し、以下の場合を除いて第三者に開示しません：
						</p>
						<ul className="list-disc list-inside space-y-2">
							<li>ユーザーの同意がある場合</li>
							<li>法令に基づく場合</li>
							<li>人命や財産保護のために必要な場合</li>
						</ul>
					</section>

					<section className="mb-12" aria-labelledby="policy-4">
						<h2 id="policy-4" className="text-xl font-bold mb-4">
							4. 個人情報の開示・訂正・削除
						</h2>
						<p>
							ご希望に応じて、個人情報の開示・訂正・削除に対応いたします。
							ご請求は当社の問い合わせフォームよりご連絡ください。
						</p>
					</section>

					<section className="mb-12" aria-labelledby="policy-5">
						<h2 id="policy-5" className="text-xl font-bold mb-4">
							5. セキュリティ対策
						</h2>
						<p>以下の対策を講じています：</p>
						<ul className="list-disc list-inside space-y-2">
							<li>アクセス権限の管理</li>
							<li>データの暗号化</li>
						</ul>
					</section>

					<section className="mb-12" aria-labelledby="policy-6">
						<h2 id="policy-6" className="text-xl font-bold mb-4">
							6. アクセス解析ツール
						</h2>
						<p>
							Googleアナリティクス等を利用してアクセス状況を収集しています。収集情報は個人を特定しません。
						</p>
					</section>

					<section className="mb-12" aria-labelledby="policy-7">
						<h2 id="policy-7" className="text-xl font-bold mb-4">
							7. プライバシーポリシーの変更
						</h2>
						<p>
							本ポリシーは予告なく改訂されることがあります。変更後の内容は本サイトへの掲載時点から効力を持ちます。
						</p>
					</section>

					<section className="mb-12" aria-labelledby="policy-8">
						<h2 id="policy-8" className="text-xl font-bold mb-4">
							8. お問い合わせ窓口
						</h2>
						<p>
							当社へのお問い合わせは、以下のフォームよりお願いいたします。
							<br />
							<Link
								href="/contact"
								className="underline text-kuralis-700 dark:text-kuralis-300 hover:text-primary"
							>
								お問い合わせフォーム
							</Link>
						</p>
					</section>
					<p className="text-sm text-gray-500">施行日：2025年7月1日</p>
				</div>
			</div>
		</div>
	);
}
