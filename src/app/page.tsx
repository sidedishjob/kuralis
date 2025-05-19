"use client";

import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FiArrowRight, FiArrowDown, FiHeart } from "react-icons/fi";
import { getUserFromCookie } from "@/lib/supabase";

export default async function Page() {
	const user = await getUserFromCookie();
	if (user) {
		redirect("/furniture");
	}
	return (
		<>
			<section className="min-h-[90vh] flex items-center relative">
				<div className="container mx-auto px-6 md:px-12">
					<div className="max-w-2xl mx-auto text-center space-y-10">
						<h1 className="text-5xl md:text-6xl font-bold tracking-tighter-custom">
							kuralis
						</h1>

						<p className="text-lg md:text-xl text-kuralis-600 tracking-tighter-custom leading-relaxed">
							使い手として、家具と暮らす。
						</p>

						<div className="pt-16">
							<Link
								href="/furniture"
								className="inline-flex items-center text-kuralis-700 hover:text-kuralis-900 transition-colors duration-300 group font-normal tracking-tighter-custom"
							>
								<span className="border-b border-kuralis-300 group-hover:border-kuralis-700 transition-colors duration-300 py-1">
									View Collection
								</span>
								<FiArrowRight
									size={16}
									className="ml-2 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-400 ease-natural"
								/>
							</Link>
						</div>
					</div>
				</div>
				<div className="absolute bottom-16 left-1/2 -translate-x-1/2">
					<FiArrowDown size={24} className="text-kuralis-400 animate-bounce" />
				</div>
			</section>

			<section className="py-40 border-t border-kuralis-100">
				<div className="container mx-auto px-6 md:px-12">
					<div className="max-w-4xl mx-auto">
						<div className="space-y-40">
							<p className="text-xl md:text-2xl text-kuralis-600 leading-relaxed text-center max-w-2xl mx-auto">
								家具は、私たちの生活を豊かにし、
								<br />
								時には心の拠り所となります。
							</p>

							<div className="max-w-xl mx-auto space-y-8">
								<div className="w-16 h-16 rounded-full bg-kuralis-100 flex items-center justify-center mx-auto">
									<FiHeart size={32} className="text-kuralis-600" />
								</div>
								<p className="text-kuralis-600 leading-relaxed text-center">
									家具は単なる物ではなく、
									<br />
									私たちの生活を共に歩むパートナーです。
									<br />
									<br />
									kuralisは、あなたと家具との
									<br />
									特別な関係を大切に育んでいくための
									<br />
									ツールです。
								</p>
							</div>
						</div>

						<div className="mt-40 text-center">
							<p className="text-kuralis-600 mb-8 tracking-tighter-custom">
								あなたの大切な家具を登録してみましょう
							</p>
							<Link
								href="/furniture"
								className="inline-flex items-center text-kuralis-700 hover:text-kuralis-900 transition-colors duration-300 group font-normal tracking-tighter-custom"
							>
								<span className="border-b border-kuralis-300 group-hover:border-kuralis-700 transition-colors duration-300 py-1">
									Start Collection
								</span>
								<FiArrowRight
									size={16}
									className="ml-2 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-400 ease-natural"
								/>
							</Link>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
