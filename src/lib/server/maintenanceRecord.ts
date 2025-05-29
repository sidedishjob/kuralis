import { createSupabaseServerClient } from "@/lib/supabase/server";
import { addDays, addMonths, addYears } from "date-fns";
import { MaintenanceHistory } from "@/types/maintenance";

export async function addMaintenanceRecord({ taskId, performedAt }: MaintenanceHistory) {
	const supabase = await createSupabaseServerClient();

	// 対応するタスク情報を取得（周期のため）
	const { data: task } = await supabase
		.from("maintenance_tasks")
		.select("cycle_value, cycle_unit, name")
		.eq("id", taskId)
		.single();

	if (!task) throw new Error("タスクが存在しません");

	// 次回予定日を算出
	const baseDate = new Date(performedAt);
	const nextDueDate = addDays(baseDate, task.cycle_value); // 仮：日単位のみ対応（後で改善）

	// INSERT 実行
	const { data, error } = await supabase
		.from("maintenance_records")
		.insert({
			task_id: taskId,
			performed_at: performedAt,
			next_due_date: nextDueDate.toISOString().split("T")[0],
			status: "completed",
			task_name: task.name,
			task_cycle_value: task.cycle_value,
			task_cycle_unit: task.cycle_unit,
		})
		.select()
		.single();

	if (error) throw new Error(error.message);
	return data;
}
