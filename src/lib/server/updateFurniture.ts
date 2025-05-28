import { createSupabaseServerClient } from "@/lib/supabase/server";
import { uploadFurnitureImage } from "@/lib/storage/image";

export async function updateFurniture(formData: FormData, userId: string, id: string) {
	const supabase = await createSupabaseServerClient();

	const name = formData.get("name") as string;
	const brand = formData.get("brand") as string;
	const locationId = Number(formData.get("location_id"));
	const purchasedAt = formData.get("purchased_at") as string;
	const purchasedFrom = formData.get("purchased_from") as string;
	const notes = formData.get("notes") as string;

	if (!name?.trim() || !locationId) {
		throw new Error("設置場所・名前は必須です");
	}

	// 画像があればアップロードしてURL取得
	const image = formData.get("image") as File | null;
	let imageUrl: string | undefined;

	if (image) {
		imageUrl = await uploadFurnitureImage(image);
	}

	const updates: any = {
		name,
		location_id: locationId,
		updated_at: new Date().toISOString(),
	};

	// ブランド（存在すれば追加）
	if (brand) updates.brand = brand;

	// 画像（存在すれば追加）
	if (imageUrl) updates.image_url = imageUrl;

	// 購入日（文字列が存在すれば ISO 日付形式で追加）
	if (purchasedAt) {
		const date = new Date(purchasedAt);
		if (!isNaN(date.getTime())) {
			updates.purchased_at = date.toISOString();
		}
	}

	// 購入場所（存在すれば追加）
	if (purchasedFrom) updates.purchased_from = purchasedFrom;

	// 備考
	if (notes) updates.notes = notes;

	const { data, error } = await supabase
		.from("furniture")
		.update(updates)
		.eq("id", id)
		.eq("user_id", userId)
		.select()
		.single();

	if (error) throw new Error(`更新失敗: ${error.message}`);
	return data;
}
