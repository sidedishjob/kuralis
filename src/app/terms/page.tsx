import { BackToHomeButton } from "@/components/common/layout/BackToHomeButton";

export default function TermsPage() {
	return (
		<div className="container mx-auto py-12 px-6 md:px-12">
			<BackToHomeButton />

			<div className="max-w-3xl mx-auto">
				<h1 className="text-3xl font-bold tracking-tighter-custom mb-12">利用規約</h1>

				<div className="prose prose-kuralis max-w-none">
					<section className="mb-12" aria-labelledby="terms-1">
						<h2 id="terms-1" className="text-xl font-bold mb-4">
							第1条（適用）
						</h2>
						<p>
							本規約は、kuralis（以下「本サービス」）の利用に関する条件を定めるものです。
							登録ユーザーは本規約に同意したうえで、本サービスを利用するものとします。
						</p>
					</section>

					<section className="mb-12" aria-labelledby="terms-2">
						<h2 id="terms-2" className="text-xl font-bold mb-4">
							第2条（定義）
						</h2>
						<ol className="list-decimal list-inside space-y-2">
							<li>「本サービス」：当社が提供する家具管理サービス</li>
							<li>「ユーザー」：本サービスを利用するすべての方</li>
							<li>「登録ユーザー」：所定の方法で登録を完了した方</li>
							<li>「コンテンツ」：投稿・送信・アップロードされた情報</li>
						</ol>
					</section>

					<section className="mb-12" aria-labelledby="terms-3">
						<h2 id="terms-3" className="text-xl font-bold mb-4">
							第3条（登録）
						</h2>
						<p>登録は、当社の承認をもって完了します。</p>
						<p>以下の場合、登録を拒否することがあります：</p>
						<ul className="list-disc list-inside space-y-2 mt-2">
							<li>過去に規約違反がある場合</li>
							<li>その他不適当と当社が判断する場合</li>
						</ul>
					</section>

					<section className="mb-12" aria-labelledby="terms-4">
						<h2 id="terms-4" className="text-xl font-bold mb-4">
							第4条（禁止事項）
						</h2>
						<ul className="list-disc list-inside space-y-2">
							<li>法令または公序良俗に違反する行為</li>
							<li>サーバーやネットワークへの妨害行為</li>
							<li>虚偽情報の登録</li>
							<li>他ユーザーへのなりすまし</li>
							<li>迷惑行為・損害を与える行為</li>
							<li>その他、当社が不適切と判断する行為</li>
						</ul>
					</section>

					<section className="mb-12" aria-labelledby="terms-5">
						<h2 id="terms-5" className="text-xl font-bold mb-4">
							第5条（提供の停止）
						</h2>
						<p>以下の場合、事前通知なしにサービスを停止することがあります：</p>
						<ul className="list-disc list-inside space-y-2">
							<li>システムの保守</li>
							<li>天災などの不可抗力</li>
							<li>通信回線の障害</li>
						</ul>
					</section>

					<section className="mb-12" aria-labelledby="terms-6">
						<h2 id="terms-6" className="text-xl font-bold mb-4">
							第6条（免責事項）
						</h2>
						<p>
							ユーザー間、または第三者とのトラブルに当社は一切責任を負いません。
							ただし、消費者契約法が適用される場合を除きます。
						</p>
					</section>

					<section className="mb-12" aria-labelledby="terms-7">
						<h2 id="terms-7" className="text-xl font-bold mb-4">
							第7条（変更・終了）
						</h2>
						<p>サービス内容は予告なく変更または終了されることがあります。</p>
					</section>

					<section className="mb-12" aria-labelledby="terms-8">
						<h2 id="terms-8" className="text-xl font-bold mb-4">
							第8条（規約の変更）
						</h2>
						<p>
							当社は本規約を予告なく変更できます。変更後の内容はサイト掲載時点から有効です。
						</p>
					</section>

					<section className="mb-12" aria-labelledby="terms-9">
						<h2 id="terms-9" className="text-xl font-bold mb-4">
							第9条（通知方法）
						</h2>
						<p>
							当社からの通知は登録された連絡先に送信し、発信時に到達したものとみなします。
						</p>
					</section>

					<section className="mb-12" aria-labelledby="terms-10">
						<h2 id="terms-10" className="text-xl font-bold mb-4">
							第10条（権利義務の譲渡禁止）
						</h2>
						<p>
							ユーザーは、当社の承諾なく権利義務を第三者に譲渡・担保提供できません。
						</p>
					</section>

					<section className="mb-12" aria-labelledby="terms-11">
						<h2 id="terms-11" className="text-xl font-bold mb-4">
							第11条（退会）
						</h2>
						<p>ユーザーは、当社所定の手続きによりいつでも退会できます。</p>
					</section>

					<section className="mb-12" aria-labelledby="terms-12">
						<h2 id="terms-12" className="text-xl font-bold mb-4">
							第12条（準拠法・裁判管轄）
						</h2>
						<p>本規約は日本法に準拠します。</p>
						<p>
							紛争が生じた場合、当社所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。
						</p>
					</section>
					<p className="text-sm text-gray-500">施行日：2025年6月10日</p>
				</div>
			</div>
		</div>
	);
}
