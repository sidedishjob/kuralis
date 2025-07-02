export const siteMetadata = {
	// 基本情報
	title: "kuralis | 使い手として、家具と暮らす。",
	titleBase: "kuralis",
	titleSuffix: "使い手として、家具と暮らす。",
	description:
		"家具と暮らすための記録アプリ。家具の登録、メンテナンス記録の管理、次回メンテナンス予定の確認など、家具との暮らしをより豊かにする機能を提供します。",
	siteUrl: "https://kuralis.homes",
	siteName: "kuralis",
	language: "ja-JP",
	locale: "ja_JP",
	type: "website",
	twitterCard: "summary_large_image",
	// twitterSite: "@kuralis_app",
	// twitterCreator: "@kuralis_app",

	// アプリケーション情報
	appName: "kuralis",
	appDescription: "家具と暮らすための記録アプリ",
	appVersion: "1.0.0",
	appAuthor: "kuralis team",
	appEmail: "kuralis525@gmail.com",

	// メタ情報
	keywords: [
		"家具",
		"メンテナンス",
		"記録",
		"管理",
		"アプリ",
		"暮らし",
		"インテリア",
		"生活",
		"整理整頓",
		"収納",
	].join(", "),

	// OGP画像
	ogImage: {
		url: "https://kuralis.homes/kuralis-ogp.png",
		width: 1200,
		height: 630,
		alt: "kuralis - 家具と暮らすための記録アプリ",
	},

	// ファビコン
	favicon: {
		url: "/favicon.ico",
		sizes: "32x32",
		type: "image/x-icon",
	},

	// アプリアイコン
	appIcon: {
		url: "/app-icon.png",
		sizes: "192x192",
		type: "image/png",
	},

	// Apple Touch Icon（iOS ホーム画面アイコン）
	appleTouchIcon: {
		url: "/apple-touch-icon.png",
		sizes: "180x180",
		type: "image/png",
	},

	// プライバシーポリシー
	privacyPolicy: {
		url: "/privacy",
		lastUpdated: "2025-07-01",
	},

	// 利用規約
	termsOfService: {
		url: "/terms",
		lastUpdated: "2025-07-01",
	},

	// サポート情報
	support: {
		email: "kuralis525@gmail.com",
		github: "https://github.com/sidedishjob/kuralis",
	},

	// ライセンス情報
	license: {
		name: "MIT License",
		url: "https://opensource.org/licenses/MIT",
	},
} as const;

// 型定義
export type SiteMetadata = typeof siteMetadata;

// ページ別メタデータの生成ヘルパー
export function generateMetadata({
	title,
	description,
	image,
	type = "website",
}: {
	title?: string;
	description?: string;
	image?: string;
	type?: string;
} = {}) {
	return {
		title: title
			? `${title} | ${siteMetadata.titleBase}`
			: `${siteMetadata.titleBase} | ${siteMetadata.titleSuffix}`,
		description: description || siteMetadata.description,
		openGraph: {
			title: title ? `${title} | ${siteMetadata.title}` : siteMetadata.title,
			description: description || siteMetadata.description,
			url: siteMetadata.siteUrl,
			siteName: siteMetadata.siteName,
			images: [
				{
					url: image || siteMetadata.ogImage.url,
					width: siteMetadata.ogImage.width,
					height: siteMetadata.ogImage.height,
					alt: siteMetadata.ogImage.alt,
				},
			],
			locale: siteMetadata.locale,
			type,
		},
		twitter: {
			card: siteMetadata.twitterCard,
			title: title ? `${title} | ${siteMetadata.title}` : siteMetadata.title,
			description: description || siteMetadata.description,
			// site: siteMetadata.twitterSite,
			// creator: siteMetadata.twitterCreator,
			images: [image || siteMetadata.ogImage.url],
		},
		icons: {
			apple: [
				{
					url: siteMetadata.appleTouchIcon.url,
					sizes: siteMetadata.appleTouchIcon.sizes,
					type: siteMetadata.appleTouchIcon.type,
				},
			],
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},
		verification: {
			google: "cNerVpuLRHQp6bOFRclL0Klmoon5uoVEubRqxM9LbMo", // Google Search Consoleの検証コード
			yandex: "yandex-verification-code", // Yandex Webmasterの検証コード
			bing: "bing-verification-code", // Bing Webmaster Toolsの検証コード
		},
	};
}
