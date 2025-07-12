# バリデーション

## バリデーションの方針

- クライアントとサーバー両方でZodを用いて型安全なバリデーションを実装
- 共通のバリデーションルール・エラーメッセージは日本語で統一
- バリデーションスキーマは再利用可能に設計

## 共通スキーマ

### 基本型

```typescript
import { z } from "zod";

// 必須文字列
export const requiredString = z
	.string({ required_error: "項目を入力してください" })
	.min(1, "項目を入力してください");

// オプショナル文字列
export const optionalString = z.string().optional();

// メールアドレス
export const email = z.string().email("有効なメールアドレスを入力してください");

// パスワード
export const password = z
	.string({ required_error: "パスワードを入力してください" })
	.min(6, { message: "パスワードは6文字以上で入力してください" });
```

## 各スキーマ

### 認証スキーマ

```typescript
import { z } from "zod";

export const signupSchema = z.object({
	email: z
		.string({ required_error: "メールアドレスを入力してください" })
		.min(1, { message: "メールアドレスを入力してください" })
		.email({ message: "有効なメールアドレスを入力してください" }),
	password: z
		.string({ required_error: "パスワードを入力してください" })
		.min(6, { message: "パスワードは6文字以上で入力してください" })
		.regex(/^[a-zA-Z0-9]+$/, { message: "パスワードは半角英数字のみで入力してください" }),
});

export const loginSchema = z.object({
	email: z
		.string({ required_error: "メールアドレスを入力してください" })
		.email({ message: "有効なメールアドレスを入力してください" }),
	password: z
		.string({ required_error: "パスワードを入力してください" })
		.min(6, { message: "パスワードは6文字以上で入力してください" })
		.regex(/^[a-zA-Z0-9]+$/, { message: "パスワードは半角英数字のみで入力してください" }),
});
```

#### パスワード変更・リセット

```typescript
export const passwordChangeSchema = z
	.object({
		currentPassword: z
			.string({ required_error: "現在のパスワードを入力してください" })
			.min(6, { message: "現在のパスワードは6文字以上で入力してください" })
			.regex(/^[a-zA-Z0-9]+$/, { message: "パスワードは半角英数字のみで入力してください" }),
		newPassword: z
			.string({ required_error: "新しいパスワードを入力してください" })
			.min(6, "新しいパスワードは6文字以上で入力してください")
			.regex(/^[a-zA-Z0-9]+$/, {
				message: "新しいパスワードは半角英数字のみで入力してください",
			}),
		confirmPassword: z.string({ required_error: "確認用パスワードを入力してください" }),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "パスワードが一致しません",
		path: ["confirmPassword"],
	});

export const passwordResetSchema = z.object({
	newPassword: z
		.string({ required_error: "パスワードを入力してください" })
		.min(6, "パスワードは6文字以上で入力してください")
		.regex(/^[a-zA-Z0-9]+$/, { message: "新しいパスワードは半角英数字のみで入力してください" }),
});
```

### お問い合わせスキーマ

```typescript
export const contactSchema = z.object({
	name: z
		.string({ required_error: "お名前を入力してください" })
		.min(1, "お名前を入力してください")
		.max(50, "お名前は50文字以内で入力してください"),
	email: z
		.string({ required_error: "メールアドレスを入力してください" })
		.email({ message: "有効なメールアドレスを入力してください" }),
	subject: z
		.string({ required_error: "件名名を入力してください" })
		.min(1, "件名を入力してください")
		.max(50, { message: "件名は50文字以内で入力してください" }),
	message: z
		.string({ required_error: "メッセージを入力してください" })
		.min(1, "メッセージを入力してください")
		.max(1000, { message: "メッセージは1000文字以内で入力してください" }),
});
```

### 家具登録・編集スキーマ

