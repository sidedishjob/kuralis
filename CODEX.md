# CODEX.md

このファイルは、Codex がこのリポジトリで作業する際のガイダンスを提供する。

## 参照ドキュメント

- `AGENTS.md` — 最上位のガバナンスルール（常にこれに従う）
- `SHARED.md` — 技術情報・コーディング規約・コマンド（共通リファレンス）

---

## ワークツリー運用

AIエージェント別ワークツリー運用は `AGENTS.md` の
「AIエージェント別ワークツリー運用（Worktree policy）」を正本として、必ず従うこと。

- Codex は Codex 用ワークツリーで作業する
- 待機時は `git switch --detach origin/develop` に戻す
- 作業時は `git fetch --prune` 後に `git switch -c <branch> origin/develop` で開始する

---

## コミットメッセージ

`SHARED.md` のコミットメッセージ規約に従う。

---

## 計画 / 調査 Rule

以下の種類のアウトプットを生成した場合は、
必ず Markdown ファイルとして保存すること。

対象:

- 実行計画（plan / roadmap / step）
- ToDo リスト
- 調査結果・比較・検討メモ

保存先: `.idea/codex/`

ファイル命名規則:

- `plan_<短い英語タイトル>.md`
- `todo_<短い英語タイトル>.md`
- `research_<短い英語タイトル>.md`

出力ルール:

1. まず Markdown 本文を構成する
2. 次に必ずファイルに書き出す
3. チャットには要約のみを表示する
