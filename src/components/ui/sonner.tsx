"use client";

import type { CSSProperties } from "react";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo,
  FiLoader,
  FiXOctagon,
} from "react-icons/fi";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const toasterStyle: CSSProperties = {
  "--normal-bg": "var(--popover)",
  "--normal-text": "var(--popover-foreground)",
  "--normal-border": "var(--border)",
  "--border-radius": "var(--radius)",
} as CSSProperties;

function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      richColors
      icons={{
        success: <FiCheckCircle className="size-4" />,
        info: <FiInfo className="size-4" />,
        warning: <FiAlertTriangle className="size-4" />,
        error: <FiXOctagon className="size-4" />,
        loading: <FiLoader className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "border border-kuralis-200 bg-white text-kuralis-900 shadow-lg",
          description: "text-kuralis-600",
          actionButton: "bg-kuralis-900 text-white",
          cancelButton: "bg-kuralis-100 text-kuralis-900",
        },
      }}
      style={toasterStyle}
      {...props}
    />
  );
}

export { Toaster };