```typescript
export const registerFurnitureSchema = z.object({
	name: z
		.string({ required_error: "家具名を入力してください" })
		.min(1, "家具名を入力してください")
		.max(100, { message: "家具名は100文字以内で入力してください" }),
	image: z
		.union([z.instanceof(File), z.null()])
		.refine((file) => !file || ["image/jpeg", "image/png"].includes(file.type), {
			message: "JPEGまたはPNG画像のみアップロード可能です",
		})
		.refine((file) => !file || file.size <= 10 * 1024 * 1024, {
			message: "画像サイズは10MB以内にしてください",
		})
		.nullable(),
});

export const furnitureEditSchema = z.object({
	name: z
		.string({ required_error: "家具名を入力してください" })
		.min(1, "家具名を入力してください")
		.max(100, { message: "家具名は100文字以内で入力してください" }),
	brand: z
		.string()
		.trim()
		.max(100, { message: "ブランド名は100文字以内で入力してください" })
		.optional(),
	location_id: z
		.number({ required_error: "設置場所を選択してください。" })
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
			{ message: "有効な日付を YYYY-MM-DD 形式で入力してください" }
		)
		.optional(),
	purchased_from: z
		.string()
		.trim()
		.max(100, { message: "購入店舗名は100文字以内で入力してください" })
		.optional(),
	notes: z
		.string()
		.trim()
		.max(1000, { message: "備考は1000文字以内で入力してください" })
		.optional(),
	image: z
		.any()
		.optional()
		.refine(
			(file) => {
				if (file == null) return true;
				return file instanceof File;
			},
			{ message: "有効なファイルを選択してください" }
		)
		.refine(
			(file) => {
				if (!(file instanceof File)) return true;
				return ["image/jpeg", "image/png"].includes(file.type);
			},
			{ message: "JPEGまたはPNG画像のみアップロード可能です" }
		)
		.refine(
			(file) => {
				if (!(file instanceof File)) return true;
				return file.size <= 10 * 1024 * 1024;
			},
			{ message: "画像サイズは10MB以内にしてください" }
		),
});
```

### メンテナンスタスクスキーマ

```typescript
export const maintenanceTaskSchema = z.object({
	taskName: z
		.string({ required_error: "タスク名を入力してください" })
		.min(1, "タスク名を入力してください"),
	cycleValue: z
		.string({ required_error: "周期値を入力してください" })
		.min(1, "周期値を入力してください")
		.regex(/^\d+$/, "周期は正の数値で入力してください"),
	cycleUnit: z.enum(["days", "weeks", "months", "years"]),
});
```

## バリデーションの実装

### APIルートでのバリデーション

```typescript
import { NextResponse } from "next/server";
import { furnitureSchema } from "@/lib/validations/furniture";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const validatedData = furnitureSchema.parse(body);

		// バリデーション済みデータを使用して処理を続行
		const result = await createFurniture(validatedData);

		return NextResponse.json({ data: result });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: { code: "VALIDATION_ERROR", details: error.errors } },
				{ status: 400 }
			);
		}
		throw error;
	}
}
```

### フォームでのバリデーション

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { furnitureSchema } from '@/lib/validations/furniture';

export function FurnitureForm() {
	const form = useForm({
		resolver: zodResolver(furnitureSchema),
		defaultValues: {
			name: '',
			brand: '',
			category_id: undefined,
			location_id: undefined,
			image_url: '',
			purchased_at: '',
			purchased_from: '',
			notes: '',
		},
	});

	const onSubmit = async (data: z.infer<typeof furnitureSchema>) => {
		try {
			await createFurniture(data);
			toast.success('家具を登録しました');
		} catch (error) {
			toast.error('家具の登録に失敗しました');
		}
	};

	return (
		<form onSubmit={form.handleSubmit(onSubmit)}>
			{/* フォームフィールド */}
		</form>
	);
}
```

## カスタムバリデーション

### 日付の範囲チェック

```typescript
export const dateRangeSchema = z
	.object({
		startDate: date,
		endDate: date,
	})
	.refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
		message: "開始日は終了日以前を指定してください",
		path: ["startDate"],
	});
```

### 一意性チェック

```typescript
export const uniqueLocationSchema = z
	.object({
		name: requiredString,
	})
	.refine(
		async (data) => {
			const exists = await checkLocationExists(data.name);
			return !exists;
		},
		{
			message: "このロケーション名は既に使用されています",
			path: ["name"],
		}
	);
```

## エラーメッセージのカスタマイズ

### エラーメッセージの定義

```typescript
const validationMessages = {
	required: "必須項目です",
	invalidEmail: "有効なメールアドレスを入力してください",
	minLength: (field: string, length: number) => `${field}は${length}文字以上で入力してください`,
	maxLength: (field: string, length: number) => `${field}は${length}文字以内で入力してください`,
	invalidFormat: (field: string) => `${field}の形式が正しくありません`,
	invalidUrl: "有効なURLを入力してください",
	invalidUuid: "有効なUUIDを入力してください",
} as const;
```

### エラーメッセージの使用

```typescript
export const customSchema = z.object({
	name: z.string().min(1, validationMessages.required),
	email: z.string().email(validationMessages.invalidEmail),
	description: z
		.string()
		.min(10, validationMessages.minLength("説明", 10))
		.max(1000, validationMessages.maxLength("説明", 1000)),
	url: z.string().url(validationMessages.invalidUrl),
	id: z.string().uuid(validationMessages.invalidUuid),
});
```
