# アーキテクチャ

## 全体アーキテクチャ

kuralisは以下のようなアーキテクチャで構築されています：

- **フロントエンド**: Next.js（App Router、サーバー/クライアントコンポーネント分離、Tailwind CSS）
- **バックエンド**: Supabase（PostgreSQL、認証、ストレージ）
- **インフラ構成図**: [docs/architecture/infrastructure.png](architecture/infrastructure.png)
- **ER図**: [docs/architecture/er.png](architecture/er.png)

## 主要コンポーネント

### フロントエンド

- `src/app/` ... ページルーティング（App Router）
- `src/components/` ... UI・機能・設定・共通・認証などの再利用コンポーネント
- `src/lib/` ... API通信・バリデーション・エラー処理・Supabaseクライアント
- `src/hooks/` ... カスタムフック
- `src/contexts/` ... グローバル状態管理

### バックエンド（Supabase）

- データベーススキーマ（PostgreSQL、RLS有効）
- 認証（メール/Google、JWT）
- ストレージ（画像等）

## データフロー

1. クライアントからのリクエスト（フォーム/操作）
2. `src/proxy.ts`（ミドルウェア）でセッション自動更新・未認証ユーザーのリダイレクト
3. Next.jsサーバーコンポーネント/APIルートでの処理
4. SupabaseへのAPIリクエスト（DB/認証/ストレージ）
5. データベース処理・RLSによるアクセス制御
6. レスポンス返却・UI更新

## セキュリティ

- Supabase認証（メール/Google）
- Row Level Security (RLS) によるユーザーデータ分離
- APIルートでの認証・権限チェック
- 環境変数（.env）による機密情報管理
