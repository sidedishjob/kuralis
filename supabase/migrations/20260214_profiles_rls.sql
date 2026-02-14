/*
  # profiles テーブルの RLS 有効化

  profiles テーブルにマイグレーション管理外で RLS が未設定の可能性があるため、
  安全側として RLS を有効化し、ユーザー自身のプロフィールのみ操作可能にする。

  ALTER TABLE ... ENABLE ROW LEVEL SECURITY は冪等（既に有効でもエラーにならない）。
  ポリシーは IF NOT EXISTS で重複作成を防止。
*/

-- RLS 有効化（冪等）
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ユーザー自身のプロフィールのみ操作可能
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'profiles'
      AND policyname = 'Users can manage their own profile'
  ) THEN
    CREATE POLICY "Users can manage their own profile" ON profiles
      FOR ALL TO authenticated
      USING ((select auth.uid()) = id)
      WITH CHECK ((select auth.uid()) = id);
  END IF;
END
$$;
