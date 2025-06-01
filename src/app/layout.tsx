import "./globals.css";
import { Inter, Noto_Sans_JP } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"], weight: ["700"], variable: "--font-inter" });
const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], weight: ["700"], variable: "--font-noto" });

export const metadata = {
	title: "kuralis | 使い手として、家具と暮らす。",
	description: "家具と暮らすための記録アプリ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ja" className={`${inter.variable} ${notoSansJP.variable}`}>
			<body>
				<AuthProvider>
					<Header />
					<div className="min-h-screen bg-white text-kuralis-900 flex flex-col">
						<main className="flex-grow">{children}</main>
						<Toaster />
					</div>
					<Footer />
				</AuthProvider>
			</body>
		</html>
	);
}
