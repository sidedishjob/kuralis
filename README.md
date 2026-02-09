# kuralis

サービスURL : [https://kuralis.homes/](https://kuralis.homes/)

![kuralis OGP](/public/kuralis-ogp.png)

## 家具との暮らしをもっと豊かにする、家具管理 & メンテナンスアプリ

「**kuralis**」は、あなたの大切な家具を"登録・記録・メンテナンス"の 3 ステップで一元管理できる Web アプリケーションです。購入日や設置場所を忘れてしまったり、メンテナンス周期を Excel や紙で管理していた人でも、kuralis があれば家具のライフサイクルをかんたんに把握できます。

---

## 開発背景

インテリアにこだわるほど家具は増え、**「いつ買った?」「前回オイルを塗ったのはいつ?」** といった情報管理が煩雑になりがちです。開発者自身も同じ課題を抱え、**「家具との付き合い方をもっと心地よくしたい」** という思いから本プロジェクトをスタートしました。家具情報とメンテナンス履歴をクラウドに保存し、リマインダーや統計を通じて "家具と暮らす体験" をアップデートすることが kuralis の目的です。

---

## 主要な機能

| 機能カテゴリ                        | 概要                                                                                                         |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **家具登録 / 一覧 / 詳細**          | 画像・カテゴリ・設置場所・購入情報などを登録し、カードで一覧表示。                                           |
| **メンテナンスタスク管理**          | 周期 (日 / 週 / 月 / 年) と前回実施日から次回予定日を自動算出し、タスクをカレンダー & カンバン方式で可視化。 |
| **カレンダービュー / ボードビュー** | 予定が近い順・カテゴリごと・場所ごとなど複数軸でフィルタリング。ドラッグ & ドロップで状態変更。              |
| **メール & パスワード認証**         | Supabase Auth（Sign in with Google対応）を利用したセキュアな認証。パスワードリセットにも対応。               |
| **画像アップロード**                | 家具写真を Supabase Storage にアップロードし、CDN 経由で配信。                                               |

---

## 🔓 ゲストモードについて

このアプリでは、アカウント登録をせずにアプリを体験できる「ゲストモード」を提供しています。
登録の手間なく実際のUI/UXをご確認いただけます。

### ✅ ゲストモードでできること

- 各ページの閲覧
- UIの操作感・機能構成の確認
- スマホ・PCレスポンシブ対応の体験

### ❌ 制限されていること

- 登録・編集・削除などの書き込み操作
- パスワード更新などの個人機能

> ※ゲストユーザーには読み取り専用の権限（RLSにより制御）が設定されています。

### 🚀 体験方法

1. [ログイン画面](https://kuralis.homes/auth/login) にアクセス
2. 「ゲストモードで試す」ボタンをクリック
3. テストユーザーとして自動ログイン → 家具一覧へ遷移

---

## その他機能

- Skeleton UI によるローディング体験向上
- SWR によるデータ取得
- React Hook Form + Zod による型安全なフォームバリデーション
- Row Level Security (RLS) & Supabase Policy による堅牢なデータ保護
- GitHub Actions による CI / Prettier・ESLint の自動チェック

---

## 使用技術

| カテゴリ           | 技術                                                      |
| ------------------ | --------------------------------------------------------- |
| **フロントエンド** | Next.js 16.1.0 (App Router) / React 19.2.3 / TypeScript 5 |
| **バックエンド**   | Supabase 2.94.1 (PostgreSQL 15, Auth, Storage)            |
| **データ取得**     | SWR 2.3.3                                                 |
| **フォーム**       | react-hook-form 7.57.0 / Zod 3.25.57                      |
| **状態管理**       | React Context API + Custom Hook                           |
| **UI / スタイル**  | Tailwind CSS 4.1.7 / shadcn/ui / Radix UI / lucide-react  |
| **メール送信**     | nodemailer 7.0.3                                          |
| **CI / CD**        | GitHub Actions（Vercel CLI による手動デプロイ）           |
| **その他**         | date-fns / clsx / eslint / prettier                       |

※ Vercel の Git 連携による自動デプロイは無効化しており、CI成功時に GitHub Actions 経由で明示的に CLI デプロイしています。

### 技術選定理由

- **Next.js App Router** を採用し、SSR と動的ルートを活用して "初回読み込みを高速化" しつつ "ページごとのキャッシュ戦略" を柔軟に設定。
- **Supabase** は Postgres ベースで RLS が使えるため、**ユーザーごとの家具データ分離** を DB レイヤーで実現できる。Storage, Auth もワンストップで用意されている点を評価。
- **React Hook Form + Zod** により **型安全** かつ **スケーラブル** なバリデーションを実装。フォーム数が多いアプリに適している。
- **Tailwind CSS** は "ダークモード" や "レスポンシブ" をユーティリティクラスで完結でき、デザインポリシーの一貫性を保ちやすい。

---

## インフラ構成図

![infra](/docs/architecture/infrastructure.png)

> 詳細は `docs/architecture.md` を参照。

---

## ER 図

![ER図](/docs/architecture/er.png)

> SQL スキーマと詳細な解説は `docs/data-model.md` に記載。

---

## こだわった実装

- **SSR + クライアントハイドレーション**
  - 家具一覧は SSR でプリロードし、クライアントでフィルタリングのみを実行。SEO と体感速度を両立。

- **メンテナンス周期の汎用アルゴリズム**
  - `cycle_value` × `cycle_unit` を date-fns によって動的加算。単位追加も O(1) で拡張可能。

- **共通エラーハンドリング**
  - API ➜ `handleApiError` ➜ toast のレイヤー構造で、フロントのエラー UI を 1 箇所に集約。

- **画像ファイル名のサニタイズ & UUID 付与**
  - 日本語ファイル名や重複を防止し、S3 互換ストレージでの競合を回避。

---

## 今後の開発予定 (v1.0)

- リマインダー通知で期日が近いメンテナンスをダッシュボードとメールでお知らせ
- プッシュ通知 (Web Push / LINE Notify) でのメンテナンスリマインド
- 統計ダッシュボードで家具点数、カテゴリ別シェア、メンテナンス実施率などをグラフで可視化
- 家具共有機能 (URL で公開・QR コード化)
- iCal 連携 & Google Calendar エクスポート
- 複数ユーザー (家族) での共同管理
- AI による家具画像タグ付け・自動カテゴリ判定
- ダークモード（Tailwind の `dark:` クラスで実装）

---

## ローカル環境での起動方法

```bash
# 1. リポジトリをクローン
git clone https://github.com/sidedishjob/kuralis.git
cd kuralis

# 2. 環境変数を設定
cp .env.local.example .env.local
# SUPABASE_URL, SUPABASE_ANON_KEY などを入力

# 3. 依存関係をインストール
npm ci       # or pnpm install / yarn install

# 4. 開発サーバーを起動
npm run dev  # http://localhost:3002

# 5. Lint & Format
npm run lint
npm run format
```

---

## License

This project is licensed under the MIT License – see the [LICENSE](./LICENSE) file for details.
