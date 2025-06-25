import { NextRequest, NextResponse } from "next/server";
import { createSupabaseApiClient } from "@/lib/supabase/server";
import { calculateNextDueDate } from "@/lib/utils/maintenance";
import { handleApiError } from "@/lib/utils/handleApiError";
import { ApiError } from "@/lib/errors/ApiError";
import type { MaintenanceHistory } from "@/types/maintenance";

/**
 * メンテナンス履歴の登録
 */
export async function POST(req: NextRequest) {
	const res = NextResponse.next();

	try {
		const supabase = await createSupabaseApiClient(req, res);

		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			throw new ApiError(401, "認証が必要です");
		}

		const { taskId, performedAt }: MaintenanceHistory = await req.json();

		if (!taskId || !performedAt) {
			throw new ApiError(400, "taskId と performedAt は必須です");
		}

		// 1. 対象タスクを取得（周期取得のため）
		const { data: task, error: taskError } = await supabase
			.from("maintenance_tasks")
			.select("cycle_value, cycle_unit, name")
			.eq("id", taskId)
			.single();

		if (taskError || !task) {
			throw new Error(`タスク取得エラー: ${taskError?.message}`);
		}

		// 2. 次回予定日を算出
		const nextDueDate = calculateNextDueDate(performedAt, task.cycle_value, task.cycle_unit);

		// 3. INSERT 実行（履歴登録）
		const { data, error: insertError } = await supabase
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

		if (insertError) {
			throw new Error(`履歴登録エラー: ${insertError.message}`);
		}

		return NextResponse.json(data, { status: 200 });
	} catch (error: unknown) {
		return handleApiError(error, "メンテナンス履歴の登録に失敗しました");
	}
}
