import type { FC } from "react";
import { useModalStore, type Modal } from "./stores";

export function setActiveModal(modal: Modal | null) {
	const modalStore = useModalStore.getState();

	modalStore.setActiveModal(modal);
}

export function showDialog(modal: Omit<Modal, "className">) {
	setActiveModal({
		className: "dialog-modal",
		...modal,
	});
}
