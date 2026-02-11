import { z } from "zod";

// 必須文字列
const requiredString = (message: string) =>
  z.string({ error: message }).min(1, { message });

/**
 * ログインフォーム用バリデーションスキーマ
 * - メールアドレスは必須: メールアドレス形式
 * - パスワードは必須: 6文字以上、半角英数字
 */
export const loginSchema = z.object({
  email: requiredString("メールアドレスを入力してください").email({
    message: "有効なメールアドレスを入力してください",
  }),
  password: z
    .string({ error: "パスワードを入力してください" })
    .min(6, { message: "パスワードは6文字以上で入力してください" })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "パスワードは半角英数字のみで入力してください",
    }),
});

/**
 * Loginフォームで使用する型
 */
export type LoginSchema = z.infer<typeof loginSchema>;

/**
 * サインアップフォーム用バリデーションスキーマ
 * - メールアドレスは必須: メールアドレス形式
 * - パスワードは必須: 6文字以上、半角英数字
 * - 将来的に確認用パスワードなどを追加する余地あり
 */
export const signupSchema = z.object({
  email: requiredString("メールアドレスを入力してください").email({
    message: "有効なメールアドレスを入力してください",
  }),
  password: z
    .string({ error: "パスワードを入力してください" })
    .min(6, { message: "パスワードは6文字以上で入力してください" })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "パスワードは半角英数字のみで入力してください",
    }),
});

/**
 * Signupフォームで使用する型
 */
export type SignupSchema = z.infer<typeof signupSchema>;

/**
 * パスワード変更フォーム用バリデーションスキーマ
 * - 現在のパスワードは必須（再認証用）: 6文字以上、半角英数字
 * - 新しいパスワードは必須: 6文字以上、半角英数字
 * - 確認パスワードと一致することを保証
 */
export const passwordChangeSchema = z
  .object({
    currentPassword: z
      .string({ error: "現在のパスワードを入力してください" })
      .min(6, { message: "現在のパスワードは6文字以上で入力してください" })
      .regex(/^[a-zA-Z0-9]+$/, {
        message: "パスワードは半角英数字のみで入力してください",
      }),
    newPassword: z
      .string({ error: "新しいパスワードを入力してください" })
      .min(6, "新しいパスワードは6文字以上で入力してください")
      .regex(/^[a-zA-Z0-9]+$/, {
        message: "新しいパスワードは半角英数字のみで入力してください",
      }),
    confirmPassword: z.string({
      error: "確認用パスワードを入力してください",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

/**
 * PasswordChangeフォームで使用する型
 */
export type PasswordChangeSchema = z.infer<typeof passwordChangeSchema>;

/**
 * パスワードリセットフォーム用スキーマ
 * - パスワードは必須: 6文字以上、半角英数字
 */
export const passwordResetSchema = z.object({
  newPassword: z
    .string({ error: "パスワードを入力してください" })
    .min(6, "パスワードは6文字以上で入力してください")
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "新しいパスワードは半角英数字のみで入力してください",
    }),
});

/**
 * PasswordResetフォームで使用する型
 */
export type PasswordResetSchema = z.infer<typeof passwordResetSchema>;
