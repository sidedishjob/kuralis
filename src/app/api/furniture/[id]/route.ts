import { NextRequest, NextResponse } from "next/server";
import { createSupabaseApiClient } from "@/lib/supabase/server";
import { getFurnitureById } from "@/lib/server/furniture";
import { uploadFurnitureImage } from "@/lib/storage/image";
import { ApiError } from "@/lib/errors/ApiError";
import { handleApiError } from "@/lib/utils/handleApiError";
import type { UpdateFurniturePayload } from "@/types/furniture";

/**
 * GET: 家具情報の取得
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const res = NextResponse.next();

  try {
    const supabase = await createSupabaseApiClient(req, res);
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) throw new ApiError(401, "未認証のため取得できません");

    const { id } = await params;
    const furniture = await getFurnitureById(id, user.id);

    return NextResponse.json(furniture, { status: 200 });
  } catch (error: unknown) {
    return handleApiError(error, "家具の取得に失敗しました");
  }
}

/**
 * PUT: 家具情報の更新
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const res = NextResponse.next();

  try {
    const supabase = await createSupabaseApiClient(req, res);
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) throw new ApiError(401, "未認証のため更新できません");

    const { id } = await params;
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const brand = formData.get("brand") as string;
    const locationId = Number(formData.get("location_id"));
    const purchasedAt = formData.get("purchased_at") as string;
    const purchasedFrom = formData.get("purchased_from") as string;
    const notes = formData.get("notes") as string;

    if (!name?.trim() || !locationId) {
      throw new ApiError(400, "設置場所・名前を入力してください");
    }

    // 1. 画像があればアップロードしてURL取得
    let imageUrl: string | undefined;
    const image = formData.get("image") as File | null;
    if (image) {
      imageUrl = await uploadFurnitureImage(image);
    }

    // 2. 更新内容構築
    const updates: UpdateFurniturePayload = {
      name,
      brand,
      location_id: locationId,
      purchased_at:
        typeof purchasedAt === "string" && purchasedAt.trim() === ""
          ? null
          : purchasedAt,
      purchased_from: purchasedFrom,
      notes,
      updated_at: new Date().toISOString(),
    };

    // 画像（存在すれば追加）
    if (imageUrl) updates.image_url = imageUrl;

    // 3. DB更新
    const { error: updateError } = await supabase
      .from("furniture")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) throw new Error(`家具更新エラー: ${updateError.message}`);

    // 4. レスポンス用のデータ取得
    const enriched = await getFurnitureById(id, user.id);
    return NextResponse.json(enriched, { status: 200 });
  } catch (error: unknown) {
    return handleApiError(error, "家具の更新に失敗しました");
  }
}

/**
 * DELETE: 家具の削除
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const res = NextResponse.next();

  try {
    const supabase = await createSupabaseApiClient(req, res);
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) throw new ApiError(401, "未認証のため削除できません");

    const { id } = await params;

    const { error: deleteError } = await supabase
      .from("furniture")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();
    if (deleteError) throw new Error(`家具削除エラー: ${deleteError.message}`);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    return handleApiError(error, "家具の削除に失敗しました");
  }
}
