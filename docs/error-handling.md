# エラーハンドリング方針（kuralis プロジェクト）

このドキュメントでは、kuralis プロジェクトにおけるエラーハンドリングのベストプラクティスとルールをまとめます。

---

## ✅ 基本方針

| 区分             | 表現方法           | 目的                       |
| ---------------- | ------------------ | -------------------------- |
| **ログ出力**     | `〜エラー`         | 開発者向けの内部ログ       |
| **ユーザー表示** | `〜に失敗しました` | UI上でユーザーに状況を説明 |

---

## 🎯 API層（`app/api/**/route.ts`）

### ✅ 成功時

```ts
return NextResponse.json(data, { status: 200 });
```

### ✅ 認証・バリデーション・業務エラー

```ts
import { ApiError } from "@/lib/errors/ApiError";
import { handleApiError } from "@/lib/utils/handleApiError";

if (!user) {
	throw new ApiError(401, "認証が必要です");
}

// ...

catch (error: unknown) {
	return handleApiError(error, "ユーザー向け失敗メッセージ");
}
```

### ✅ 共通関数

- `handleApiError(error: unknown, fallbackMessage: string)`
    - `ApiError` → `apiErrorResponse` で message, status, details を返す
    - `Error` → message をログ出力 + fallbackMessage を返す
    - `unknown` → fallbackMessage を返す
- `apiErrorResponse(message: string, status = 500, details = null)`
    - `{ error: message, details }` 形式で返却

---

## 🎯 クライアント層（`hooks/`, `components/`）

### ✅ try-catch構文の例

```ts
try {
	await doSomething();
	toast({ title: "成功メッセージ" });
} catch (error: unknown) {
	console.error("〜エラー:", error);
	toast({
		title: "〜に失敗しました",
		description: getErrorMessage(error, "もう一度お試しください"),
		variant: "destructive",
	});
}
```

### ✅ エラーメッセージ取得ユーティリティ

```ts
import { getErrorMessage } from "@/lib/utils/getErrorMessage";

function getErrorMessage(error: unknown, fallback = "エラーが発生しました"): string {
	if (error instanceof Error) {
		const translated = errorMessageMap[error.message];
		// 未対応エラーならログ送信（開発環境のみ）
		// ...
		return translated || fallback;
	}
	return fallback;
}
```

- `errorMessageMap` で英語→日本語のカスタムエラーメッセージ変換が可能

---

## 🎯 fetch/カスタムフックでのエラーハンドリング

共通パターン：

```ts
if (!res.ok) {
	const error = await res.json().catch(() => null);
	throw new Error(error?.message || "〜に失敗しました");
}
```

---

## 📝 命名・運用ルールまとめ

| 用途       | 書き方例                       |
| ---------- | ------------------------------ |
| ログ       | `"〜エラー:", error`           |
| UIタイトル | `"〜に失敗しました"`           |
| UI説明文   | `getErrorMessage(error, "〜")` |

- エラーコードやメッセージは `errorMessageMap` で日本語化・カスタマイズ可能
- 例外的に `NextResponse.json(...)` を直接返しても良い場面：
    - バリデーションエラー: `return NextResponse.json({ message: "入力不備" }, { status: 400 })`
    - 空配列を返すAPI: `return NextResponse.json([], { status: 200 })`

---

## 📦 主要な実装ファイル

- `src/lib/errors/ApiError.ts` ... API用カスタムエラークラス
- `src/lib/utils/handleApiError.ts` ... APIルート共通エラーハンドラ
- `src/lib/utils/apiResponse.ts` ... APIエラーレスポンス生成
- `src/lib/utils/getErrorMessage.ts` ... クライアント用エラーメッセージ取得
- `src/lib/errors/errorMessageMap.ts` ... 英語→日本語エラーメッセージ変換

---

今後も実装例やルールが増えた場合はこのドキュメントに追記していくこと。
