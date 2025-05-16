import "./globals.css";
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { Inter, Noto_Sans_JP } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["700"], variable: "--font-inter" });
const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], weight: ["700"], variable: "--font-noto" });

export const metadata = {
	title: "kuralis | 使い手として、家具と暮らす。",
	description: "家具と暮らすための記録アプリ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ja" className={`${inter.variable} ${notoSansJP.variable}`}>
			<head />
			<body>
				<AuthProvider>
					<Layout>
						{children}
						<Toaster />
					</Layout>
				</AuthProvider>
			</body>
		</html>
	);
}
