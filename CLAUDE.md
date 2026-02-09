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

**技術スタック:** Next.js 16（App Router）+ React 19 + TypeScript + Supabase（PostgreSQL, Auth, Storage）+ Tailwind CSS 4

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
- `proxy.ts` — ミドルウェア：セッション自動更新 + 認証リダイレクト

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

## コーディング規約

**インポート:** 常に `@/` パスエイリアス（`src/` にマッピング）を使用する。型のみのインポートには `import type` を使用する。

**フォーマット（.prettierrc）:** タブ（幅4）、ダブルクォート、セミコロン、末尾カンマ（es5）、1行100文字。

**エラーメッセージ:** ログは `〜エラー` 形式。ユーザー向けメッセージは `〜に失敗しました` 形式。詳細は `docs/error-handling.md` を参照。

**フォーム:** React Hook Form + Zod + `FormProvider` パターン。命名規則：`[Entity]Form`、`[Entity]Field`、`[entity]Schema`。詳細は `docs/form-policy.md` を参照。

**テスト:** `src/tests/` に配置。Vitest + Testing Library（jsdom環境）を使用。

**データベース型:** `src/lib/database.types.ts` に自動生成 — 手動編集禁止。

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
