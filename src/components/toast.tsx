import { Toast as ArkToast } from "@ark-ui/react";
import clsx from "clsx";
import "./toast.scss";

export const ToastRoot = ({ className, ...props }: ArkToast.RootProps) => {
	return <ArkToast.Root className={clsx("toast", className)} {...props} />;
};

export const ToastTitle = ({ className, ...props }: ArkToast.TitleProps) => {
	return <ArkToast.Title className={clsx("toast__title", className)} {...props} />;
};

export const ToastDescription = ({ className, ...props }: ArkToast.DescriptionProps) => {
	return <ArkToast.Description className={clsx("toast__description", className)} {...props} />;
};

export const ToastCloseTrigger = ({ className, ...props }: ArkToast.CloseTriggerProps) => {
	return <ArkToast.CloseTrigger className={clsx("toast__close-trigger", className)} {...props} />;
};
