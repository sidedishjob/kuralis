import { NextResponse } from "next/server";
import { createSupabaseServerClient, getUserFromCookie } from "@/lib/supabase/server";
import { getMaintenanceTasksWithRecords } from "@/lib/server/maintenance";

const VALID_UNITS = ["days", "weeks", "months", "years"];

/**
 * メンテナンスタスクの取得（GET）
 */
export async function GET(req: Request, { params }: { params: { id: string } }) {
	const { id } = await params;

	if (!id) {
		return NextResponse.json({ message: "家具IDが未指定です" }, { status: 400 });
	}

	try {
		const data = await getMaintenanceTasksWithRecords(id);
		return NextResponse.json(data, { status: 200 });
	} catch (e) {
		console.error(e);
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
