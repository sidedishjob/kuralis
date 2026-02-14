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
import { Toaster } from "@/components/ui/sonner";
import { inter, notoSansJP } from "@/constants/fonts";
import { generateMetadata } from "@/constants/metadata";

export const metadata = generateMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${inter.variable} ${notoSansJP.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">
        <AuthProvider>
          <Header />
          <Suspense>
            <PageViewListener />
          </Suspense>
          <div className="grow flex flex-col">
            <main className="grow">{children}</main>
            <Toaster />
          </div>
          <Footer />
        </AuthProvider>

        {existsGaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="lazyOnload"
            />
            <Script id="ga-init" strategy="lazyOnload">
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
