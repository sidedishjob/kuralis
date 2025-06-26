# データモデル

## データベーススキーマ

### カテゴリーテーブル (categories)

```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    icon TEXT
);
```

### ロケーションテーブル (locations)

```sql
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL
);
```

### 家具テーブル (furniture)

```sql
CREATE TABLE furniture (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    brand VARCHAR(100),
    category_id INT REFERENCES categories(id),
    location_id INT REFERENCES locations(id),
    image_url TEXT,
    purchased_at DATE,
    purchased_from VARCHAR(150),
    next_due_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

### メンテナンスタスクテーブル (maintenance_tasks)

```sql
CREATE TABLE maintenance_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    furniture_id UUID REFERENCES furniture(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    cycle_value INT NOT NULL,
    cycle_unit VARCHAR(10) NOT NULL CHECK (cycle_unit IN ('days', 'weeks', 'months', 'years')),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

### メンテナンス記録テーブル (maintenance_records)

```sql
CREATE TYPE maintenance_status AS ENUM ('completed', 'skipped', 'partial');

CREATE TABLE maintenance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES maintenance_tasks(id) ON DELETE SET NULL,
    performed_at DATE NOT NULL,
    notes TEXT,
    status maintenance_status DEFAULT 'completed',
    task_name VARCHAR(100),
    task_cycle_value INT,
    task_cycle_unit VARCHAR(10),
    next_due_date DATE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

## セキュリティポリシー

### 家具テーブル

```sql
CREATE POLICY "Users can manage their own furniture" ON furniture
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### メンテナンスタスクテーブル

```sql
CREATE POLICY "Users can manage tasks for their furniture" ON maintenance_tasks
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM furniture WHERE id = furniture_id AND user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM furniture WHERE id = furniture_id AND user_id = auth.uid()));
```

### メンテナンス記録テーブル

```sql
CREATE POLICY "Users can manage records for their tasks" ON maintenance_records
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM maintenance_tasks mt JOIN furniture f ON mt.furniture_id = f.id WHERE mt.id = task_id AND f.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM maintenance_tasks mt JOIN furniture f ON mt.furniture_id = f.id WHERE mt.id = task_id AND f.user_id = auth.uid()));
```

### カテゴリーテーブル

```sql
CREATE POLICY "Anyone can read categories" ON categories
  FOR SELECT TO public USING (TRUE);
```

### ロケーションテーブル

```sql
CREATE POLICY "Users can manage their own locations" ON locations
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

## API仕様

### 家具API

#### 家具一覧取得

- エンドポイント: `/api/furniture`
- メソッド: GET
- クエリパラメータ:
    ```typescript
    {
      category_id?: number;
      location_id?: number;
      search?: string;
    }
    ```
- レスポンス:
    ```typescript
    {
      items: Furniture[];
      total: number;
    }
    ```

#### 家具詳細取得

- エンドポイント: `/api/furniture/[id]`
- メソッド: GET
- レスポンス:
    ```typescript
    {
      furniture: Furniture;
      maintenance_tasks: MaintenanceTask[];
      maintenance_records: MaintenanceRecord[];
    }
    ```

### メンテナンスAPI

#### メンテナンスタスク一覧取得

- エンドポイント: `/api/maintenance/tasks/[furniture_id]`
- メソッド: GET
- レスポンス:
    ```typescript
    {
      tasks: MaintenanceTask[];
    }
    ```

#### メンテナンス記録作成

- エンドポイント: `/api/maintenance/records`
- メソッド: POST
- リクエストボディ:
    ```typescript
    {
      task_id: string;
      performed_at: string;
      notes?: string;
      status: 'completed' | 'skipped' | 'partial';
    }
    ```
- レスポンス:
    ```typescript
    {
    	record: MaintenanceRecord;
    }
    ```

## データ型定義

### Category

```typescript
export interface Category {
	id: number;
	name: string;
	icon?: string | null;
}
```

### Location

```typescript
export interface Location {
	id: number;
	name: string;
	user_id?: string;
}
```

### Furniture

```typescript
export interface Furniture {
	id: string;
	user_id: string;
	name: string;
	brand: string;
	category_id: number;
	location_id: number;
	image_url: string;
	purchased_at: string;
	purchased_from: string;
	next_due_date: string;
	notes: string;
}
```

### MaintenanceTask

```typescript
export interface MaintenanceTask {
	id: string;
	furniture_id: string;
	name: string;
	cycle_value: number;
	cycle_unit: "days" | "weeks" | "months" | "years";
	description?: string | null;
	is_active: boolean;
	created_at: string;
}
```

### MaintenanceRecord

```typescript
export interface MaintenanceRecord {
	id: string;
	task_id: string | null;
	performed_at: string;
	next_due_date: string | null;
	status: "completed" | "skipped" | "partial";
	// 下記はDBには存在するが、APIレスポンスや画面で必要な場合のみ付与
	task_name?: string;
	task_cycle_value?: number;
	task_cycle_unit?: string;
	notes?: string | null;
	created_at?: string;
}
```
