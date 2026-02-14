import { createServerSupabase } from "@/lib/supabase/server";
import type {
  MaintenanceSummary,
  MaintenanceStatus,
  MaintenanceTaskWithRecords,
} from "@/types/maintenance";
import { isMaintenanceCycleUnit } from "@/types/maintenance";

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

/**
 * 家具IDに紐づくメンテナンスタスク一覧（履歴付き）を取得
 * SSR で取得し、クライアントの SWR fallbackData として利用する
 *
 * @param furnitureId 家具ID（UUID）
 * @returns MaintenanceTaskWithRecords[]
 * @throws 取得失敗時はエラーを伝播（呼び出し元で error.tsx 等にキャッチさせる）
 */
export async function getMaintenanceTasks(
  furnitureId: string,
): Promise<MaintenanceTaskWithRecords[]> {
  const supabase = await createServerSupabase();

  const { data: tasks, error: taskError } = await supabase
    .from("maintenance_tasks")
    .select(
      `
      id, name, cycle_value, cycle_unit, description, is_active, created_at,
      maintenance_records (
        id, task_id, performed_at, next_due_date, status
      )
    `,
    )
    .eq("furniture_id", furnitureId)
    .order("created_at", { ascending: true });

  if (taskError) throw new Error(`タスク取得エラー: ${taskError.message}`);
  if (!tasks || tasks.length === 0) return [];

  return tasks.reduce((acc, task) => {
    if (!isMaintenanceCycleUnit(task.cycle_unit)) {
      console.warn(
        `不正なcycle_unitが検出されました: ${task.cycle_unit} (task_id=${task.id})`,
      );
      return acc;
    }

    const taskRecords = (task.maintenance_records ?? [])
      .filter(
        (
          record,
        ): record is typeof record & {
          task_id: string;
          status: MaintenanceStatus;
        } => record.task_id !== null && record.status !== null,
      )
      .sort(
        (a, b) =>
          new Date(b.performed_at).getTime() -
          new Date(a.performed_at).getTime(),
      )
      .map((record) => ({
        id: record.id,
        task_id: record.task_id,
        performed_at: record.performed_at,
        next_due_date: record.next_due_date,
        status: record.status,
      }));

    acc.push({
      id: task.id,
      name: task.name,
      cycle_value: task.cycle_value,
      cycle_unit: task.cycle_unit,
      is_active: task.is_active ?? false,
      created_at: task.created_at ?? new Date(0).toISOString(),
      description: task.description ?? undefined,
      records: taskRecords,
      next_due_date: taskRecords[0]?.next_due_date ?? null,
    });
    return acc;
  }, [] as MaintenanceTaskWithRecords[]);
}
