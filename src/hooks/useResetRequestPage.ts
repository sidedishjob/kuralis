"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { useToast } from "@/hooks/useToast";

export function useResetRequestPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleReset = async () => {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    setLoading(false);

    if (error) {
      toast({
        title: "メールの送信に失敗しました",
        description: getErrorMessage(
          error,
          "メールの送信に失敗しました。時間をおいて再度お試しください",
        ),
        variant: "destructive",
      });
    } else {
      toast({
        title: "メールを送信しました",
        description: "パスワード再設定用のリンクを送信しました",
      });
    }
  };

  return { email, setEmail, loading, handleReset };
}
