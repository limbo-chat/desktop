import * as RadixDialog from "@radix-ui/react-dialog";
import clsx from "clsx";
import type { PropsWithChildren } from "react";

export interface ModalRootProps extends RadixDialog.DialogProps {}

export const ModalRoot = RadixDialog.Root;

export interface ModalContentProps extends PropsWithChildren {
	className?: string;
}

export const ModalContent = ({ className, children }: ModalContentProps) => {
	return (
		<RadixDialog.Portal>
			<div className={clsx("modal", className)}>
				<RadixDialog.Overlay className="modal-overlay" />
				<RadixDialog.Content className="modal-content">{children}</RadixDialog.Content>
			</div>
		</RadixDialog.Portal>
	);
};

export interface ModalTriggerProps extends RadixDialog.DialogTriggerProps {}

export const ModalTrigger = RadixDialog.Trigger;

export interface ModalCloseTriggerProps extends RadixDialog.DialogCloseProps {}

export const ModalCloseTrigger = RadixDialog.Close;
