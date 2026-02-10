# CLAUDE.md

このファイルは、Claude Code（claude.ai/code）がこのリポジトリで作業する際のガイダンスを提供します。

## ガバナンス

AGENTS.md が最上位のルール文書です。常にこれに従ってください。主なルール：

- PRレビューコメントは日本語で記述する
- 明示的に指示された内容のみ実装する。改善案は提案に留め、勝手に実装しない
- 指示されたスコープ内のファイルのみ変更する
- エラー発生時は処理を止めて代替案を提案する — サイレントフォールバック禁止
- 判断に迷う場合は、独断せず確認する

## コマンド

| タスク                                | コマンド                                        |
| ------------------------------------- | ----------------------------------------------- |
| 開発サーバー（Turbopack、ポート3002） | `npm run dev`                                   |
| ビルド                                | `npm run build`                                 |
| テスト（Vitest）                      | `npm run test`                                  |
| 単体テスト実行                        | `npx vitest run src/tests/path/to/file.test.ts` |
| Lint                                  | `npm run lint`                                  |
| フォーマットチェック                  | `npm run prettier:check`                        |
| フォーマット修正                      | `npm run format`                                |

### 品質ゲート（作業完了前に必ず実行）

```bash
npm run lint && npm run prettier:check && npm run test
```

## アーキテクチャ

**技術スタック:**

- Next.js 16.1.6（App Router）
- React 19.2.4
- TypeScript 5
- Supabase 2.95.3（PostgreSQL, Auth, Storage）
- Tailwind CSS 4.1.7
- Vitest 4.0.18（テストフレームワーク）
- Zod 4.3.6（バリデーション）
- date-fns 4.1.0（日付処理）

**`src/` 配下の主要ディレクトリ：**

- `app/` — ページとAPIルート（App Router）
- `app/api/` — REST APIルート（`route.ts` ファイル）
- `components/ui/` — ベースUIコンポーネント（shadcn/ui スタイル）
- `components/common/` — Header、Footer、Layout
- `contexts/` — React Contextプロバイダー（AuthProvider）
- `hooks/` — カスタムフック：SWRベースのデータ取得（`useFurnitureById`、`useMaintenanceTasks`）およびミューテーションフック
- `lib/supabase/` — Supabaseクライアント：`client.ts`（ブラウザ）、`server.ts`（SSR + API）
- `lib/server/` — SSR用サーバーサイドデータ取得関数
- `lib/validation/` — 全フォーム用Zodスキーマ
- `lib/errors/` — `ApiError` クラス、`errorMessageMap`
- `lib/utils/` — `handleApiError`、`apiResponse`、`getErrorMessage`
- `lib/api/route.ts` — `API_ROUTES` 定数の一元管理
- `types/` — 共有TypeScriptドメイン型
- `src/proxy.ts` — ミドルウェア：セッション自動更新 + 認証リダイレクト

**データフローパターン：**

- **SSR:** サーバーコンポーネント → `createServerSupabase()` → Supabaseからデータ取得 → クライアントにpropsとして渡す
- **CSR:** カスタムフック（SWR） → `fetcher()` → APIルート → Supabase → 型付きレスポンスを返却
- **ミューテーション:** React Hook Form + Zodバリデーション → APIルートにPOST/PUT/DELETE → 認証 + バリデーション + DB更新 → SWRキャッシュを更新

**APIルートパターン**（`app/api/` 内の全ルート共通）：

1. Supabaseでユーザー認証
2. Zodでリクエストボディをバリデーション
3. Supabaseへのクエリ/ミューテーション実行
4. `NextResponse.json(data, { status })` を返却、または `ApiError` をスロー
5. `handleApiError(error, "ユーザー向けメッセージ")` でキャッチ

**APIレスポンス形式:**

- **成功時:** オブジェクトを直接返却（`{ data: ... }` ラッパーなし）

  ```typescript
  return NextResponse.json(furniture, { status: 200 });
  ```

- **失敗時:** `{ error: string, details?: unknown }` 形式

  ```typescript
  return NextResponse.json({ error: "エラーメッセージ" }, { status: 400 });
  ```

## コーディング規約

**インポート:** 常に `@/` パスエイリアス（`src/` にマッピング）を使用する。型のみのインポートには `import type` を使用する。

**フォーマット:** Prettierデフォルト設定を使用（タブ幅4、ダブルクォート、セミコロン、末尾カンマes5、1行100文字）。

**コンポーネント設計:**

- 関数型コンポーネントのみ使用（クラスコンポーネント禁止）
- サーバーコンポーネント優先 — `'use client'` の使用は最小限に
- 型よりインターフェース優先（`interface` over `type`）
- ディレクトリ名は小文字+ダッシュ（例: `maintenance-tasks/`）

**エラーメッセージ:** ログは `〜エラー` 形式。ユーザー向けメッセージは `〜に失敗しました` 形式。

**エラーハンドリング詳細:**

