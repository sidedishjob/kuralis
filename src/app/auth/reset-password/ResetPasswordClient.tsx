"use client";

import { PasswordResetForm } from "@/components/auth/PasswordResetForm";
import { usePasswordResetPage } from "@/hooks/usePasswordResetPage";

export function ResetPasswordClient() {
  const { pageState, form, onSubmit } = usePasswordResetPage();

  return (
    <PasswordResetForm pageState={pageState} form={form} onSubmit={onSubmit} />
  );
}
