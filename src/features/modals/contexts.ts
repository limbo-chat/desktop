import { createContext } from "react";

export interface ModalContext {
	close: () => void;
}

export const modalContext = createContext<ModalContext | null>(null);
