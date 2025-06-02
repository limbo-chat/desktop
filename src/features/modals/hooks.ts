import { useContext } from "react";
import { modalContext } from "./contexts";
import { useModalStore } from "./stores";

export const useActiveModal = () => {
	return useModalStore((state) => state.activeModal);
};

export const useModalContext = () => {
	const ctx = useContext(modalContext);

	if (!ctx) {
		throw new Error("useModalContext must be used within a Modal");
	}

	return ctx;
};
