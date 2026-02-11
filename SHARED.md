# SHARED.md

本ファイルは、AIエージェント（Claude Code / Codex）が共通で参照する技術情報を集約する。
ガバナンスルールは `AGENTS.md` を参照すること。

---

## コマンド

| タスク                                | コマンド                                           |
| ------------------------------------- | -------------------------------------------------- |
| 開発サーバー（Turbopack、ポート3002） | `npm run dev`                                      |
| ビルド                                | `npm run build`                                    |
| テスト（Vitest）                      | `npm run test`                                     |
| 単体テスト実行                        | `npx vitest run src/tests/path/to/file.test.ts`    |
| Lint                                  | `npm run lint`                                     |
| フォーマットチェック                  | `npm run prettier:check`                           |
| フォーマット修正                      | `npm run format`                                   |
| PR作成（テンプレート使用）            | `gh pr create -T .github/pull_request_template.md` |

### 品質ゲート（作業完了前に必ず実行）

```bash
npm run lint && npm run prettier:check && npm run test
```

- すべて成功するまで作業完了としない
- エラーがある場合は必ず修正する

---

## アーキテクチャ

### 技術スタック

- Next.js 16.1.6（App Router）/ React 19.2.4 / TypeScript 5
- Supabase 2.95.3（PostgreSQL, Auth, Storage）
- Tailwind CSS 4.1.7
- Vitest 4.0.18 + Testing Library（jsdom 28.0.0）
- Zod 4.3.6 / date-fns 4.1.0

### `src/` 配下の主要ディレクトリ

- `app/` — ページと API ルート（App Router）
- `app/api/` — REST API ルート（`route.ts`）
- `components/ui/` — ベース UI（shadcn/ui スタイル）
- `components/common/` — Header、Footer、Layout
- `contexts/` — React Context プロバイダー（AuthProvider）
- `hooks/` — SWR ベースのデータ取得 + ミューテーションフック
- `lib/supabase/` — Supabase クライアント（`client.ts` / `server.ts`）
- `lib/server/` — SSR 用データ取得関数
- `lib/validation/` — Zod スキーマ
- `lib/errors/` — `ApiError`、`errorMessageMap`
- `lib/utils/` — `handleApiError`、`apiResponse`、`getErrorMessage`
- `lib/api/route.ts` — `API_ROUTES` 定数
- `types/` — 共有ドメイン型
- `src/proxy.ts` — ミドルウェア（セッション自動更新 + 認証リダイレクト）

### データフロー

- SSR: サーバーコンポーネント → `createServerSupabase()` → Supabase → props
- CSR: SWR フック → `fetcher()` → API ルート → Supabase → 型付きレスポンス
- ミューテーション: React Hook Form + Zod → API ルート → 認証 + バリデーション + DB → SWR 再検証

### API ルートパターン（全ルート共通）

1. Supabase でユーザー認証
2. Zod でリクエストボディをバリデーション
3. Supabase クエリ / ミューテーション実行
4. `NextResponse.json(data, { status })` を返却、または `ApiError` をスロー
5. `handleApiError(error, "メッセージ")` でキャッチ

レスポンス形式:

- 成功: オブジェクト直接返却（ラッパーなし）
- 失敗: `{ error: string, details?: unknown }`

---

## コーディング規約

### インポート

- 常に `@/` パスエイリアス（`src/` にマッピング）を使用
- 型のみのインポートには `import type` を使用

### フォーマット

Prettier はリポジトリ設定（設定ファイルがない場合は Prettier デフォルト）に従う。

### コンポーネント設計

- 関数型コンポーネントのみ（クラスコンポーネント禁止）
- サーバーコンポーネント優先 — `'use client'` は最小限
- 型よりインターフェース優先（`interface` over `type`）
- ディレクトリ名は小文字 + ダッシュ（例: `maintenance-tasks/`）

### エラーメッセージ

- ログ: `〜エラー` 形式
- ユーザー向け: `〜に失敗しました` 形式

### エラーハンドリング

- API 層: `ApiError` + `handleApiError(error, fallbackMessage)` → 詳細は `docs/error-handling.md`
- クライアント層: `getErrorMessage(error, fallback)` + `errorMessageMap` → 詳細は `docs/error-handling.md`

### フォーム

- React Hook Form + Zod + `FormProvider` パターン
- 命名: `[Entity]Form`、`[Entity]Field`、`[entity]Schema`
- 詳細は `docs/form-policy.md`

### データベース型

`src/lib/database.types.ts` は自動生成 — 手動編集禁止。

---

## テスト

- 配置: `src/tests/`
- フレームワーク: Vitest 4.0.18 + Testing Library（jsdom 28.0.0）
- 全テスト: `npm run test`
- 単体テスト: `npx vitest run src/tests/path/to/file.test.ts`
- カバレッジ: `npx vitest --coverage`

---

## コミットメッセージ

ファイルの修正を加えて作業が一段落した際は、必ずコミットメッセージの提案を行うこと。

判定ルール詳細: `.idea/rules/commit-message-rule.md`

使用可能なプレフィックス:

- `feat:` — 新機能
- `fix:` — バグ修正
- `change:` — 既存機能の仕様変更
- `refactor:` — リファクタリング
- `docs:` — ドキュメント更新
- `test:` — テスト追加・修正
- `chore:` — ビルド・依存関係・設定変更

形式:

```text
<prefix>: <簡潔な説明>
```

---

## ドキュメント整合性

実装変更が動作・仕様・設定に影響する場合、同一 PR で関連ドキュメントも更新すること。

設計ドキュメント一覧（`README` / `docs/`）:

- `README.md`
- `architecture.md`、`api-design.md`、`data-model.md`、`auth-flow.md`
- `error-handling.md`、`form-policy.md`、`validation.md`
- `deployment.md`、`features-list.md`

---

## Markdown 出力ルール

- `markdownlint` の設定ファイルや CI による運用は行わない
- VS Code の `markdownlint` 拡張で一般的な警告が出ないことを目標とする

### 見出しルール

- 見出し（`#`）の前後には必ず 1 行の空行を入れる
- 見出し直下での強調記法（`**太字**`）は避ける

### コードブロックルール

- コードブロックの前後には必ず 1 行の空行を入れる
- コードブロックには必ず言語名を入れる

### 箇条書きルール

- `-` の直後に半角スペース 1 つ（正: `- item` / 誤: `-   item`）
- ネストはスペース 2 つでインデント
- チェックボックス: `- [x] item` の形式
