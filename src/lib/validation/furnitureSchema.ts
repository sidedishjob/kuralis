import { z } from "zod";

/**
 * 家具登録フォーム（Step2）用バリデーションスキーマ
 *
 * - 家具名（name）は必須：1文字以上、100文字以下
 * - 画像（image）は任意：File または null
 */
export const registerFurnitureSchema = z.object({
  name: z
    .string({ error: "家具名を入力してください" })
    .min(1, "家具名を入力してください")
    .max(100, {
      message: "家具名は100文字以内で入力してください",
    }),
  image: z
    .union([z.instanceof(File), z.null()])
    .refine(
      (file) => !file || ["image/jpeg", "image/png"].includes(file.type),
      {
        message: "JPEGまたはPNG画像のみアップロード可能です",
      },
    )
    .refine((file) => !file || file.size <= 10 * 1024 * 1024, {
      message: "画像サイズは10MB以内にしてください",
    })
    .nullable(),
});

/**
 * 家具登録フォームで使用する型
 */
export type RegisterFurnitureSchema = z.infer<typeof registerFurnitureSchema>;

/**
 * 家具更新フォーム用バリデーションスキーマ
 *
 * - 家具名（name）は必須：1文字以上、100文字以下
 * - ブランド（brand）は任意：100文字以下
 * - 設置場所（location_id）は必須：1以上
 * - 購入日（purchased_at）は任意：有効日付（YYYY-MM-DD形式、実在日付）
 * - 購入場所（purchased_from）は任意：100文字以下
 * - 備考（notes）は任意：1000文字以下
 * - 画像（image）は任意：有効ファイル、JPEGまたはPNG画像のみ、10MB以下
 */
export const furnitureEditSchema = z.object({
  name: z
    .string({ error: "家具名を入力してください" })
    .min(1, "家具名を入力してください")
    .max(100, {
      message: "家具名は100文字以内で入力してください",
    }),
  brand: z
    .string()
    .trim()
    .max(100, {
      message: "ブランド名は100文字以内で入力してください",
    })
    .optional(),
  location_id: z
    .number({ error: "設置場所を選択してください。" })
    .min(1, "有効な設置場所を選択してください。"),
  purchased_at: z
    .string()
    .refine(
      (val) => {
        if (!val) return true;
        const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(val);
        const date = new Date(val);
        return isValidFormat && !isNaN(date.getTime());
      },
      {
        message: "有効な日付を YYYY-MM-DD 形式で入力してください",
      },
    )
    .optional(),
  purchased_from: z
    .string()
    .trim()
    .max(100, {
      message: "購入店舗名は100文字以内で入力してください",
    })
    .optional(),
  notes: z
    .string()
    .trim()
    .max(1000, {
      message: "備考は1000文字以内で入力してください",
    })
    .optional(),
  image: z
    .any()
    .optional()
    .refine(
      (file) => {
        // 画像が未設定（null/undefined）はスルー
        if (file == null) return true;
        return file instanceof File;
      },
      {
        message: "有効なファイルを選択してください",
      },
    )
    .refine(
      (file) => {
        if (!(file instanceof File)) return true;
        return ["image/jpeg", "image/png"].includes(file.type);
      },
      {
        message: "JPEGまたはPNG画像のみアップロード可能です",
      },
    )
    .refine(
      (file) => {
        if (!(file instanceof File)) return true;
        return file.size <= 10 * 1024 * 1024;
      },
      {
        message: "画像サイズは10MB以内にしてください",
      },
    ),
});

/**
 * 家具更新フォームで使用する型
 */
export type FurnitureEditSchema = z.infer<typeof furnitureEditSchema>;
