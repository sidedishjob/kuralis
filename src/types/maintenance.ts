// サマリー表示用（SSRで取得される概要情報）
export type MaintenanceSummary = {
	activeTaskCount: number; // アクティブなメンテナンスタスク数
	nearestTaskName: string | null; // 最も近い次回予定のタスク名
	nearestDueDate: string | null; // 最も近い次回予定日（ISO文字列）
	latestPerformedAt: string | null; // 最終実施日（ISO文字列）
};

// タスク（maintenance_tasks）構造
export type MaintenanceTask = {
	id: string;
	furniture_id: string;
	name: string;
	cycle_value: number;
	cycle_unit: "days" | "weeks" | "months" | "years";
	description: string | null;
	is_active: boolean;
	created_at: string;
};

// 実施記録（maintenance_records）構造
export type MaintenanceRecord = {
	id: string;
	task_id: string | null; // SET NULL on delete
	performed_at: string;
	notes: string | null;
	status: "completed" | "skipped" | "partial";
	task_name: string | null;
	task_cycle_value: number | null;
	task_cycle_unit: "days" | "weeks" | "months" | "years" | null;
	next_due_date: string | null;
	created_at: string;
};
