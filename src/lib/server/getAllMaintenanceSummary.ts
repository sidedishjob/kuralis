import { createServerSupabase } from "@/lib/supabase/server";
import type { MaintenanceSummaryItem } from "@/types/maintenance";
import type { PostgrestError } from "@supabase/supabase-js";

/**
 * Supabase のエラーを共通で処理
 */
function checkSupabaseError<T>(data: T | null, error: PostgrestError | null, name: string): T {
	if (error) {
		console.error(`[getAllMaintenanceSummary] ${name}エラー:`, error.message);
		throw new Error(`${name}エラー: ${error.message}`);
	}
	if (!data) {
		console.error(`[getAllMaintenanceSummary] ${name}データがnull`);
		throw new Error(`${name}エラー: データが取得できませんでした`);
	}
	return data;
}

/**
 * 全家具のメンテナンスタスク概要を取得（SSR 専用）
 */
export async function getAllMaintenanceSummary(userId: string): Promise<MaintenanceSummaryItem[]> {
	const supabase = await createServerSupabase();

	// 1. 家具一覧を取得
	const { data: furnitures, error: furnError } = await supabase
		.from("furniture")
		.select("id, name")
		.eq("user_id", userId);
	const safeFurnitures = checkSupabaseError(furnitures, furnError, "furnitures");
	if (safeFurnitures.length === 0) return [];

	// 2. 家具に紐づくタスク一覧を取得
	const furnitureIds = safeFurnitures.map((f) => f.id);
	const { data: tasks, error: taskError } = await supabase
		.from("maintenance_tasks")
		.select("id, name, furniture_id")
		.in("furniture_id", furnitureIds);
	const safeTasks = checkSupabaseError(tasks, taskError, "tasks");
	if (safeTasks.length === 0) return [];

	// 3. タスクに紐づく履歴一覧を取得
	const taskIds = safeTasks.map((t) => t.id);
	const { data: records, error: recordError } = await supabase
		.from("maintenance_records")
		.select("id, task_id, performed_at, next_due_date")
		.in("task_id", taskIds);
	const safeRecords = checkSupabaseError(records, recordError, "records");
	if (safeRecords.length === 0) return [];

	// 4. 各 task_id ごとに最新履歴のみ抽出
	const latestRecordsMap = new Map<string, (typeof safeRecords)[0]>();
	for (const rec of safeRecords) {
		const existing = latestRecordsMap.get(rec.task_id);
		if (!existing || new Date(existing.performed_at) < new Date(rec.performed_at)) {
			latestRecordsMap.set(rec.task_id, rec);
		}
	}

	// 5. 最新履歴とタスク・家具情報を結合して集約データ作成
	const result: MaintenanceSummaryItem[] = [];

	for (const [taskId, record] of latestRecordsMap.entries()) {
		const task = safeTasks.find((t) => t.id === taskId);
		if (!task) continue;

		const furniture = safeFurnitures.find((f) => f.id === task.furniture_id);
		if (!furniture) continue;

		result.push({
			furnitureId: furniture.id,
			furnitureName: furniture.name,
			taskId: task.id,
			taskName: task.name,
			lastPerformedAt: new Date(record.performed_at).toISOString().split("T")[0],
			nextDueDate: record.next_due_date
				? new Date(record.next_due_date).toISOString().split("T")[0]
				: null,
		});
	}

	return result;
}
