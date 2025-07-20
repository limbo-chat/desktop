import { FocusScope } from "@radix-ui/react-focus-scope";
import clsx from "clsx";
import { useEffect } from "react";
import { modalContext } from "./contexts";
import { useActiveModal } from "./hooks";
import { setActiveModal } from "./utils";

export const ModalHost = () => {
	const activeModal = useActiveModal();

	useEffect(() => {
		if (!activeModal) {
			return;
		}

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setActiveModal(null);
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [activeModal]);

	if (!activeModal) {
		return null;
	}

	const handleClose = () => {
		setActiveModal(null);
	};

	const ModalComponent = activeModal.component;

	return (
		<modalContext.Provider value={{ close: handleClose }}>
			<div className={clsx("modal")} data-modal={activeModal.id}>
				<div className="modal-overlay" onClick={handleClose} />
				<FocusScope className="modal-content" trapped loop key={activeModal.id}>
					<ModalComponent />
				</FocusScope>
			</div>
		</modalContext.Provider>
	);
};
