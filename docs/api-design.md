# API設計

## 設計方針

- RESTful原則に従い、エンドポイントは機能単位でグループ化
- 成功レスポンスはオブジェクトを直接返却（`{ data: ... }` ラッパーなし）
- エラーレスポンスは `{ error: string, details?: unknown }` 形式で返却
- 適切なHTTPメソッド・ステータスコードを使用

### レスポンス形式

```typescript
// 成功時 — オブジェクトを直接返却
T

// 失敗時
{ error: string; details?: unknown }
```

## エンドポイント仕様

### 家具管理API

#### 家具登録

- パス: `POST /api/furniture`
- リクエスト: `multipart/form-data`（画像アップロードを含む）
- レスポンス:

  ```typescript
  {
    message: "家具の登録に成功しました";
  }
  ```

- ステータス: `200`

> **注:** 家具一覧取得はAPIルートを経由せず、SSRでサーバーコンポーネントからSupabaseを直接参照しています。

#### 家具詳細取得

- パス: `GET /api/furniture/[id]`
- レスポンス:

  ```typescript
  Furniture; // 家具オブジェクトを直接返却
  ```

- ステータス: `200`

#### 家具更新

- パス: `PUT /api/furniture/[id]`
- リクエストボディ: 家具作成と同じ
- レスポンス:

  ```typescript
  Furniture; // 更新後の家具オブジェクトを直接返却
  ```

- ステータス: `200`

#### 家具削除

- パス: `DELETE /api/furniture/[id]`
- レスポンス:

  ```typescript
  {
    success: true;
  }
  ```

- ステータス: `200`

### 家具メタ情報取得

- パス: `GET /api/furniture/meta`
- 説明: カテゴリーと設置場所の一覧を一括取得
- レスポンス:

  ```typescript
  {
    categories: Category[];
    locations: Location[];
  }
  ```

- ステータス: `200`

> **注:** 個別の `GET /api/categories` や `GET /api/locations` エンドポイントは存在しません。カテゴリーと設置場所は `/api/furniture/meta` に統合されています。

### 家具ごとのメンテナンスタスク

#### タスク一覧取得

- パス: `GET /api/furniture/[id]/tasks`
- レスポンス:

  ```typescript
  MaintenanceTaskWithRecords[]  // 配列を直接返却
  ```

- ステータス: `200`

#### タスク登録

- パス: `POST /api/furniture/[id]/tasks`
- リクエストボディ:

  ```typescript
  {
    taskName: string;
    cycleValue: string;
    cycleUnit: 'days' | 'weeks' | 'months' | 'years';
    description?: string;
  }
  ```

- レスポンス:

  ```typescript
  MaintenanceTask; // 登録されたタスクオブジェクトを直接返却
  ```

- ステータス: `200`

#### タスク更新（有効/無効切り替え）

- パス: `PATCH /api/furniture/[id]/tasks/[taskId]`
- リクエストボディ:

  ```typescript
  {
    is_active: boolean;
  }
  ```

- レスポンス:

  ```typescript
  {
    success: true;
  }
  ```

- ステータス: `200`

### メンテナンス記録

#### 記録追加

- パス: `POST /api/maintenance/record`
- リクエストボディ:

  ```typescript
  {
    taskId: string;
    performedAt: string;
  }
  ```

- レスポンス:

  ```typescript
  MaintenanceRecord; // 登録された記録オブジェクトを直接返却
  ```

- ステータス: `200`

#### 記録削除

- パス: `DELETE /api/maintenance/record/[id]`
- レスポンス:

  ```typescript
  {
    success: true;
  }
  ```

- ステータス: `200`

### お問い合わせAPI

- パス: `POST /api/contact`
- リクエストボディ:

  ```typescript
  {
    name: string;
    email: string;
    subject: string;
    message: string;
  }
  ```

- レスポンス:

  ```typescript
  {
    message: "送信成功";
  }
  ```

- ステータス: `200`

### アカウント削除API

- パス: `POST /api/delete-user`
- 説明: 認証済みユーザーのアカウントを削除
- レスポンス:

  ```typescript
  {
    message: "アカウント削除が完了しました";
  }
  ```

- ステータス: `200`

### クライアントエラーログAPI

- パス: `POST /api/log-client-error`
- 説明: クライアント側のエラーをサーバーログに記録（開発環境のみ動作）
- リクエストボディ:

  ```typescript
  {
    message: string;
    stack?: string;
    // その他のエラー情報
  }
  ```

- レスポンス:

  ```typescript
  {
    status: "ok";
  } // 開発環境でログ記録成功時
  {
    status: "ignored";
  } // 開発環境以外
  ```

- ステータス: `200`

## エラーハンドリング

- エラー時は下記形式で返却

  ```typescript
  {
    error: string;
    details?: unknown;
  }
  ```

- 主なエラーコード
  - `INVALID_REQUEST`
  - `UNAUTHORIZED`
  - `FORBIDDEN`
  - `NOT_FOUND`
  - `VALIDATION_ERROR`
  - `INTERNAL_ERROR`
