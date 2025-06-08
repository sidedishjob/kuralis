import { z } from "zod";

/**
 * メンテナンスタスク追加フォーム用バリデーションスキーマ
 *
 * - 項目名（taskName）は必須：1文字以上
 * - 周期値（cycleValue）は必須：正の整数（文字列として受け取る）
 * - 周期単位（cycleUnit）は必須："days" | "weeks" | "months" | "years" のいずれか
 */
export const maintenanceTaskSchema = z.object({
	taskName: z.string({ required_error: "項目名は必須です" }).min(1, "項目名を入力してください"),
	cycleValue: z
		.string({ required_error: "周期値は必須です" })
		.min(1, "周期値を入力してください")
		.regex(/^\d+$/, "周期は正の数値で入力してください"),
	cycleUnit: z.enum(["days", "weeks", "months", "years"]),
});

/**
 * メンテナンスタスク追加フォームで使用する型
 */
export type MaintenanceTaskSchema = z.infer<typeof maintenanceTaskSchema>;
