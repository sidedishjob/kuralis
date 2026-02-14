"use client";

import { ResetRequestForm } from "@/components/auth/ResetRequestForm";
import { useResetRequestPage } from "@/hooks/useResetRequestPage";

export function ResetRequestClient() {
  const { email, setEmail, loading, handleReset } = useResetRequestPage();

  return (
    <ResetRequestForm
      email={email}
      setEmail={setEmail}
      loading={loading}
      handleReset={handleReset}
    />
  );
}
