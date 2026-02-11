# CLAUDE.md

このファイルは、Claude Code（claude.ai/code）がこのリポジトリで作業する際のガイダンスを提供する。

## 参照ドキュメント

- `AGENTS.md` — 最上位のガバナンスルール（常にこれに従う）
- `SHARED.md` — 技術情報・コーディング規約・コマンド（共通リファレンス）

---

## ガバナンスルール（AGENTS.md 要点）

### 変更方針

- 明示的に指示された内容は必ず実装する。
- より良い設計・実装案がある場合は **必ず提案する**。
- 提案内容は、指示や承認がない限り **実装してはならない**。
- 指示外の変更を黙って混ぜることを禁止する。

### 変更範囲の制御

- 指示に含まれていないファイルは原則変更しない。
- 指示内容を実現するために **必要な変更のみ例外として許可**する。
- 追加改善・リファクタリング案がある場合は、実装せず提案に留める。

### エラーハンドリング方針

- 指定された条件を満たせない場合、黙ってフォールバックしない。
- 代替挙動に切り替えるのではなく、**エラーで停止する**。

### 判断方針

- 判断に迷う場合は独断で決めず、質問または提案を行う。
- 即時に質問できない場合は **現状維持**を選択する。

### レビュー方針

- PRレビューコメントは必ず日本語で書く。

### PR作成ルール

- PR作成時は必ず `.github/pull_request_template.md` を使用する。
- テンプレートの項目（概要 / 変更内容 / 補足）は省略せずに記載する。
- `gh pr create` を使う場合は `-T .github/pull_request_template.md` を付与する。

### ドキュメントと実装の整合性

- 仕様・挙動・設定方法を変更した場合は、関連ドキュメントも同一PRで確認・更新する。
- ドキュメント更新が必要か迷う場合は **更新が必要と判断する**。
- 対象: `README.md`、`docs/*.md`

---

## 品質ゲート（作業完了前に必ず実行）

```bash
npm run lint && npm run prettier:check && npm run test
```

- すべて成功するまで作業完了としない。
- エラーがある場合は必ず修正する。

---

## コマンド一覧（SHARED.md 要点）

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

---

## アーキテクチャ概要

### 技術スタック

- Next.js 16.1.6（App Router）/ React 19.2.4 / TypeScript 5
- Supabase 2.95.3（PostgreSQL, Auth, Storage）
- Tailwind CSS 4.1.7
- Vitest 4.0.18 + Testing Library（jsdom 28.0.0）
- Zod 4.3.6 / date-fns 4.1.0

### `src/` 配下の主要ディレクトリ

- `app/` — ページと API ルート（App Router）
- `components/ui/` — ベース UI（shadcn/ui スタイル）
- `components/common/` — Header、Footer、Layout
- `contexts/` — React Context プロバイダー
- `hooks/` — SWR ベースのデータ取得 + ミューテーションフック
- `lib/supabase/` — Supabase クライアント（`client.ts` / `server.ts`）
- `lib/server/` — SSR 用データ取得関数
- `lib/validation/` — Zod スキーマ
- `lib/errors/` — `ApiError`、`errorMessageMap`
- `lib/utils/` — `handleApiError`、`apiResponse`、`getErrorMessage`
- `types/` — 共有ドメイン型

---

## コーディング規約（SHARED.md 要点）

- 常に `@/` パスエイリアス（`src/` にマッピング）を使用
- 型のみのインポートには `import type` を使用
- 関数型コンポーネントのみ（クラスコンポーネント禁止）
- サーバーコンポーネント優先 — `'use client'` は最小限
- 型よりインターフェース優先（`interface` over `type`）
- ディレクトリ名は小文字 + ダッシュ（例: `maintenance-tasks/`）
- エラーログ: `〜エラー` 形式 / ユーザー向け: `〜に失敗しました` 形式
- API 層: `ApiError` + `handleApiError` / クライアント層: `getErrorMessage` + `errorMessageMap`
- フォーム: React Hook Form + Zod + `FormProvider` パターン
- `src/lib/database.types.ts` は自動生成 — 手動編集禁止

---

## コミットメッセージ

`SHARED.md` のコミットメッセージ規約に従う。判定ルール詳細: `.idea/rules/commit-message-rule.md`

使用可能なプレフィックス:

- `feat:` — 新機能
- `fix:` — バグ修正
- `change:` — 既存機能の仕様変更（ユーザーが見て「変わった」と感じるもの）
- `refactor:` — 外部仕様を変えない内部整理
- `docs:` — ドキュメント更新
- `test:` — テスト追加・修正
- `chore:` — ビルド・依存関係・設定変更

形式: `<prefix>: <簡潔な説明>`

迷ったら `change` / `chore` を使う。

---

## ワークツリー運用

AIエージェント別ワークツリー運用は `AGENTS.md` の
「AIエージェント別ワークツリー運用（Worktree policy）」を正本として、必ず従うこと。

- Claude Code は Claude Code 用ワークツリーで作業する
- 待機時は `git switch --detach origin/develop` に戻す
- 作業時は `git fetch --prune` 後に `git switch -c <branch> origin/develop` で開始する

### マージ運用ルール

- 作業ブランチ → `develop`: `Squash and merge`
- `develop` → `main`: `Create a merge commit`
- `main` / `develop` への直接 push は原則行わず、PR 経由で更新する。

---

## 計画 / 調査 Rule

以下の種類のアウトプットを生成した場合は、
必ず Markdown ファイルとして保存すること。

対象:

- 実行計画（plan / roadmap / step）
- ToDo リスト
- 調査結果・比較・検討メモ

保存先: `.idea/claude/`

ファイル命名規則:

- `plan_<短い英語タイトル>.md`
- `todo_<短い英語タイトル>.md`
- `research_<短い英語タイトル>.md`

出力ルール:

1. まず Markdown 本文を構成する
2. 次に必ずファイルに書き出す
3. チャットには要約のみを表示する
