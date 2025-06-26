import { v4 as uuidv4 } from "uuid";

/**
 * ファイル名を安全な形式に変換する
 */
export function sanitizeFileName(name: string): string {
	return name
		.normalize("NFKD")
		.replace(/[^a-zA-Z0-9._-]/g, "-")
		.replace(/-+/g, "-");
}

/**
 * Supabase Storage に画像をアップロードして public URL を返す
 */
export async function uploadFurnitureImage(file: File): Promise<string> {
	const { createServerSupabase } = await import("@/lib/supabase/server"); // 遅延import
	const supabase = await createServerSupabase();

	const safeFileName = sanitizeFileName(file.name);
	const fileName = `${uuidv4()}-${safeFileName}`;

	const { error } = await supabase.storage
		.from("furniture-images")
		.upload(fileName, file, { contentType: file.type });

	if (error) throw new Error(`画像アップロード失敗: ${error.message}`);

	return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/furniture-images/${fileName}`;
}
