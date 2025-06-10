import { NextResponse } from "next/server";
import { appendFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const LOG_DIR = join(process.cwd(), "logs");
const LOG_FILE_PATH = join(LOG_DIR, "client-errors.log");

export async function POST(req: Request) {
	if (process.env.NODE_ENV !== "development") {
		return NextResponse.json({ status: "ignored" });
	}

	try {
		const { message } = await req.json();

		if (!existsSync(LOG_DIR)) mkdirSync(LOG_DIR, { recursive: true });

		const timestamp = new Date().toISOString();
		appendFileSync(LOG_FILE_PATH, `[${timestamp}] ${message}\n`);

		return NextResponse.json({ status: "ok" });
	} catch (e) {
		return NextResponse.json({ status: "error", error: String(e) }, { status: 500 });
	}
}
