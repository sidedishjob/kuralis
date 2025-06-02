import { createSupabaseServerClient } from "@/lib/supabase/server"; // SSR用Supabaseクライアント
import { MaintenanceSummary, MaintenanceTaskWithRecords } from "@/types/maintenance";

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
		const supabase = await createSupabaseServerClient();

		// タスク一覧を取得
		const { data: tasks, error: taskError } = await supabase
			.from("maintenance_tasks")
			.select("id, name, is_active")
			.eq("furniture_id", furnitureId);

		if (taskError || !tasks) {
			console.error("[getMaintenanceSummary] タスク取得エラー:", taskError);
			return null;
		}

		const taskIds = tasks.map((t) => t.id);
		const activeTaskCount = tasks.filter((t) => t.is_active).length;

		if (taskIds.length === 0) {
			return null;
		}

		// 最も近い next_due_date を持つレコード
		const { data: nextRecord, error: nextError } = await supabase
			.from("maintenance_records")
			.select("next_due_date, task_name")
			.in("task_id", taskIds)
			.gte("next_due_date", new Date().toISOString())
			.order("next_due_date", { ascending: true })
			.limit(1)
			.single();

		if (nextError && nextError.code !== "PGRST116") {
			console.error("[getMaintenanceSummary] 次回予定取得エラー:", nextError);
		}

		// 最も最近の performed_at を持つレコード
		const { data: latestRecord, error: latestError } = await supabase
			.from("maintenance_records")
			.select("performed_at, task_name")
			.in("task_id", taskIds)
			.order("performed_at", { ascending: false })
			.limit(1)
			.single();

		if (latestError && latestError.code !== "PGRST116") {
			console.error("[getMaintenanceSummary] 最終実施取得エラー:", latestError);
		}

		return {
			activeTaskCount,
			nearestTaskName: nextRecord?.task_name ?? null,
			nearestDueDate: nextRecord?.next_due_date ?? null,
			latestPerformedAt: latestRecord?.performed_at ?? null,
		};
	} catch (err) {
		console.error("[getMaintenanceSummary] 予期しないエラー:", err);
		return null;
	}
}
