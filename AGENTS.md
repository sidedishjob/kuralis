# AGENTS.md

本ファイルは、本プロジェクトにおいて
**AIエージェントおよび人間開発者が必ず守る共通ルール**を定義する。

技術情報・コーディング規約・コマンドは `SHARED.md` を参照すること。

実装・修正・レビュー・コミット作成時は、
常に本ドキュメントを最上位ルールとして扱うこと。

---

## AIドキュメント参照順（Document loading order）

- すべての AI エージェントは、まず `AGENTS.md` を参照する。
- 次に `SHARED.md` を参照し、技術情報・コーディング規約・コマンドを確認する。
- Claude Code は `CLAUDE.md`、Codex は `CODEX.md` を追加で参照する。

---

## レビュー方針（Review guidelines）

- PRレビューコメントは必ず日本語で書く。
- 指摘タイトル・本文ともに日本語で記載する。

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

## 品質ゲート（Quality gates）

- 実装・修正後は必ず以下のコマンドを実行する。
  - `npm run lint`
  - `npm run prettier:check`
  - `npm run test`
- いずれかにエラーがある場合は修正する。
- すべて成功するまで作業完了としない。

---

## コミットメッセージ（Commit message）

- コミットメッセージ案は `.idea/rules/commit-message-rule.md` に従う。

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
- 対象例：
  - `README.md`
  - `docs/*.md`

### 齟齬が見つかった場合

- 実装が正しいか、ドキュメントが正しいかを独断で決めない。
- 最適と思われる対応案を提案する。
  - 実装に合わせてドキュメントを更新する案
  - ドキュメントに合わせて実装を修正する案
- 判断に迷う場合は、修正せず提案に留める。

---

## 判断方針（Decision making）

- 判断に迷う場合は独断で決めず、質問または提案を行う。
- 即時に質問できない場合は **現状維持**を選択する。

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
git switch -c <branch> origin/develop
```

- detached HEAD のままコミットしてはならない。

### 作業完了手順

- PR作成後、マージが完了したら AI 用ワークツリーを待機状態に戻してから、ローカル作業ブランチを削除する。
- 必要に応じてリモートブランチも削除する。
- 実行手順:

```bash
git fetch --prune
git switch --detach origin/develop
git branch -d <branch>
git push origin --delete <branch> # 必要時のみ
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

## 本ファイルの位置づけ（Positioning of this file）

- AGENTS.md は README / docs/\*.md と同等の **共有資産**である。
- `.gitignore` には含めない。
- 人間・AI の両方が参照し、同じ前提で作業することを目的とする。
