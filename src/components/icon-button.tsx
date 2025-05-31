import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const IconButton = ({ className, ...props }: IconButtonProps) => {
	return <button className={clsx("icon-button", className)} {...props} />;
};
