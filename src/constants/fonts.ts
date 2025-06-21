import { Inter, Noto_Sans_JP } from "next/font/google";

export const inter = Inter({
	subsets: ["latin"],
	weight: ["300", "400", "500", "700"],
	variable: "--font-inter",
});
export const notoSansJP = Noto_Sans_JP({
	subsets: ["latin"],
	weight: ["300", "400", "500", "700"],
	variable: "--font-noto",
});
