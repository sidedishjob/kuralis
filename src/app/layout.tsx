import "./globals.css";
import { Header } from "@/components/common/layout/Header";
import { Footer } from "@/components/common/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { inter, notoSansJP } from "@/constants/fonts";
import { siteMetadata } from "@/constants/metadata";

export const metadata = siteMetadata;

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
