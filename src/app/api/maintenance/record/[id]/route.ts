import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * 家具の削除（DELETE）
 */
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
	const supabase = await createSupabaseServerClient();

	// const { id } = await params;

	const { error } = await supabase.from("maintenance_records").delete().eq("id", params.id);

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({ message: "削除成功" });
}
