import { useModalStore, type Modal } from "./stores";

export function setActiveModal(modal: Modal | null) {
	const modalStore = useModalStore.getState();

	modalStore.setActiveModal(modal);
}
