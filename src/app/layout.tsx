import "./globals.css";
import { Inter, Noto_Sans_JP } from "next/font/google";
import ClientRoot from "@/components/ClientRoot";

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
				<ClientRoot>{children}</ClientRoot>
			</body>
		</html>
	);
}
