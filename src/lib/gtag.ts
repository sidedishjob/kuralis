export const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || "";

// GAが有効かどうか
export const existsGaId = GA_ID !== "";

export const pageview = (path: string) => {
	if (!window.gtag) return;
	window.gtag("config", GA_ID, {
		page_path: path,
	});
};

declare global {
	interface Window {
		gtag: (...args: any[]) => void;
	}
}
