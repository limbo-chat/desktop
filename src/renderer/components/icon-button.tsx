import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	/** an identifier for the action */
	action?: string;
}

export const IconButton = ({ action, className, ...props }: IconButtonProps) => {
	return <button className={clsx("icon-button", className)} data-action={action} {...props} />;
};
