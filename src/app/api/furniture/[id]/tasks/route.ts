import { NextRequest, NextResponse } from "next/server";
import { createSupabaseApiClient } from "@/lib/supabase/server";
import { handleApiError } from "@/lib/utils/handleApiError";
import { maintenanceTaskSchema } from "@/lib/validation";
import type { MaintenanceStatus, MaintenanceTaskWithRecords } from "@/types/maintenance";
import { isMaintenanceCycleUnit, MAINTENANCE_CYCLE_UNITS } from "@/types/maintenance";
import { ApiError } from "@/lib/errors/ApiError";

const VALID_UNITS = MAINTENANCE_CYCLE_UNITS;

/**
 * GET: 家具IDに紐づくメンテナンスタスクと履歴の取得
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const res = NextResponse.next();

	try {
		const supabase = await createSupabaseApiClient(req, res);

		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) throw new ApiError(401, "認証が必要です");

		const { id } = await params;
		if (!id) throw new ApiError(400, "家具IDが未指定です");

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
		const safeRecords = records ?? [];

		// 3. タスク単位に履歴をグルーピング
		const result: MaintenanceTaskWithRecords[] = tasks.reduce((acc, task) => {
			if (!isMaintenanceCycleUnit(task.cycle_unit)) {
				console.warn(
					`不正なcycle_unitが検出されました: ${task.cycle_unit} (task_id=${task.id})`
				);
				return acc;
			}

			const taskIsActive = task.is_active ?? false;
			const taskCreatedAt = task.created_at ?? new Date(0).toISOString();

			const taskRecords = safeRecords
				.filter(
					(
						record
					): record is typeof record & { task_id: string; status: MaintenanceStatus } =>
						record.task_id === task.id && record.status !== null
				)
				.map((record) => ({
					id: record.id,
					task_id: record.task_id,
					performed_at: record.performed_at,
					next_due_date: record.next_due_date,
					status: record.status,
				}));

			acc.push({
				...task,
				cycle_unit: task.cycle_unit,
				is_active: taskIsActive,
				created_at: taskCreatedAt,
				description: task.description ?? undefined,
				records: taskRecords,
				next_due_date: taskRecords[0]?.next_due_date ?? null,
			});
			return acc;
		}, [] as MaintenanceTaskWithRecords[]);

		return NextResponse.json(result, { status: 200 });
	} catch (error: unknown) {
		return handleApiError(error, "メンテナンスタスクの取得に失敗しました");
	}
}

/**
 * POST: メンテナンスタスクの追加
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const res = NextResponse.next();
	try {
		const supabase = await createSupabaseApiClient(req, res);

		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) throw new ApiError(401, "認証が必要です");

		const { id } = await params;
		if (!id) throw new ApiError(400, "家具IDが未指定です");

		const body = await req.json();
		const result = maintenanceTaskSchema.safeParse(body);

		if (!result.success) {
			throw new ApiError(400, "入力に不備があります", result.error.flatten().fieldErrors);
		}

		const { taskName, cycleValue, cycleUnit } = result.data;
		const parsedCycleValue = parseInt(cycleValue, 10);

		if (Number.isNaN(parsedCycleValue)) {
			throw new ApiError(400, "周期値が不正です。数値を入力してください。");
		}

		if (!isMaintenanceCycleUnit(cycleUnit)) {
			throw new ApiError(
				400,
				`周期単位が不正です。使用可能な単位: ${VALID_UNITS.join(", ")}`
			);
		}

		const { data, error } = await supabase
			.from("maintenance_tasks")
			.insert({
				furniture_id: id,
				name: taskName,
				cycle_value: parsedCycleValue,
				cycle_unit: cycleUnit,
			})
			.select()
			.single();

		if (error) throw new Error(`メンテナンスタスク追加エラー: ${error.message}`);

		return NextResponse.json(data, { status: 200 });
	} catch (error: unknown) {
		return handleApiError(error, "メンテナンスタスクの追加追加に失敗しました");
	}
}
