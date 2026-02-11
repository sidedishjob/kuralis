// 家具詳細画面サマリー表示用（SSRで取得される概要情報）
export type MaintenanceSummary = {
  activeTaskCount: number; // アクティブなメンテナンスタスク数
  nearestTaskName: string | null; // 最も近い次回予定のタスク名
  nearestDueDate: string | null; // 最も近い次回予定日（ISO文字列）
};

// メンテナンス予定画面サマリー表示用（SSRで取得される概要情報）
export interface MaintenanceSummaryItem {
  furnitureId: string;
  furnitureName: string;
  taskId: string;
  taskName: string;
  lastPerformedAt: string;
  nextDueDate: string | null;
}

// メンテナンス履歴
export interface MaintenanceHistory {
  taskId: string;
  performedAt: string;
}

export type MaintenanceCycleUnit = "days" | "weeks" | "months" | "years";

export const MAINTENANCE_CYCLE_UNITS = [
  "days",
  "weeks",
  "months",
  "years",
] as const;

export function isMaintenanceCycleUnit(
  value: string,
): value is MaintenanceCycleUnit {
  return (MAINTENANCE_CYCLE_UNITS as readonly string[]).includes(value);
}

export type MaintenanceStatus = "completed" | "skipped" | "partial";

export interface MaintenanceRecord {
  id: string;
  task_id: string;
  performed_at: string;
  next_due_date: string | null;
  status: MaintenanceStatus;
}

export interface MaintenanceTaskWithRecords {
  id: string;
  name: string;
  cycle_value: number;
  cycle_unit: MaintenanceCycleUnit;
  description?: string;
  is_active: boolean;
  created_at: string;
  records: MaintenanceRecord[];
  next_due_date: string | null;
}

/**
 * メンテナンスタスク登録APIに送信するリクエストの型
 */
export interface MaintenanceTaskPayload {
  taskName: string;
  cycleValue: string;
  cycleUnit: string;
}
