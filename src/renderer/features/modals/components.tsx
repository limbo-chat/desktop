import { FocusScope } from "@radix-ui/react-focus-scope";
import clsx from "clsx";
import { useEffect } from "react";
import { modalContext } from "./contexts";
import { useModalStore } from "./stores";

export const ModalHost = () => {
	const modals = useModalStore((state) => state.modals);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const modalStore = useModalStore.getState();

			if (e.key === "Escape") {
				modalStore.removeTopModal();
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	const closeModal = (modalId: string) => {
		const modalStore = useModalStore.getState();

		modalStore.removeModal(modalId);
	};

	return (
		<>
			{modals.map((modal) => (
				<modalContext.Provider value={{ close: () => closeModal(modal.id) }} key={modal.id}>
					<div className={clsx("modal")} data-modal={modal.id}>
						<div className="modal-overlay" onClick={() => closeModal(modal.id)} />
						<FocusScope className="modal-content" trapped loop>
							<modal.component />
						</FocusScope>
					</div>
				</modalContext.Provider>
			))}
		</>
	);
};
