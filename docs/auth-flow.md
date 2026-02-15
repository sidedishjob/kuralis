# 認証フロー仕様（auth-flow.md）

このドキュメントでは、kuralis アプリケーションにおける**ユーザー認証の仕様とフロー**をまとめます。

---

## ✅ 認証方式の概要

| 認証方式           | 説明                                 |
| ------------------ | ------------------------------------ |
| メール＋パスワード | Supabaseの標準認証（Magic Linkなし） |
| Googleログイン     | OAuth 2.0 によるソーシャルログイン   |

---

## 📍 認証状態の保持

- SSRでは `createServerSupabase()` + `getUser()` を使用（`@supabase/ssr`）
- CSRでは `useAuth()` カスタムフックを使用（`AuthContext` 経由）
- SupabaseはJWTによりCookieベースでセッション管理

---

## 🔐 各フロー詳細

### 🔸 サインアップ（メール）

1. `/auth/signup` にアクセス
2. フォーム入力 → メール＋パスワードをSupabaseへ送信
3. Supabaseが**確認メールを送信**
4. ユーザーがメール内リンクをクリック
5. `redirectTo` で `/auth/callback` に遷移し、セッションが確立
6. `/furniture` へリダイレクト

### 🔸 ログイン（メール）

1. `/auth/login` にアクセス
2. メール＋パスワードを送信 → Supabaseで認証
3. 成功時 `/furniture` に遷移、失敗時エラートースト表示

### 🔸 Googleログイン

1. `supabase.auth.signInWithOAuth({ provider: 'google' })` 実行
2. Supabaseの `/auth/v1/authorize` にリダイレクト
3. Googleアカウント認証後、`redirectTo` で `/auth/callback` に戻る
4. Supabaseの `auth.users` に自動登録（RLS制御必須）
5. ユーザーセッションが確立し、トップ画面へ遷移

> 🔒 `auth.users` への登録前に**未登録者を拒否する処理は不可能**。Supabase Authでは先に `auth.users` に登録されるため、**ログイン後にユーザー存在チェック→未登録なら強制ログアウト or リダイレクト**が必要。

### 🔸 パスワードリセット

1. `/auth/reset-request` にてメールアドレス入力
2. Supabaseがリセット用メールを送信
3. ユーザーがメールリンクをクリック → `/auth/reset-password` にリダイレクト
4. 新しいパスワードを設定して完了

---

## ⚙ 認証関連設定（Supabase側）

| 項目               | 設定内容                                |
| ------------------ | --------------------------------------- |
| メールテンプレート | Supabase Auth 設定でカスタマイズ可能    |
| OAuth redirect     | Google → `https://.../auth/callback`    |
| JWTの有効期限      | デフォルトは1週間。必要に応じて延長可能 |

---

## 🛠 実装コンポーネント・関数一覧

| 役割                       | 使用ファイル                      |
| -------------------------- | --------------------------------- |
| フォームUI                 | `SignupForm.tsx`, `LoginForm.tsx` |
| 認証状態管理               | `contexts/AuthContext.tsx`        |
| サーバー認証クライアント   | `lib/supabase/server.ts`          |
| Supabase OAuthログイン処理 | `handleGoogleLogIn()`             |
| 認証後コールバック処理     | `app/auth/callback/route.ts`      |

---

## 🧪 認証のユースケース別挙動まとめ

| 状況                                     | 挙動                                       |
| ---------------------------------------- | ------------------------------------------ |
| 未ログイン状態で `/furniture` にアクセス | `/auth/login` にリダイレクト               |
| ログアウト                               | Cookieが削除され、`getUser()` が `null` に |

---

## ✏️ 補足事項

- `auth.users` に登録された新規ユーザーに対し、`profiles` テーブルへの insert を `handle_new_user` トリガーで実行している
- パスワード更新や削除は `/settings` ページ内で実施可能

---

## 今後の改善ポイント（案）

- ログイン試行制限（Rate LimitやRecaptcha導入）
- メールテンプレートのブランディング対応
- サインアップ承認制の検討（管理者承認フロー）
