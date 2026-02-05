/* eslint-disable react-refresh/only-export-components */
import "./globals.css";
import PageViewListener from "./_analytics/pageviewListener";
import { Suspense } from "react";
import Script from "next/script";
import { GA_ID, existsGaId } from "@/lib/gtag";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/common/layout/Header";
import { Footer } from "@/components/common/layout/Footer";
import { AuthProvider } from "@/contexts/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import { generateMetadata } from "@/constants/metadata";

export const metadata = generateMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ja">
			<body className="min-h-screen flex flex-col font-sans">
				<AuthProvider>
					<Header />
					<Suspense>
						<PageViewListener />
					</Suspense>
					<div className="flex-grow flex flex-col">
						<main className="flex-grow">{children}</main>
						<Toaster />
					</div>
					<Footer />
				</AuthProvider>

				{existsGaId && (
					<>
						<Script
							src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
							strategy="afterInteractive"
						/>
						<Script id="ga-init" strategy="afterInteractive">
							{`
								window.dataLayer = window.dataLayer || [];
								function gtag(){dataLayer.push(arguments);}
								gtag('js', new Date());
								gtag('config', '${GA_ID}');
							`}
						</Script>
					</>
				)}
				<Analytics />
			</body>
		</html>
	);
}
