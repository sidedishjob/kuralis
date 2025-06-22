import "./globals.css";
import PageViewListener from "./_analytics/pageviewListener";
import { Suspense } from "react";
import Script from "next/script";
import { GA_ID, existsGaId } from "@/lib/gtag";
import { getUserFromCookie } from "@/lib/supabase/server";
import { Header } from "@/components/common/layout/Header";
import { Footer } from "@/components/common/layout/Footer";
import { AuthProvider } from "@/contexts/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import { inter, notoSansJP } from "@/constants/fonts";
import { siteMetadata } from "@/constants/metadata";

export const metadata = siteMetadata;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	// SSRでcookieからuser取得
	const user = await getUserFromCookie();

	return (
		<html lang="ja" className={`${inter.variable} ${notoSansJP.variable}`}>
			<body className="min-h-screen flex flex-col">
				<AuthProvider initialUser={user}>
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
			</body>
		</html>
	);
}
