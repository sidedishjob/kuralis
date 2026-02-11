import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage() {
  // SSRでユーザー取得（セッションCookieあり）
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // すでにログイン済みなら家具一覧へ
  if (user) {
    redirect("/furniture");
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <LoginForm />
      </div>
    </div>
  );
}
