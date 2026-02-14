"use client";

import type { CSSProperties } from "react";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
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
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
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
