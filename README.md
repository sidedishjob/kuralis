# Kuralis

Kuralisは、Next.js 15.3.2を使用した最新のWebアプリケーションです。TypeScript、Tailwind CSS、Supabaseを活用したモダンなスタックで構築されています。

## 🚀 技術スタック

- **フレームワーク**: Next.js 15.3.2
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS 4.1.7
- **バックエンド**: Supabase
- **UIコンポーネント**: Radix UI
- **フォーム管理**: React Hook Form + Zod
- **状態管理**: SWR
- **その他**: date-fns, uuid

## 🛠️ 開発環境のセットアップ

### 必要条件

- Node.js (最新のLTS版推奨)
- npm または yarn
- Supabaseアカウント

### インストール

```bash
# リポジトリのクローン
git clone [repository-url]

# 依存関係のインストール
npm install
# または
yarn install

# 環境変数の設定
cp .env.example .env.local
```

### 環境変数の設定

`.env.local`ファイルに以下の環境変数を設定してください：

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
# ※SupabaseのService Role Keyはクライアント公開せず、
# サーバー環境（CI/CDやAPIルート）でのみ利用してください。
```

## 🏃‍♂️ 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
```

開発サーバーは http://localhost:3002 で起動します。

## 📝 利用可能なスクリプト

- `npm run dev`: 開発サーバーの起動
- `npm run build`: プロダクションビルドの作成
- `npm run start`: プロダクションサーバーの起動
- `npm run lint`: ESLintによるコードチェック
- `npm run format`: Prettierによるコードフォーマット

## 🏗️ プロジェクト構造

```
kuralis/
├── src/              # ソースコード
│ ├── app/            # Next.js App Router のルート
│ ├── components/     # Atomic Design ベースの UI コンポーネント
│ ├── hooks/          # カスタムフック
│ ├── lib/            # API クライアント・共通ユーティリティ
│ ├── types/          # TypeScript 型定義
│ └── styles/         # グローバルCSS・Tailwind設定
├── public/           # 静的ファイル
├── supabase/         # Supabase関連の設定
├── docs/             # ドキュメント
└── components.json   # UIコンポーネントの設定
```

## 🔧 開発ガイドライン

- TypeScriptの厳格な型チェックを有効にしています
- ESLintとPrettierによるコード品質の維持
- コンポーネントはAtomic Designに基づいて構成
- コミットメッセージは[Conventional Commits](https://www.conventionalcommits.org/)に従ってください

## 📚 ドキュメント

詳細なドキュメントは `docs/` ディレクトリを参照してください。

## 🚀 デプロイ

このプロジェクトはVercelへのデプロイを推奨しています：

1. Vercelアカウントを作成
2. リポジトリをVercelに接続
3. 環境変数を設定
4. デプロイを実行

## 📄 ライセンス

このプロジェクトは **MIT License** の下で公開されています。  
詳しくは [LICENSE](./LICENSE) をご覧ください。
