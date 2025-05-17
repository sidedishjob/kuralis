import BackToHomeButton from "@/components/BackToHomeButton";

export default function PrivacyPage() {
	return (
		<div className="container mx-auto py-12 px-6 md:px-12">
			<BackToHomeButton />

			<div className="max-w-3xl mx-auto">
				<h1 className="text-3xl font-bold tracking-tighter-custom mb-12">
					プライバシーポリシー
				</h1>

				<div className="prose prose-kuralis max-w-none">
					<section className="mb-12">
						<h2 className="text-xl font-bold tracking-tighter-custom mb-4">
							1. 個人情報の収集
						</h2>
						<p className="text-kuralis-600 leading-relaxed mb-4">
							当社は、本サービスの提供にあたり、以下の個人情報を収集することがあります：
						</p>
						<ul className="list-disc list-inside space-y-2 text-kuralis-600">
							<li>メールアドレス</li>
							<li>ユーザーが本サービスを通じて提供する情報</li>
							<li>その他当社が定める入力フォームにユーザーが入力する情報</li>
						</ul>
					</section>

					<section className="mb-12">
						<h2 className="text-xl font-bold tracking-tighter-custom mb-4">
							2. 個人情報の利用目的
						</h2>
						<p className="text-kuralis-600 leading-relaxed mb-4">
							収集した個人情報は、以下の目的で利用します：
						</p>
						<ul className="list-disc list-inside space-y-2 text-kuralis-600">
							<li>本サービスの提供・運営のため</li>
							<li>ユーザーからのお問い合わせに対応するため</li>
							<li>利用規約に違反する行為に対応するため</li>
							<li>本サービスの改善および新機能の開発のため</li>
						</ul>
					</section>

					<section className="mb-12">
						<h2 className="text-xl font-bold tracking-tighter-custom mb-4">
							3. 個人情報の管理
						</h2>
						<p className="text-kuralis-600 leading-relaxed">
							当社は、ユーザーの個人情報を適切に管理し、以下に掲げる場合を除いて、個人情報を第三者に開示することはありません。
						</p>
						<ul className="list-disc list-inside space-y-2 text-kuralis-600 mt-4">
							<li>ユーザーの同意がある場合</li>
							<li>法令に基づき開示することが必要である場合</li>
							<li>人の生命、身体または財産の保護のために必要がある場合</li>
						</ul>
					</section>

					<section className="mb-12">
						<h2 className="text-xl font-bold tracking-tighter-custom mb-4">
							4. 個人情報の開示・訂正・削除
						</h2>
						<p className="text-kuralis-600 leading-relaxed">
							ユーザーから個人情報の開示・訂正・削除を求められた場合、当社は速やかに対応いたします。
							ただし、法令等により開示できない場合もございます。
						</p>
					</section>

					<section className="mb-12">
						<h2 className="text-xl font-bold tracking-tighter-custom mb-4">
							5. プライバシーポリシーの変更
						</h2>
						<p className="text-kuralis-600 leading-relaxed">
							本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく、変更することができるものとします。
							変更後のプライバシーポリシーは、本ウェブサイトに掲載したときから効力を生じるものとします。
						</p>
					</section>
				</div>
			</div>
		</div>
	);
}
