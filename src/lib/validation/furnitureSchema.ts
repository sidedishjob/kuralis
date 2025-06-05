import { z } from "zod";

/**
 * 家具登録フォーム（Step2）用バリデーションスキーマ
 *
 * - 家具名（name）は必須：1文字以上
 * - 画像（image）は任意：File または null
 */
export const registerFurnitureSchema = z.object({
	name: z.string({ required_error: "家具名は必須です" }).min(1, "家具名を入力してください"),
	image: z.union([z.instanceof(File), z.null()]).nullable(),
});

/**
 * 家具登録フォームで使用する型
 */
export type RegisterFurnitureSchema = z.infer<typeof registerFurnitureSchema>;

/**
 * 家具更新用バリデーションスキーマ
 *
 * - 家具名（name）は必須：1文字以上
 * - 画像（image）は任意：File または null
 */
export const furnitureEditSchema = z.object({
	name: z.string().min(1, "家具名は必須です"),
	brand: z.string().optional().nullable(),
	location_id: z.union([z.string(), z.number()], {
		invalid_type_error: "設置場所を選択してください",
	}),
	purchased_from: z.string().optional().nullable(),
	notes: z.string().optional().nullable(),
	purchased_at: z.string().optional().nullable(), // yyyy-mm-dd
	image: z.instanceof(File).optional().or(z.literal(null)),
});

/**
 * 家具更新フォームで使用する型
 */
export type FurnitureEditSchema = z.infer<typeof furnitureEditSchema>;
