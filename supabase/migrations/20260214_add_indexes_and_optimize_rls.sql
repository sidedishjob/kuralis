/*
  # インデックス追加 & RLS ポリシー最適化

  1. 外部キーカラムへのインデックス追加（優先度1）
  2. RLS ポリシーの auth.uid() キャッシュ化（優先度2）
  3. クエリパターン用インデックス追加（優先度3）
*/

-- ============================================================
-- 1. 外部キーカラムへのインデックス追加
-- ============================================================

-- locations テーブル
CREATE INDEX IF NOT EXISTS idx_locations_user_id ON locations(user_id);

-- furniture テーブル
CREATE INDEX IF NOT EXISTS idx_furniture_user_id ON furniture(user_id);
CREATE INDEX IF NOT EXISTS idx_furniture_category_id ON furniture(category_id);
CREATE INDEX IF NOT EXISTS idx_furniture_location_id ON furniture(location_id);

-- maintenance_tasks テーブル
CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_furniture_id ON maintenance_tasks(furniture_id);

-- maintenance_records テーブル
CREATE INDEX IF NOT EXISTS idx_maintenance_records_task_id ON maintenance_records(task_id);

-- ============================================================
-- 2. RLS ポリシーの auth.uid() キャッシュ化
--    (select auth.uid()) でラップし、行ごとの再評価を防止
-- ============================================================

-- furniture ポリシー
DROP POLICY IF EXISTS "Users can manage their own furniture" ON furniture;
CREATE POLICY "Users can manage their own furniture" ON furniture
  FOR ALL TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- maintenance_tasks ポリシー
DROP POLICY IF EXISTS "Users can manage tasks for their furniture" ON maintenance_tasks;
CREATE POLICY "Users can manage tasks for their furniture" ON maintenance_tasks
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM furniture WHERE id = furniture_id AND user_id = (select auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM furniture WHERE id = furniture_id AND user_id = (select auth.uid())));

-- maintenance_records ポリシー
DROP POLICY IF EXISTS "Users can manage records for their tasks" ON maintenance_records;
CREATE POLICY "Users can manage records for their tasks" ON maintenance_records
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM maintenance_tasks mt JOIN furniture f ON mt.furniture_id = f.id WHERE mt.id = task_id AND f.user_id = (select auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM maintenance_tasks mt JOIN furniture f ON mt.furniture_id = f.id WHERE mt.id = task_id AND f.user_id = (select auth.uid())));

-- locations ポリシー
DROP POLICY IF EXISTS "Users can manage their own locations" ON locations;
CREATE POLICY "Users can manage their own locations" ON locations
  FOR ALL TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- ============================================================
-- 3. クエリパターン用インデックス追加
-- ============================================================

-- maintenance_tasks: is_active = true のフィルタが頻出するため部分インデックス
CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_active
  ON maintenance_tasks(furniture_id)
  WHERE is_active = true;

-- maintenance_records: task_id でフィルタ後 performed_at でソートするパターン用
CREATE INDEX IF NOT EXISTS idx_maintenance_records_task_performed
  ON maintenance_records(task_id, performed_at DESC);
