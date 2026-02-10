"use client";

import * as React from "react";
import { toast, useToastCore } from "@/lib/toast/core";

export function useToast() {
  const { memoryState, listeners, dispatch } = useToastCore();
  const [state, setState] = React.useState(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [listeners]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}
