// 環境変数から測定IDを取得
export const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || "";

// GAが有効かどうか
export const existsGaId = GA_ID !== "";

/**
 * ページビューを GA に送信
 */
export const pageview = (path: string): void => {
	if (!window.gtag || !existsGaId) return;

	window.gtag("config", GA_ID, {
		page_path: path,
	});
};

// gtag 関数の型
export type GtagFunction = (
	command: "config" | "event" | "js",
	targetId: string,
	config?: ControlParams | EventParams | CustomParams
) => void;

// 各パラメータ型
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

/**
 * window.gtag のグローバル定義
 */
declare global {
	interface Window {
		gtag: GtagFunction;
	}
}

/**
 * 任意のイベントを GA に送信（例：クリック）
 */
export const event = ({
	action,
	category,
	label,
	value,
}: {
	action: string;
	category: string;
	label: string;
	value?: number;
}): void => {
	if (!window.gtag || !existsGaId) return;

	window.gtag("event", action, {
		event_category: category,
		event_label: label,
		value,
	});
};
