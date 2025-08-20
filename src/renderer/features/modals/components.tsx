import { useEffect } from "react";
import { FocusScope } from "@radix-ui/react-focus-scope";
import { modalContext } from "./contexts";
import { useModalStore } from "./stores";
import { closeModal } from "./utils";

export const ModalHost = () => {
	const modals = useModalStore((state) => state.modals);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const modalStore = useModalStore.getState();

			if (e.key === "Escape") {
				const topModal = modalStore.modals[modalStore.modals.length - 1];

				if (topModal) {
					closeModal(topModal);
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	return (
		<>
			{modals.map((modal) => (
				<modalContext.Provider value={{ close: () => closeModal(modal) }} key={modal.id}>
					<div className={"modal"} data-modal={modal.id}>
						<div className="modal-overlay" onClick={() => closeModal(modal)} />
						<FocusScope className="modal-content" trapped loop>
							<modal.component />
						</FocusScope>
					</div>
				</modalContext.Provider>
			))}
		</>
	);
};
