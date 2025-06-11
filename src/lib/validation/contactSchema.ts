import { z } from "zod";

/**
 * お問い合わせフォーム用バリデーションスキーマ
 *
 * - お名前（name）：必須、1文字以上、50文字以下
 * - メールアドレス（email）：必須、email形式
 * - 件名（subject）：必須、1文字以上、50文字以下
 * - メッセージ（message）：必須、1文字以上、1000文字以下
 */
export const contactSchema = z.object({
	name: z
		.string({ required_error: "お名前は必須です" })
		.min(1, "お名前を入力してください")
		.max(50, "お名前は50文字以内で入力してください"),
	email: z
		.string({ required_error: "メールアドレスは必須です" })
		.email({ message: "有効なメールアドレスを入力してください" }),
	subject: z
		.string({ required_error: "件名名は必須です" })
		.min(1, "件名を入力してください")
		.max(50, {
			message: "件名は50文字以内で入力してください",
		}),
	message: z
		.string({ required_error: "メッセージは必須です" })
		.min(1, "メッセージを入力してください")
		.max(1000, {
			message: "メッセージは1000文字以内で入力してください",
		}),
});

/**
 * お問い合わせフォームで使用する型
 */
export type ContactSchema = z.infer<typeof contactSchema>;
