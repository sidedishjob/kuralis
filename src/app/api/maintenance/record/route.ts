import { NextResponse } from "next/server";
import { getUserFromCookie, createSupabaseServerClient } from "@/lib/supabase/server";
import { calculateNextDueDate } from "@/lib/utils/maintenance";
import type { MaintenanceHistory } from "@/types/maintenance";

/**
 * メンテナンス履歴の登録（POST）
 */
export async function POST(req: Request) {
	const user = await getUserFromCookie();
	if (!user) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const { taskId, performedAt }: MaintenanceHistory = await req.json();

	try {
		const supabase = await createSupabaseServerClient();

		// 1. 対象タスク情報を取得（周期取得のため）
		const { data: task, error: taskError } = await supabase
			.from("maintenance_tasks")
			.select("cycle_value, cycle_unit, name")
			.eq("id", taskId)
			.single();

		if (taskError || !task) {
			console.error("[POST /api/maintenance/record] Task Fetch Error:", taskError?.message);
			return NextResponse.json({ message: "タスクが存在しません" }, { status: 400 });
		}

		// 2. 次回予定日を算出
		const nextDueDate = calculateNextDueDate(performedAt, task.cycle_value, task.cycle_unit);

		// 3. INSERT 実行（履歴登録）
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

		if (error) {
			console.error("[POST /api/maintenance/record] Insert Error:", error.message);
			return NextResponse.json({ message: "DB登録に失敗しました" }, { status: 500 });
		}

		return NextResponse.json(data, { status: 200 });
	} catch (e) {
		console.error("[POST /api/maintenance/record] Unexpected Error:", e);
		return NextResponse.json({ message: "予期せぬエラーが発生しました" }, { status: 500 });
	}
}
