import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { id: string; taskId: string } }) {
	const supabase = await createSupabaseServerClient();
	const { id, taskId } = await params;
	const body = await req.json();

	const { is_active } = body;

	const { error } = await supabase
		.from("maintenance_tasks")
		.update({ is_active })
		.eq("id", taskId)
		.eq("furniture_id", id);

	if (error) {
		console.error("更新エラー:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({ success: true });
}
