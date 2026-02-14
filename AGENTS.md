# AGENTS.md

本ファイルは、本プロジェクトにおいて
**AIエージェントおよび人間開発者が必ず守る統合ルールファイル**である。

ガバナンスルール・技術情報・コーディング規約・コマンドを単一ファイルに集約している。
実装・修正・レビュー・コミット作成時は、常に本ドキュメントを最上位ルールとして扱うこと。

> **Note:** `CLAUDE.md` は本ファイルへのシンボリックリンクである。

---

## 変更方針（Change policy）

- 明示的に指示された内容は必ず実装する。
- より良い設計・実装案がある場合は **必ず提案する**。
- 提案内容は、指示や承認がない限り **実装してはならない**。

※「より良さそう」「一般的にはこう」を理由に、
指示外の変更を黙って混ぜることを禁止する。

---

## 変更範囲の制御（Scope control）

- 指示に含まれていないファイルは原則変更しない。
- 指示内容を実現するために **必要な変更のみ例外として許可**する。
- 追加改善・リファクタリング案がある場合は、実装せず提案に留める。

---

## エラーハンドリング方針（Error handling）

- 指定された条件を満たせない場合、黙ってフォールバックしない。
- 代替挙動に切り替えるのではなく、**エラーで停止する**。
- 代替案がある場合は、実装せず提案として共有する。

---

## 判断方針（Decision making）

- 判断に迷う場合は独断で決めず、質問または提案を行う。
- 即時に質問できない場合は **現状維持**を選択する。

---

## レビュー方針（Review guidelines）

- PRレビューコメントは必ず日本語で書く。
- 指摘タイトル・本文ともに日本語で記載する。

---

## 品質ゲート（Quality gates）

実装・修正後は必ず以下のコマンドを実行する。

```bash
npm run lint && npm run prettier:check && npm run test
```

- すべて成功するまで作業完了としない。
- エラーがある場合は必ず修正する。

---

## コマンド一覧（Commands）

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

## アーキテクチャ（Architecture）

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

## コーディング規約（Coding conventions）

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

## テスト（Testing）

- 配置: `src/tests/`
- フレームワーク: Vitest 4.0.18 + Testing Library（jsdom 28.0.0）
- 全テスト: `npm run test`
- 単体テスト: `npx vitest run src/tests/path/to/file.test.ts`
- カバレッジ: `npx vitest --coverage`

---

## コミットメッセージ（Commit message）

ファイルの修正を加えて作業が一段落した際は、必ずコミットメッセージの提案を行うこと。

判定ルール詳細: `.idea/rules/commit-message-rule.md`

使用可能なプレフィックス:

- `feat:` — 新機能
- `fix:` — バグ修正
- `change:` — 既存機能の仕様変更（ユーザーが見て「変わった」と感じるもの）
- `refactor:` — 外部仕様を変えない内部整理
- `docs:` — ドキュメント更新
- `test:` — テスト追加・修正
- `chore:` — ビルド・依存関係・設定変更

形式:

```text
<prefix>: <簡潔な説明>
```

迷ったら `change` / `chore` を使う。

---

## PR作成ルール（Pull request）

- PR作成時は必ず `.github/pull_request_template.md` を使用する。
- テンプレートの項目（概要 / 変更内容 / 補足）は省略せずに記載する。
- `gh pr create` を使う場合は `-T .github/pull_request_template.md` を付与する。

---

## ドキュメントと実装の整合性（Docs & implementation consistency）

- 仕様・挙動・設定方法を変更した場合は、関連ドキュメントも同一PRで確認・更新する。
- 実装後は必ず、ドキュメントと実装に齟齬がないかを確認する。
- ドキュメント更新が必要か迷う場合は **更新が必要と判断する**。
- 対象例:
  - `README.md`
  - `docs/*.md`（`architecture.md`、`api-design.md`、`data-model.md`、`auth-flow.md`、`error-handling.md`、`form-policy.md`、`validation.md`、`deployment.md`、`features-list.md`）

### 齟齬が見つかった場合

- 実装が正しいか、ドキュメントが正しいかを独断で決めない。
- 最適と思われる対応案を提案する。
  - 実装に合わせてドキュメントを更新する案
  - ドキュメントに合わせて実装を修正する案
- 判断に迷う場合は、修正せず提案に留める。

---

## AIエージェント別ワークツリー運用（Worktree policy）

