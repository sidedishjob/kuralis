import { TOAST_REMOVE_DELAY } from "./constants";
import { reducer, type Action, type State, type ToasterToast } from "./reducer";

let count = 0;
function genId() {
	count = (count + 1) % Number.MAX_VALUE;
	return count.toString();
}

const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

function dispatch(action: Action) {
	memoryState = reducer(memoryState, action);
	listeners.forEach((listener) => listener(memoryState));
}

const addToRemoveQueue = (toastId: string) => {
	if (toastTimeouts.has(toastId)) return;

	const timeout = setTimeout(() => {
		toastTimeouts.delete(toastId);
		dispatch({ type: "REMOVE_TOAST", toastId });
	}, TOAST_REMOVE_DELAY);

	toastTimeouts.set(toastId, timeout);
};

type Toast = Omit<ToasterToast, "id">;

export function toast({ ...props }: Toast) {
	const id = genId();

	const update = (props: ToasterToast) => dispatch({ type: "UPDATE_TOAST", id, toast: props });

	const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

	dispatch({
		type: "ADD_TOAST",
		toast: {
			...props,
			id,
			open: true,
			onOpenChange: (open) => {
				if (!open) dismiss();
			},
		},
	});

	return { id, update, dismiss };
}

export function useToastCore() {
	return {
		memoryState,
		listeners,
		dispatch,
		addToRemoveQueue,
	};
}
