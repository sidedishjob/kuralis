import { NextResponse } from "next/server";
import { addMaintenanceRecord } from "@/lib/server/maintenanceRecord";
import { getUserFromCookie } from "@/lib/supabase/server";

export async function POST(req: Request) {
	const user = await getUserFromCookie();
	if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

	const { taskId, performedAt } = await req.json();
	try {
		const record = await addMaintenanceRecord({ taskId, performedAt });
		return NextResponse.json(record, { status: 200 });
	} catch (e) {
		return NextResponse.json({ message: "DB登録に失敗しました" }, { status: 500 });
	}
}
