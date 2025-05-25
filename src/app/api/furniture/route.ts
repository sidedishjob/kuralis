import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/server/supabase";

/**
 * 家具一覧を取得するAPI
 */
export async function GET() {
	const supabase = await createSupabaseServerClient();
	const { data, error } = await supabase.from("furniture").select("*");

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json(data);
}
