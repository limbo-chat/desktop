export interface View<TData = unknown> {
	id: string;
	data?: TData;
}

export interface ViewStackState {
	/** The current top view in the stack */
	top: View | null;

	/** All views in the stack */
	views: View[];

	/** Push a new view onto the stack */
	push: (view: View) => void;

	/** Pop the top view off the stack */
	pop: () => void;

	/** Replace the top view with a new one */
	replace: (view: View) => void;
}

export interface ViewComponentProps<TData = unknown> {
	view: View<TData>;
}
