# デプロイメントと開発環境

## 開発環境のセットアップ

### 前提条件

- Node.js 22以上
- npm 10以上
- Git

### セットアップ手順

```bash
# リポジトリのクローン
git clone https://github.com/sidedishjob/kuralis.git
cd kuralis

# 依存関係のインストール
npm install

# 環境変数ファイルを作成
cp .env.local.example .env.local
# 必要な値を .env.local に設定

# 開発サーバーの起動
npm run dev
```

## デプロイメント

### 本番環境へのデプロイ

```bash
# ビルド
npm run build

# 本番環境の起動
npm start
```

### Supabaseのセットアップ

1. プロジェクトの作成
   - Supabaseダッシュボードで新しいプロジェクトを作成
   - プロジェクトのURLとanon key、service role keyを取得
2. データベースのセットアップ
   - `supabase/migrations`ディレクトリ内のマイグレーションファイルを実行
   - RLSポリシーの設定（全テーブルで有効化、ユーザーごとにデータ分離）
   - ストレージバケットの作成（画像アップロード用）
3. 認証の設定
   - メール認証の有効化
   - Google認証の有効化（必要な場合）
4. 環境変数の設定（Vercelの場合）
   - NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
     SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SITE_URL,
     EMAIL_USER, EMAIL_PASS, EMAIL_TO

## CI/CD

### GitHub Actions

#### CI（品質検証）

| 項目             | 内容                                                                  |
| ---------------- | --------------------------------------------------------------------- |
| 対象ワークフロー | `.github/workflows/ci.yml`                                            |
| トリガー         | `push` / `pull_request`（`main`, `develop`）                          |
| 並列制御         | `concurrency` で同一 ref の重複実行をキャンセル                       |
| 実行環境         | Node `22.14.0`                                                        |
| 実行内容         | `npm ci` → `npm run lint` → `npm run prettier:check` → `npm run test` |

#### CD（Vercelデプロイ）

| 項目             | 内容                                                             |
| ---------------- | ---------------------------------------------------------------- |
| 対象ワークフロー | `.github/workflows/cd-deploy.yml`                                |
| トリガー         | `workflow_run`（CI 完了時）                                      |
| 実行条件         | `CI成功` かつ `event=push` かつ `head_branch in [main, develop]` |
| 並列制御         | `concurrency` で同一ブランチの重複デプロイをキャンセル           |
| デプロイ先       | `main` は Production（`--prod`）、`develop` は Preview           |
| 必須シークレット | `VERCEL_TOKEN`                                                   |

短い抜粋（最新の正本は workflow ファイルを参照）:

```yaml
if: >-
  github.event.workflow_run.conclusion == 'success' &&
  github.event.workflow_run.event == 'push' &&
  (github.event.workflow_run.head_branch == 'main' || github.event.workflow_run.head_branch == 'develop')
```

```bash
if [[ "$HEAD_BRANCH" == "main" ]]; then
  npx --yes vercel@50.1.3 --prod --token="$VERCEL_TOKEN" --yes
else
  npx --yes vercel@50.1.3 --token="$VERCEL_TOKEN" --yes
fi
```

#### ブランチ運用とデプロイ結果

- 作業ブランチ → `develop`: `Squash and merge`
- `develop` → `main`: `Create a merge commit`
- `develop` への push は Preview デプロイ、`main` への push は Production デプロイになるため、
  マージ戦略とデプロイ先（Preview/Production）が対応した運用になっている

#### 正本（Source of Truth）

- `.github/workflows/ci.yml`
- `.github/workflows/cd-deploy.yml`

<!-- ## モニタリングとログ

- アプリケーションログは`logs`ディレクトリに保存
- エラーログは`logs/error.log`に記録
- メンテナンス履歴は`logs/maintenance.log`に記録
- Next.js Analytics/Supabaseダッシュボードでパフォーマンス監視 -->

## バックアップとリカバリー

- Supabaseの自動バックアップ
- 手動バックアップの実行手順（家具・メンテナンス・ユーザーデータのエクスポート）
- リカバリープロセス：バックアップからのリストア→アプリ再デプロイ→動作確認
