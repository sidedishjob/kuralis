import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { SignupForm } from "@/components/auth/SignupForm";

export default async function SignupPage() {
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
        <SignupForm />
      </div>
    </div>
  );
}
