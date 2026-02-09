"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase/client";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import {
  passwordResetSchema,
  type PasswordResetSchema,
} from "@/lib/validation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

enum PageState {
  Loading = "loading",
  Authorized = "authorized",
}

export function usePasswordResetPage() {
  const { logout, user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [pageState, setPageState] = useState<PageState>(PageState.Loading);
  const [resetComplete, setResetComplete] = useState(false);

  const form = useForm<PasswordResetSchema>({
    resolver: zodResolver(passwordResetSchema),
  });

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setPageState(PageState.Authorized);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (authLoading || resetComplete) return;

    if (user) {
      setPageState(PageState.Authorized);
    } else {
      router.replace("/auth/reset-request");
      setTimeout(() => {
        toast({
          title: "リンクが無効です",
          description:
            "有効期限が切れているか、すでに使用済みのリンクです。再度リセットを申請してください",
          variant: "destructive",
        });
      }, 100);
    }
  }, [authLoading, user, resetComplete, router, toast]);

  const onSubmit = async ({ newPassword }: PasswordResetSchema) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      toast({
        title: "パスワードの更新に失敗しました",
        description: getErrorMessage(error, "もう一度お試しください"),
        variant: "destructive",
      });
    } else {
      toast({
        title: "パスワードを更新しました",
        description: "新しいパスワードで再度ログインしてください",
      });
      setResetComplete(true);
      await logout();
      form.reset();
      router.push("/auth/login");
    }
  };

  return {
    pageState,
    form,
    onSubmit,
  };
}
