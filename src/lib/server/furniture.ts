import { createServerSupabase } from "@/lib/supabase/server";
import type { FurnitureWithExtras } from "@/types/furniture";
import { uploadFurnitureImage } from "../storage/image";

/**
 * SSR用：指定したユーザーの家具データを取得する
 * @param userId SupabaseのユーザーID
 * @returns 家具一覧データ（エラー時は空配列）
 */
export async function getFurniture(userId: string) {
	const supabase = await createServerSupabase();

	const { data, error } = await supabase
		.from("furniture")
		.select("*")
		.eq("user_id", userId)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("家具一覧取得エラー:", error.message);
		return [];
	}

	return data;
}

/**
 * 指定されたIDの家具情報を取得する
 * サーバーコンポーネントやAPIルートで使用（cookieからユーザー情報を参照）
 *
 * @param id 家具のID
 * @param userId ユーザーのUUID（認証済みユーザー）
 * @returns 家具情報（存在しなければ null）
 */
export async function getFurnitureById(id: string, userId: string) {
	const supabase = await createServerSupabase();

	const { data, error } = await supabase
		.from("furniture")
		.select(
			`
			id,
			user_id,
			name,
			brand,
			category_id,
			location_id,
			image_url,
			purchased_at,
			purchased_from,
			next_due_date,
			notes,
			category:categories ( id, name ),
			location:locations ( id, name )
		`
		)
		.eq("id", id)
		.eq("user_id", userId)
		.single();

	if (error || !data) {
		console.error("家具取得エラー:", error);
		return null;
	}

	// category / location の配列を単一に変換
	const formatted: FurnitureWithExtras = {
		...data,
		category: Array.isArray(data.category) ? data.category[0] : data.category,
		location: Array.isArray(data.location) ? data.location[0] : data.location,
	};
	return formatted;
}

/**
 * 家具情報を新規登録する
 * SupabaseのStorageに画像をアップロードし、画像URLと共にfurnitureテーブルに挿入する
 *
 * @param formData フォームから送信された家具情報（multipart/form-data）
 * @param userId 登録するユーザーのUUID（認証済みユーザー）
 * @throws 登録失敗・アップロード失敗・バリデーション失敗時にエラーを投げる
 */
export async function registerFurniture(formData: FormData, userId: string) {
	const supabase = await createServerSupabase();

	// 必須項目の取得とバリデーション
	const name = formData.get("name") as string;
	const categoryId = Number(formData.get("category_id"));
	const locationId = Number(formData.get("location_id"));

	if (!name || !categoryId || !locationId) {
		throw new Error("カテゴリ・設置場所・名前は必須です");
	}

	// 画像ファイルがある場合はアップロード
	const image = formData.get("image") as File | null;
	let imageUrl: string | null = null;

	if (image) {
		imageUrl = await uploadFurnitureImage(image);
	}

	const { error: insertError } = await supabase.from("furniture").insert([
		{
			user_id: userId,
			name,
			category_id: categoryId,
			location_id: locationId,
			image_url: imageUrl,
		},
	]);

	if (insertError) {
		console.error("家具登録エラー:", insertError.message);
		throw new Error("家具の登録に失敗しました");
	}
}
