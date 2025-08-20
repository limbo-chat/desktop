import { useModalStore, type Modal } from "./stores";

export function showModal(modal: Modal) {
	const modalStore = useModalStore.getState();

	modalStore.addModal(modal);
}

export function removeModal(modalId: string) {
	const modalStore = useModalStore.getState();

	modalStore.removeModal(modalId);
}

export function closeModal(modal: Modal) {
	if (modal.onClose) {
		modal.onClose();
	}

	removeModal(modal.id);
}

export function replaceModals(modal: Modal) {
	const modalStore = useModalStore.getState();
	const openModals = modalStore.modals;

	// close all of the currently open modals
	for (const openModal of openModals) {
		closeModal(openModal);
	}

	showModal(modal);
}
