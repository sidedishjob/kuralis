"use client";

import type { ReactNode } from "react";
import { toast as sonnerToast } from "sonner";

interface ToastInput {
  title?: ReactNode;
  description?: ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
}

function resolveToastMessage({
  title,
  description,
  variant = "default",
}: ToastInput): ReactNode {
  if (title !== undefined && title !== null) return title;
  if (description !== undefined && description !== null) return description;
  return variant === "destructive" ? "エラー" : "通知";
}

function showToast(input: ToastInput) {
  const { description, duration, variant = "default" } = input;
  const message = resolveToastMessage(input);
  const options = { description, duration };

  const id =
    variant === "destructive"
      ? sonnerToast.error(message, options)
      : sonnerToast(message, options);

  return {
    id: String(id),
    dismiss: () => sonnerToast.dismiss(id),
    update: (next: ToastInput) => {
      const nextVariant = next.variant ?? variant;
      const nextMessage = resolveToastMessage({
        ...next,
        variant: nextVariant,
      });
      const nextOptions = {
        description: next.description,
        duration: next.duration,
        id,
      };

      if (nextVariant === "destructive") {
        sonnerToast.error(nextMessage, nextOptions);
        return;
      }

      sonnerToast(nextMessage, nextOptions);
    },
  };
}

export function useToast() {
  return {
    toast: showToast,
    dismiss: (toastId?: string) => sonnerToast.dismiss(toastId),
  };
}
