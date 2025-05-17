// メンテナンス履歴
export interface MaintenanceHistory {
	id: string;
	date: string; // yyyy/MM/dd
}

// メンテナンス項目
export interface MaintenanceItem {
	id: string;
	method: string;
	cycle: string;
	history: MaintenanceHistory[];
	nextDate?: Date;
	icon?: React.ReactNode; // UIで表示用
}

// メンテナンスタスク
export interface MaintenanceTask {
	id: string;
	furnitureId: string;
	furnitureName: string;
	method: string;
	nextDate: Date;
	cycle: string;
	lastDoneAt: string;
}
