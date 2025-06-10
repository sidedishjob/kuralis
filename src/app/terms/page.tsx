import { BackToHomeButton } from "@/components/common/layout/BackToHomeButton";

export default function TermsPage() {
	return (
		<div className="container mx-auto py-12 px-6 md:px-12">
			<BackToHomeButton />

			<div className="max-w-3xl mx-auto">
				<h1 className="text-3xl font-bold tracking-tighter-custom mb-12">利用規約</h1>

				<div className="prose prose-kuralis max-w-none">
					<section className="mb-12">
						<h2 className="text-xl font-bold tracking-tighter-custom mb-4">
							第1条（適用）
						</h2>
						<p className="text-kuralis-600 leading-relaxed mb-4">
							本利用規約（以下「本規約」といいます。）は、kuralis（以下「本サービス」といいます。）の利用に関する条件を定めるものです。
							登録ユーザーの皆様には、本規約に従って本サービスをご利用いただきます。
						</p>
					</section>

					<section className="mb-12">
						<h2 className="text-xl font-bold tracking-tighter-custom mb-4">
							第2条（定義）
						</h2>
						<p className="text-kuralis-600 leading-relaxed mb-4">
							本規約において使用する用語の定義は、次の各号に定めるとおりとします。
						</p>
						<ol className="list-decimal list-inside space-y-2 text-kuralis-600">
							<li>
								「本サービス」とは、kuralisが提供する家具管理サービスを意味します。
							</li>
							<li>「ユーザー」とは、本サービスを利用する全ての方を意味します。</li>
							<li>
								「登録ユーザー」とは、第3条に基づき本サービスの利用者としての登録がなされた方を意味します。
							</li>
							<li>
								「コンテンツ」とは、ユーザーが本サービスを通じて投稿、送信、アップロードする文章、画像、その他の情報を意味します。
							</li>
						</ol>
					</section>

					<section className="mb-12">
						<h2 className="text-xl font-bold tracking-tighter-custom mb-4">
							第3条（登録）
						</h2>
						<p className="text-kuralis-600 leading-relaxed mb-4">
							本サービスの利用を希望する方は、本規約に同意の上、当社の定める方法によって利用登録を申請し、
							当社がこれを承認することによって、本サービスの利用登録が完了するものとします。
						</p>
						<p className="text-kuralis-600 leading-relaxed">
							当社は、以下の事由に該当する場合、利用登録を拒否することがあります：
						</p>
						<ul className="list-disc list-inside space-y-2 text-kuralis-600 mt-4">
							<li>本規約に違反したことがある者からの申請である場合</li>
							<li>その他、当社が利用登録を相当でないと判断した場合</li>
						</ul>
					</section>

					<section className="mb-12">
						<h2 className="text-xl font-bold tracking-tighter-custom mb-4">
							第4条（禁止事項）
						</h2>
						<p className="text-kuralis-600 leading-relaxed mb-4">
							ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。
						</p>
						<ul className="list-disc list-inside space-y-2 text-kuralis-600">
							<li>法令または公序良俗に違反する行為</li>
							<li>犯罪行為に関連する行為</li>
							<li>
								当社のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為
							</li>
							<li>本サービスの運営を妨害するおそれのある行為</li>
							<li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
							<li>他のユーザーに成りすます行為</li>
							<li>
								当社のサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為
							</li>
							<li>虚偽の情報を登録する行為</li>
							<li>本サービスの他のユーザーに迷惑をかける行為</li>
							<li>
								本サービスに関連して、他のユーザーまたは第三者に損害を発生させる行為
							</li>
							<li>その他、当社が不適切と判断する行為</li>
						</ul>
					</section>

					<section className="mb-12">
						<h2 className="text-xl font-bold tracking-tighter-custom mb-4">
							第5条（本サービスの提供の停止等）
						</h2>
						<p className="text-kuralis-600 leading-relaxed mb-4">
							当社は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく
							本サービスの全部または一部の提供を停止または中断することができるものとします。
						</p>
						<ul className="list-disc list-inside space-y-2 text-kuralis-600">
							<li>
								本サービスにかかるコンピュータシステムの保守点検または更新を行う場合
							</li>
							<li>
								地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合
							</li>
							<li>コンピュータまたは通信回線等が事故により停止した場合</li>
							<li>その他、当社が本サービスの提供が困難と判断した場合</li>
						</ul>
					</section>

					<section className="mb-12">
						<h2 className="text-xl font-bold tracking-tighter-custom mb-4">
							第6条（免責事項）
						</h2>
						<p className="text-kuralis-600 leading-relaxed mb-4">
							当社は、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において
							生じた取引、連絡または紛争等について一切責任を負いません。
						</p>
						<p className="text-kuralis-600 leading-relaxed">
							当社は、本サービスに起因してユーザーに生じたあらゆる損害について、一切の責任を負いません。
							ただし、本サービスに関する当社とユーザーとの間の契約（本規約を含みます。）が
							消費者契約法に定める消費者契約となる場合、この免責規定は適用されません。
						</p>
					</section>

					<section className="mb-12">
						<h2 className="text-xl font-bold tracking-tighter-custom mb-4">
							第7条（サービス内容の変更等）
						</h2>
						<p className="text-kuralis-600 leading-relaxed">
							当社は、ユーザーに通知することなく、本サービスの内容を変更しまたは本サービスの提供を中止することができるものとし、
							これによってユーザーに生じた損害について一切の責任を負いません。
						</p>
					</section>

					<section className="mb-12">
						<h2 className="text-xl font-bold tracking-tighter-custom mb-4">
							第8条（利用規約の変更）
						</h2>
						<p className="text-kuralis-600 leading-relaxed">
							当社は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。
							なお、本規約の変更に関しては、本サービス上に掲載したときから効力を生じるものとします。
						</p>
					</section>

					<section className="mb-12">
						<h2 className="text-xl font-bold tracking-tighter-custom mb-4">
							第9条（通知または連絡）
						</h2>
						<p className="text-kuralis-600 leading-relaxed">
							ユーザーと当社との間の通知または連絡は、当社の定める方法によって行うものとします。
							当社は、ユーザーから、当社が別途定める方法に従った変更届け出がない限り、
							現在登録されている連絡先が有効なものとみなして当該連絡先へ通知または連絡を行い、
							これらは、発信時にユーザーへ到達したものとみなします。
						</p>
					</section>

					<section className="mb-12">
						<h2 className="text-xl font-bold tracking-tighter-custom mb-4">
							第10条（権利義務の譲渡の禁止）
						</h2>
						<p className="text-kuralis-600 leading-relaxed">
							ユーザーは、当社の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を
							第三者に譲渡し、または担保に供することはできません。
						</p>
					</section>

					<section className="mb-12">
						<h2 className="text-xl font-bold tracking-tighter-custom mb-4">
							第11条（準拠法・裁判管轄）
						</h2>
						<p className="text-kuralis-600 leading-relaxed mb-4">
							本規約の解釈にあたっては、日本法を準拠法とします。
						</p>
						<p className="text-kuralis-600 leading-relaxed">
							本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。
						</p>
					</section>
				</div>
			</div>
		</div>
	);
}
