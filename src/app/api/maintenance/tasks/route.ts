import { NextResponse } from "next/server";
import { getMaintenanceTasksWithRecords } from "@/lib/server/maintenance";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const furnitureId = searchParams.get("furnitureId");

	if (!furnitureId) {
		return NextResponse.json({ message: "家具IDが未指定です" }, { status: 400 });
	}

	try {
		const data = await getMaintenanceTasksWithRecords(furnitureId);
		return NextResponse.json(data);
	} catch (e) {
		console.error(e);
		return NextResponse.json({ message: "取得に失敗しました" }, { status: 500 });
	}
}
