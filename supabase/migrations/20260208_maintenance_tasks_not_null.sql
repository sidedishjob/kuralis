-- maintenance_tasks の legacy null 行を補正し、アプリ期待値に合わせて NOT NULL 制約を付与
BEGIN;

UPDATE public.maintenance_tasks
SET is_active = TRUE
WHERE is_active IS NULL;

UPDATE public.maintenance_tasks
SET created_at = CURRENT_TIMESTAMP
WHERE created_at IS NULL;

ALTER TABLE public.maintenance_tasks
ALTER COLUMN is_active SET DEFAULT TRUE,
ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN is_active SET NOT NULL,
ALTER COLUMN created_at SET NOT NULL;

COMMIT;
