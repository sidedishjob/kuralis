import { createServerSupabase } from "@/lib/supabase/server";
import type { MaintenanceSummaryItem } from "@/types/maintenance";

/**
 * 全家具のメンテナンスタスク概要を取得（SSR 専用）
 * リレーションを活用して 1 クエリで家具→タスク→履歴を取得
 */
export async function getAllMaintenanceSummary(
  userId: string,
): Promise<MaintenanceSummaryItem[]> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("furniture")
    .select(
      `
      id, name,
      maintenance_tasks (
        id, name, furniture_id,
        maintenance_records (
          id, task_id, performed_at, next_due_date
        )
      )
    `,
    )
    .eq("user_id", userId);

  if (error) {
    console.error(
      "[getAllMaintenanceSummary] データ取得エラー:",
      error.message,
    );
    throw new Error(`データ取得エラー: ${error.message}`);
  }
  if (!data || data.length === 0) return [];

  const result: MaintenanceSummaryItem[] = [];

  for (const furniture of data) {
    for (const task of furniture.maintenance_tasks) {
      const recordsWithTaskId = task.maintenance_records.filter(
        (r) => r.task_id !== null,
      );
      if (recordsWithTaskId.length === 0) continue;

      // 各タスクの最新履歴を抽出
      let latest = recordsWithTaskId[0];
      for (const rec of recordsWithTaskId) {
        if (new Date(latest.performed_at) < new Date(rec.performed_at)) {
          latest = rec;
        }
      }

      result.push({
        furnitureId: furniture.id,
        furnitureName: furniture.name,
        taskId: task.id,
        taskName: task.name,
        lastPerformedAt: new Date(latest.performed_at)
          .toISOString()
          .split("T")[0],
        nextDueDate: latest.next_due_date
          ? new Date(latest.next_due_date).toISOString().split("T")[0]
          : null,
      });
    }
  }

  return result;
}
