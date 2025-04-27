import { Toast as ArkToast } from "@ark-ui/react";
import clsx from "clsx";

export const ToastRoot = ({ className, ...props }: ArkToast.RootProps) => {
	return <ArkToast.Root className={clsx("toast", className)} {...props} />;
};

export const ToastTitle = ({ className, ...props }: ArkToast.TitleProps) => {
	return <ArkToast.Title className={clsx("toast-title", className)} {...props} />;
};

export const ToastDescription = ({ className, ...props }: ArkToast.DescriptionProps) => {
	return <ArkToast.Description className={clsx("toast-description", className)} {...props} />;
};

export const ToastCloseTrigger = ({ className, ...props }: ArkToast.CloseTriggerProps) => {
	return <ArkToast.CloseTrigger className={clsx("toast-close-trigger", className)} {...props} />;
};
