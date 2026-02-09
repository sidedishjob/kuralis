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
   - NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, EMAIL_USER, EMAIL_PASS, EMAIL_TO, NEXT_PUBLIC_SITE_URL

## CI/CD

### GitHub Actions

```yaml
name: CI + Deploy to Vercel

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

jobs:
  ci-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22.14.0

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Run Prettier Check
        run: npm run prettier:check

      - name: Deploy to Vercel (Production or Preview)
        if: success()
        run: |
          if [[ "$GITHUB_REF_NAME" == "main" ]]; then
            echo "Deploying to PRODUCTION..."
            npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }} --yes
          else
            echo "Deploying to PREVIEW (develop)..."
            npx vercel --token=${{ secrets.VERCEL_TOKEN }} --yes
          fi
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

<!-- ## モニタリングとログ

- アプリケーションログは`logs`ディレクトリに保存
- エラーログは`logs/error.log`に記録
- メンテナンス履歴は`logs/maintenance.log`に記録
- Next.js Analytics/Supabaseダッシュボードでパフォーマンス監視 -->

## バックアップとリカバリー

- Supabaseの自動バックアップ
- 手動バックアップの実行手順（家具・メンテナンス・ユーザーデータのエクスポート）
- リカバリープロセス：バックアップからのリストア→アプリ再デプロイ→動作確認
