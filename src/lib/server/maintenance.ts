import { createServerSupabase } from "@/lib/supabase/server";
import type { MaintenanceSummary } from "@/types/maintenance";

/**
 * 家具IDに紐づくメンテナンスタスクと記録の概要情報を取得
 * - アクティブなタスク数
 * - 最も近い次回実施予定（task_name + next_due_date）
 * - 最終実施日（performed_at）
 *
 * リレーションを活用して 1 クエリでタスク→履歴を取得
 *
 * @param furnitureId 家具ID（UUID）
 * @returns MaintenanceSummaryオブジェクト
 */
export async function getMaintenanceSummary(
  furnitureId: string,
): Promise<MaintenanceSummary | null> {
  try {
    const supabase = await createServerSupabase();

    const { data: tasks, error: taskError } = await supabase
      .from("maintenance_tasks")
      .select(
        `
        id, name,
        maintenance_records (
          task_id, performed_at, next_due_date, task_name
        )
      `,
      )
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

    const activeTaskCount = tasks.length;

    // 各タスクごとに最新の記録を抽出し、next_due_date が存在するもののみ対象
    const latestPerTask: {
      task_name: string | null;
      next_due_date: string;
      performed_at: string;
    }[] = [];

    for (const task of tasks) {
      const validRecords = task.maintenance_records.filter(
        (r) => r.task_id !== null && r.next_due_date !== null,
      );
      if (validRecords.length === 0) continue;

      let latest = validRecords[0];
      for (const rec of validRecords) {
        if (new Date(latest.performed_at) < new Date(rec.performed_at)) {
          latest = rec;
        }
      }

      latestPerTask.push({
        task_name: latest.task_name,
        next_due_date: latest.next_due_date!,
        performed_at: latest.performed_at,
      });
    }

    if (latestPerTask.length === 0) {
      return {
        activeTaskCount,
        nearestTaskName: null,
        nearestDueDate: null,
      };
    }

    // 全タスクの中から最も近い next_due_date を持つレコードを選択
    const nearestRecord = latestPerTask.sort(
      (a, b) =>
        new Date(a.next_due_date).getTime() -
        new Date(b.next_due_date).getTime(),
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
