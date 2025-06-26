import { createServerSupabase } from "@/lib/supabase/server";
import type { MaintenanceSummary } from "@/types/maintenance";

/**
 * 家具IDに紐づくメンテナンスタスクと記録の概要情報を取得
 * - アクティブなタスク数
 * - 最も近い次回実施予定（task_name + next_due_date）
 * - 最終実施日（performed_at）
 *
 * @param furnitureId 家具ID（UUID）
 * @returns MaintenanceSummaryオブジェクト
 */
export async function getMaintenanceSummary(
	furnitureId: string
): Promise<MaintenanceSummary | null> {
	try {
		const supabase = await createServerSupabase();

		// 1. 家具に紐づくアクティブなタスク一覧を取得
		const { data: tasks, error: taskError } = await supabase
			.from("maintenance_tasks")
			.select("id, name")
			.eq("is_active", true)
			.eq("furniture_id", furnitureId);

		if (taskError) throw new Error(`タスク取得失敗: ${taskError.message}`);

		if (!tasks || tasks.length === 0) {
			return {
				activeTaskCount: 0,
				nearestTaskName: null,
				nearestDueDate: null,
			};
		}

		const taskIds = tasks.map((t) => t.id);
		const activeTaskCount = tasks.length;

		// 2. 該当タスクに紐づく記録（履歴）を取得
		const { data: records, error: recordError } = await supabase
			.from("maintenance_records")
			.select("task_id, performed_at, next_due_date, task_name")
			.in("task_id", taskIds)
			.not("next_due_date", "is", null);

		if (recordError) throw new Error(`記録取得失敗: ${recordError.message}`);
		if (!records || records.length === 0) {
			return {
				activeTaskCount,
				nearestTaskName: null,
				nearestDueDate: null,
			};
		}

		// 3. 各タスクごとに「最新の記録（最も新しい performed_at）」を抽出
		const latestPerTask = Object.values(
			records.reduce(
				(acc, record) => {
					const existing = acc[record.task_id];
					const current = new Date(record.performed_at);
					if (!existing || new Date(existing.performed_at) < current) {
						acc[record.task_id] = record;
					}
					return acc;
				},
				{} as Record<string, (typeof records)[0]>
			)
		);

		// 4. 全タスクの中から「最も古い next_due_date」 を持つレコードを選択
		const nearestRecord = latestPerTask.sort(
			(a, b) => new Date(a.next_due_date).getTime() - new Date(b.next_due_date).getTime()
		)[0];

		return {
			activeTaskCount,
			nearestTaskName: nearestRecord?.task_name ?? null,
			nearestDueDate: nearestRecord?.next_due_date ?? null,
		};
	} catch (error: unknown) {
		console.error("メンテナンス取得エラー:", error);
		return null;
	}
}
