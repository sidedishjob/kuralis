import type { ToastProps } from "@/components/ui/toast";
import type { ActionType } from "./constants";

export type ToasterToast = ToastProps & {
	id: string;
	title?: React.ReactNode;
	description?: React.ReactNode;
	action?: React.ReactNode;
};

export interface State {
	toasts: ToasterToast[];
}

export type Action =
	| {
			type: ActionType["ADD_TOAST"];
			toast: ToasterToast;
	  }
	| {
			type: ActionType["UPDATE_TOAST"];
			toast: Partial<ToasterToast>;
			id: string;
	  }
	| {
			type: ActionType["DISMISS_TOAST"];
			toastId?: string;
	  }
	| {
			type: ActionType["REMOVE_TOAST"];
			toastId?: string;
	  };

export const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "ADD_TOAST":
			return {
				...state,
				toasts: [action.toast, ...state.toasts],
			};
		case "UPDATE_TOAST":
			return {
				...state,
				toasts: state.toasts.map((t) =>
					t.id === action.id ? { ...t, ...action.toast } : t
				),
			};
		case "DISMISS_TOAST": {
			const { toastId } = action;
			return {
				...state,
				toasts: state.toasts.map((t) =>
					t.id === toastId || toastId === undefined ? { ...t, open: false } : t
				),
			};
		}
		case "REMOVE_TOAST":
			return {
				...state,
				toasts: state.toasts.filter((t) => t.id !== action.toastId),
			};
		default:
			return state;
	}
};
