# API設計

## 設計方針

- RESTful原則に従い、エンドポイントは機能単位でグループ化
- レスポンスは `{ data: ... }` または `{ error: ... }` で一貫
- 適切なHTTPメソッド・ステータスコードを使用
- バージョニングはURLパスで管理（現状v1は未使用）

### レスポンス形式

```typescript
// 成功時
{ data: T }

// 失敗時
{ error: { code: string; message: string; details?: unknown } }
```

## エンドポイント仕様

### 家具管理API

#### 家具一覧取得

- パス: `GET /api/furniture`
- クエリパラメータ:
    ```typescript
    {
      category_id?: number;
      location_id?: number;
      search?: string;
      page?: number;
      limit?: number;
      sort_by?: 'name' | 'created_at' | 'updated_at';
      sort_order?: 'asc' | 'desc';
    }
    ```
- レスポンス:
    ```typescript
    {
      data: {
        items: Furniture[];
        total: number;
        page: number;
        limit: number;
      }
    }
    ```

#### 家具詳細取得

- パス: `GET /api/furniture/[id]`
- レスポンス:
    ```typescript
    {
      data: {
        furniture: Furniture;
        maintenance_tasks: MaintenanceTask[];
        maintenance_records: MaintenanceRecord[];
      }
    }
    ```

#### 家具登録

- パス: `POST /api/furniture`
- リクエストボディ:
    ```typescript
    {
      name: string;
      brand?: string;
      category_id?: number;
      location_id?: number;
      image_url?: string;
      purchased_at?: string;
      purchased_from?: string;
      notes?: string;
    }
    ```
- レスポンス:
    ```typescript
    {
    	data: {
    		furniture: Furniture;
    	}
    }
    ```

#### 家具更新

- パス: `PUT /api/furniture/[id]`
- リクエストボディ: 家具作成と同じ
- レスポンス:
    ```typescript
    {
    	data: {
    		furniture: Furniture;
    	}
    }
    ```

#### 家具削除

- パス: `DELETE /api/furniture/[id]`
- レスポンス: `204 No Content`

### 家具メタ情報取得

- パス: `GET /api/furniture/meta`
- レスポンス:
    ```typescript
    {
      data: {
        categories: Category[];
        locations: Location[];
      }
    }
    ```

### 家具ごとのメンテナンスタスク取得・登録

#### タスク一覧取得

- パス: `GET /api/furniture/[id]/tasks`
- レスポンス:
    ```typescript
    {
      data: MaintenanceTaskWithRecords[];
    }
    ```

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
    {
    	data: MaintenanceTask;
    }
    ```

### メンテナンス記録追加

- パス: `POST /api/maintenance/record`
- リクエストボディ:
    ```typescript
    {
    	taskId: string;
    	performedAt: string;
    	// 必要に応じてnotes, statusなど
    }
    ```
- レスポンス:
    ```typescript
    {
    	data: MaintenanceRecord;
    }
    ```

### カテゴリー管理API

#### カテゴリー一覧取得

- パス: `GET /api/categories`
- レスポンス:
    ```typescript
    {
      data: {
        categories: Category[];
      }
    }
    ```

### ロケーション管理API

#### ロケーション一覧取得

- パス: `GET /api/locations`
- レスポンス:
    ```typescript
    {
      data: {
        locations: Location[];
      }
    }
    ```

#### ロケーション作成

- パス: `POST /api/locations`
- リクエストボディ:
    ```typescript
    {
    	name: string;
    }
    ```
- レスポンス:
    ```typescript
    {
    	data: {
    		location: Location;
    	}
    }
    ```

## エラーハンドリング

- エラー時は下記形式で返却
    ```typescript
    {
      error: {
        code: string;
        message: string;
        details?: unknown;
      }
    }
    ```
- 主なエラーコード
    - `INVALID_REQUEST`
    - `UNAUTHORIZED`
    - `FORBIDDEN`
    - `NOT_FOUND`
    - `VALIDATION_ERROR`
    - `INTERNAL_ERROR`
