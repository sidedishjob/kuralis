import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { handleApiError } from "@/lib/utils/handleApiError";
import type { MaintenanceTaskWithRecords } from "@/types/maintenance";

const VALID_UNITS = ["days", "weeks", "months", "years"];

/**
 * GET: 家具IDに紐づくメンテナンスタスクと履歴の取得
 */
export async function GET(_: Request, { params }: { params: { id: string } }) {
	const { id } = await params;

	if (!id) {
		return NextResponse.json({ error: "家具IDが未指定です" }, { status: 400 });
	}

	try {
		const supabase = await createSupabaseServerClient();
		// 1. 家具に紐づくタスク一覧取得
		const { data: tasks, error: taskError } = await supabase
			.from("maintenance_tasks")
			.select("id, name, cycle_value, cycle_unit, description, is_active, created_at")
			.eq("furniture_id", id)
			// .eq("is_active", true)
			.order("created_at", { ascending: true });

		if (taskError) throw new Error(`タスク取得エラー: ${taskError.message}`);
		if (!tasks || tasks.length === 0) return NextResponse.json([], { status: 200 });

		// 2. 対象タスクIDの履歴をまとめて取得
		const taskIds = tasks.map((t) => t.id);

		const { data: records, error: recordError } = await supabase
			.from("maintenance_records")
			.select("id, task_id, performed_at, next_due_date, status")
			.in("task_id", taskIds)
			.order("performed_at", { ascending: false });

		if (recordError) throw new Error(`メンテナンス履歴取得エラー: ${recordError.message}`);

		// 3. タスク単位に履歴をグルーピング
		const result: MaintenanceTaskWithRecords[] = tasks.map((task) => {
			const taskRecords = records.filter((r) => r.task_id === task.id);
			return {
				...task,
				records: taskRecords,
				next_due_date: taskRecords[0]?.next_due_date ?? null,
			};
		});

		return NextResponse.json(result);
	} catch (error: unknown) {
		return handleApiError(error, "メンテナンスタスクの取得に失敗しました");
	}
}

/**
 * POST: メンテナンスタスクの登録
 */
export async function POST(req: Request, { params }: { params: { id: string } }) {
	const { id } = await params;

	if (!id) {
		return NextResponse.json({ error: "家具IDが未指定です" }, { status: 400 });
	}

	try {
		const supabase = await createSupabaseServerClient();
		const { taskName, cycleValue, cycleUnit } = await req.json();

		const errors: { field: string; message: string }[] = [];

		if (!taskName) errors.push({ field: "taskName", message: "項目名は必須です" });
		if (!cycleValue) errors.push({ field: "cycleValue", message: "周期（日数）は必須です" });
		if (!cycleUnit) errors.push({ field: "cycleUnit", message: "周期（単位）は必須です" });

		if (errors.length > 0) {
			return NextResponse.json(
				{ error: "入力に不備があります", details: errors },
				{ status: 400 }
			);
		}

		if (!VALID_UNITS.includes(cycleUnit)) {
			return NextResponse.json(
				{ error: `周期単位が不正です。使用可能な単位: ${VALID_UNITS.join(", ")}` },
				{ status: 400 }
			);
		}

		const { data, error } = await supabase
			.from("maintenance_tasks")
			.insert({
				furniture_id: id,
				name: taskName,
				cycle_value: parseInt(cycleValue),
				cycle_unit: cycleUnit,
			})
			.select()
			.single();

		if (error) throw new Error(`メンテナンスタスク登録失敗: ${error.message}`);

		return NextResponse.json(data);
	} catch (error: unknown) {
		return handleApiError(error, "メンテナンスタスクの登録に失敗しました");
	}
}
