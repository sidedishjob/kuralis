
-- Insert dummy categories
INSERT INTO categories (id, name, icon) VALUES
  (1, 'チェア', '🪑'),
  (2, 'テーブル', '🛋️'),
  (3, 'ソファ', '🛏️');

-- Insert dummy locations
INSERT INTO locations (id, user_id, name) VALUES
  (1, '0bf081fa-775f-469f-8c02-090ff2e665bd', 'リビング'),
  (2, '0bf081fa-775f-469f-8c02-090ff2e665bd', '寝室');

-- Insert dummy furniture
INSERT INTO furniture (
  id, user_id, name, brand, category_id, location_id, image_url, purchased_at, purchased_from, notes
) VALUES
  (gen_random_uuid(), '0bf081fa-775f-469f-8c02-090ff2e665bd', 'ダイニングチェア', '無印良品', 1, 1, 'https://example.com/image1.jpg', '2022-01-15', '無印良品 銀座', '木製の椅子'),
  (gen_random_uuid(), '0bf081fa-775f-469f-8c02-090ff2e665bd', 'ローテーブル', 'IKEA', 2, 1, 'https://example.com/image2.jpg', '2023-05-20', 'IKEA Tokyo', '組み立て式テーブル');

-- Insert dummy maintenance tasks
INSERT INTO maintenance_tasks (
  id, furniture_id, name, cycle_value, cycle_unit, description
) VALUES
  (gen_random_uuid(), (SELECT id FROM furniture LIMIT 1), 'ネジ締め', 3, 'months', '椅子の緩みチェック'),
  (gen_random_uuid(), (SELECT id FROM furniture OFFSET 1 LIMIT 1), '表面掃除', 1, 'months', '湿らせた布で拭く');

-- Insert dummy maintenance records
INSERT INTO maintenance_records (
  id, task_id, performed_at, notes, status, task_name, task_cycle_value, task_cycle_unit, next_due_date
) VALUES
  (gen_random_uuid(), (SELECT id FROM maintenance_tasks LIMIT 1), '2024-01-01', 'ガタつきなし', 'completed', 'ネジ締め', 3, 'months', '2024-04-01'),
  (gen_random_uuid(), (SELECT id FROM maintenance_tasks OFFSET 1 LIMIT 1), '2024-02-10', '汚れなし', 'completed', '表面掃除', 1, 'months', '2024-03-10');
