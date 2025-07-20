import { useModalStore, type Modal } from "./stores";

export function showModal(modal: Modal) {
	const modalStore = useModalStore.getState();

	modalStore.addModal(modal);
}
