// 環境変数から測定IDを取得
export const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || "";

// 測定IDが存在するかどうかを判定（GAが有効か）
export const existsGaId = GA_ID !== "";

/**
 * ページビューを Google Analytics に送信
 * @param path - 遷移先のパス
 */
export const pageview = (path: string): void => {
	if (!window.gtag || !existsGaId) return;

	window.gtag("config", GA_ID, {
		page_path: path,
	});
};

/**
 * グローバルの gtag 関数を型定義
 */
declare global {
	interface Window {
		gtag: Gtag.Gtag;
	}
}

// gtag型定義（必要に応じて拡張可能）
export namespace Gtag {
	export type Gtag = (
		command: "config" | "event" | "js",
		targetId: string,
		config?: ControlParams | EventParams | CustomParams
	) => void;

	export interface ControlParams {
		page_path?: string;
		send_to?: string;
	}

	export interface EventParams {
		event_category?: string;
		event_label?: string;
		value?: number;
		[key: string]: unknown;
	}

	export interface CustomParams {
		[key: string]: unknown;
	}
}