API層（`app/api/**/route.ts`）:

```typescript
import { ApiError } from "@/lib/errors/ApiError";
import { handleApiError } from "@/lib/utils/handleApiError";

// 認証エラー
if (!user) {
  throw new ApiError(401, "認証が必要です");
}

// エラーキャッチ
catch (error: unknown) {
  return handleApiError(error, "ユーザー向け失敗メッセージ");
}
```

クライアント層（`hooks/`, `components/`）:

```typescript
import { getErrorMessage } from "@/lib/utils/getErrorMessage";

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

主要ユーティリティ:

- `handleApiError(error, fallbackMessage)` — API層用
- `getErrorMessage(error, fallback)` — クライアント層用（`errorMessageMap` で日本語化）
- `ApiError` クラス — カスタムエラー（status, message, details）

詳細は `docs/error-handling.md` を参照。

**フォーム:** React Hook Form + Zod + `FormProvider` パターン。

基本実装:

```typescript
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function MyForm() {
  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { ... },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {/* フィールドコンポーネント */}
      </form>
    </FormProvider>
  );
}
```

フィールドコンポーネント:

- `useFormContext()` でフォーム状態にアクセス
- `register(name)` でフィールドを登録
- エラーは `<span role="alert">{errors[name].message}</span>` で表示
- 必須フィールドは `<span aria-hidden="true">*</span>` + `aria-required` 属性

命名規則: `[Entity]Form`、`[Entity]Field`、`[entity]Schema`。詳細は `docs/form-policy.md` を参照。

**テスト:**

- 配置: `src/tests/`
- フレームワーク: Vitest 4.0.18 + Testing Library（jsdom 28.0.0環境）
- 実行コマンド:
  - 全テスト: `npm run test`
  - 単体テスト: `npx vitest run src/tests/path/to/file.test.ts`
  - カバレッジ: `npx vitest --coverage`

**データベース型:** `src/lib/database.types.ts` に自動生成 — 手動編集禁止。

## 品質ゲート

**作業完了前に必ず実行:**

```bash
npm run lint && npm run prettier:check && npm run test
```

- すべて成功するまで作業完了としない
- エラーがある場合は必ず修正する
- 詳細は `AGENTS.md` の「品質ゲート（Quality gates）」セクション参照

## コミットメッセージ

ファイルの修正を加えて作業が一段落した際は、必ずコミットメッセージの提案を行うこと。

**ルール:** `~/.claude/commit-message-rule.md` に従う

**使用可能なプレフィックス:**

- `feat:` — 新機能
- `fix:` — バグ修正
- `change:` — 既存機能の仕様変更
- `refactor:` — リファクタリング
- `docs:` — ドキュメント更新
- `test:` — テスト追加・修正
- `chore:` — ビルド・依存関係・設定変更

**形式:**

```text
<prefix>: <簡潔な説明>

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

## ドキュメント

実装変更が動作・仕様・設定に影響する場合、同一PRで関連ドキュメントも更新すること。詳細な設計ドキュメントは `docs/` に配置：

- `architecture.md`、`api-design.md`、`data-model.md`、`auth-flow.md`
- `error-handling.md`、`form-policy.md`、`validation.md`
- `deployment.md`、`features-list.md`

## 計画 / 調査 Rule

以下の種類のアウトプットを生成した場合は、
**必ず Markdown ファイルとして保存すること。**

対象：

- 実行計画（plan / roadmap / step）
- ToDo リスト
- 調査結果・比較・検討メモ

保存先：

- /.idea/claude/

ファイル命名規則：

- plan\_<短い英語タイトル>.md
- todo\_<短い英語タイトル>.md
- research\_<短い英語タイトル>.md

出力ルール：

1. まず Markdown 本文を構成する
2. 次に必ずファイルに書き出す
3. チャットには要約のみを表示する

## Markdown 出力ルール

- 本プロジェクトでは `markdownlint` の設定ファイルや CI による運用は行わない。
- VS Code の標準的な `markdownlint` 拡張機能で表示される **一般的な警告が出ないこと** を目標とする。
- AI が新規作成・更新する `.md` は、以下の記法ルールと整形方針を必ず守ること。

### 見出しルール

- 見出し（`#`）の前後には必ず 1 行の空行を入れる。
- 見出し直下での強調記法（`**太字**`）は、警告の原因になりやすいため避ける。

### コードブロックルール

- コードブロックの前後には必ず 1 行の空行を入れる。
- コードブロックには必ず言語名を入れる。

### 箇条書きの記法ルール

- 箇条書きは `-` の直後に **半角スペース 1 つ** を入れる。
  - 正: `- item`
  - 誤: `-   item`
- ネストした箇条書きは **スペース 2 つ** でインデントする。
- チェックボックス付きリストも同様に、`- [x] item` の形式とする。

例:

```md
- [x] date-fns 3.6.0 → 4.1.0
  - 更新完了
  - 全テスト（199件）パス ✅
```