### 役割分担

- 本ワークスペース（ルートクローン）は **人間のレビュー・手動操作専用** とする。
- Codex は Codex 用ワークツリーで開発作業を行う。
- Claude Code は Claude Code 用ワークツリーで開発作業を行う。

### 待機状態（常設ワークツリー）

- AI 用ワークツリーは、待機時に必ず `origin/develop` の detached HEAD に戻す。
- 実行手順:

```bash
git fetch --prune
git switch --detach origin/develop
```

### 作業開始手順

- 作業開始時は、必ず最新取得後に `origin/develop` から作業ブランチを作成する。
- 実行手順:

```bash
git fetch --prune
git switch --no-track -c <branch> origin/develop
```

- detached HEAD のままコミットしてはならない。
- 作業ブランチ作成直後は、初回 push で upstream を必ず作成する。
- 実行手順:

```bash
git push -u origin <branch>
```

### 作業完了手順

- PR作成後、マージが完了したら AI 用ワークツリーを待機状態に戻してから、ローカル作業ブランチを削除する。
- 実行手順:

```bash
git fetch --prune
git switch --detach origin/develop
git branch -D <branch>
```

### マージ運用ルール

- 作業ブランチ → `develop`: `Squash and merge`
- `develop` → `main`: `Create a merge commit`
- `main` / `develop` への直接 push は原則行わず、PR 経由で更新する。

### 並列作業

- 並列で複数作業を行う場合は、一時ワークツリーを追加して分離する。
- 一時ワークツリーは作業完了後に削除する。
- Codex 用 / Claude Code 用の常設ワークツリーは残して運用する。

---

## 作業進捗管理（Task progress tracking）

AIエージェントが作業指示を受けた場合、以下の手順で進捗を管理すること。

### ToDo ファイルの作成

- 作業開始時に、タスクを分解した ToDo ファイルを作成する。
- 保存先・命名規則は「計画 / 調査ルール」に従う（`.idea/tasks/<task_key>/todo_<task_key>.md`）。
- 各タスクはチェックボックス形式（`- [ ]` / `- [x]`）で記載する。

### 進捗の更新

- 各タスクの着手時・完了時に ToDo ファイルを更新する。
- 作業中に新たなタスクが発生した場合は ToDo ファイルに追記する。
- すべてのタスクが完了したら、ファイル先頭に完了を示すステータスを付与する。

### 対象外

- 単一の軽微な修正（タイポ修正、1 ファイルの小さな変更など）は ToDo ファイル不要。

---

## 計画 / 調査ルール（Plan / research output）

以下の種類のアウトプットを生成した場合は、
必ず Markdown ファイルとして保存すること。

対象:

- 実行計画（plan / roadmap / step）
- ToDo リスト
- 調査結果・比較・検討メモ

### 保存先

| 区分               | 保存先                    |
| ------------------ | ------------------------- |
| 全エージェント共通 | `.idea/tasks/<task_key>/` |

- `task_key` は作業単位を表す短い英語名（kebab-case）とする。
- 1 作業 = 1 フォルダで管理し、同一作業の plan / todo / research を同一フォルダに保存する。
- 既存の `.idea/claude/` / `.idea/codex/` は過去記録として保持し、新規作成先には使わない。

### ファイル命名規則

- `plan_<task_key>.md`
- `todo_<task_key>.md`
- `research_<task_key>.md`

例（`task_key = contact-form-validation`）:

- `.idea/tasks/contact-form-validation/plan_contact-form-validation.md`
- `.idea/tasks/contact-form-validation/todo_contact-form-validation.md`
- `.idea/tasks/contact-form-validation/research_contact-form-validation.md`

### 出力ルール

1. まず Markdown 本文を構成する
2. 次に `.idea/tasks/<task_key>/` を作成し、必ずファイルに書き出す
3. チャットには要約のみを表示する

---

## Markdown 出力ルール（Markdown style）

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

---

## 本ファイルの位置づけ（Positioning of this file）

- AGENTS.md は README / docs/\*.md と同等の **共有資産**である。
- `.gitignore` には含めない。
- 人間・AI の両方が参照し、同じ前提で作業することを目的とする。
- `CLAUDE.md` は本ファイルへのシンボリックリンクであり、Claude Code が自動読み込みする。
- Codex は `AGENTS.md` を直接読み込む。
