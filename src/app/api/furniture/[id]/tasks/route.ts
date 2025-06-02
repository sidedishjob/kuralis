import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MaintenanceTaskWithRecords } from "@/types/maintenance";

const VALID_UNITS = ["days", "weeks", "months", "years"];

/**
 * 家具IDに紐づくメンテナンスタスクの取得（GET）
 */
export async function GET(req: Request, { params }: { params: { id: string } }) {
	const { id } = await params;

	if (!id) {
		return NextResponse.json({ message: "家具IDが未指定です" }, { status: 400 });
	}

	try {
		const supabase = await createSupabaseServerClient();
		// 1. 家具に紐づくタスク一覧取得
		const { data: tasks, error: taskError } = await supabase
			.from("maintenance_tasks")
			.select("id, name, cycle_value, cycle_unit, description, is_active, created_at")
			.eq("furniture_id", id)
			.eq("is_active", true)
			.order("created_at", { ascending: true });

		if (taskError) {
			console.error("[GET /api/maintenance/[id]] Task Error:", taskError.message);
			return NextResponse.json(
				{ message: "メンテナンスタスクの取得に失敗しました" },
				{ status: 500 }
			);
		}

		if (!tasks || tasks.length === 0) {
			return NextResponse.json([], { status: 200 });
		}

		// 2. 対象タスクIDの履歴をまとめて取得
		const taskIds = tasks.map((t) => t.id);

		const { data: records, error: recordError } = await supabase
			.from("maintenance_records")
			.select("id, task_id, performed_at, next_due_date, status")
			.in("task_id", taskIds)
			.order("performed_at", { ascending: false });

		if (recordError) {
			console.error("[GET /api/maintenance/[id]] Record Error:", recordError.message);
			return NextResponse.json(
				{ message: "メンテナンス履歴の取得に失敗しました" },
				{ status: 500 }
			);
		}

		// 3. タスク単位に履歴をグルーピング
		const grouped: MaintenanceTaskWithRecords[] = tasks.map((task) => {
			const taskRecords = records.filter((r) => r.task_id === task.id);
			return {
				...task,
				records: taskRecords,
				next_due_date: taskRecords[0]?.next_due_date ?? null,
			};
		});

		return NextResponse.json(grouped, { status: 200 });
	} catch (e) {
		console.error("[GET /api/maintenance/[id]] Unexpected Error:", e);
		return NextResponse.json({ message: "取得に失敗しました" }, { status: 500 });
	}
}

/**
 * メンテナンスタスクの登録（POST)
 */
export async function POST(req: Request, { params }: { params: { id: string } }) {
	const supabase = await createSupabaseServerClient();

	const { id } = await params;
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

	if (cycleUnit && !VALID_UNITS.includes(cycleUnit)) {
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

	if (error) {
		console.error(error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json(data);
}
