"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/hooks/useToast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingButton } from "@/components/ui/loadingButton";

interface Props {
  email: string;
}

export function VerifyEmailCard({ email }: Props) {
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    setIsResending(true);

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    setIsResending(false);

    if (error) {
      toast({
        title: "再送信に失敗しました",
        variant: "destructive",
      });
    } else {
      toast({
        title: "確認メールを再送信しました",
      });
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">メールをご確認ください</CardTitle>
        <CardDescription>
          {email}{" "}
          に確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <p className="text-muted-foreground text-center text-sm">
          迷惑メールフォルダもご確認ください
        </p>
        <LoadingButton
          isLoading={isResending}
          loadingText="送信中..."
          onClick={handleResend}
          variant="outline"
          className="w-full"
        >
          再送信
        </LoadingButton>
        <div className="text-center text-sm">
          <Link href="/auth/login" className="underline underline-offset-4">
            ログインページへ
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
