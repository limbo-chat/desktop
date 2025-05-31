import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";
import { LoadingSpinner } from "./loading-spinner";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
	isLoading?: boolean;
}

export const Button = ({
	disabled,
	isLoading,
	className,
	children,
	...buttonProps
}: ButtonProps) => {
	return (
		<button
			disabled={disabled || isLoading}
			data-loading={isLoading || undefined}
			className={clsx("button", className)}
			{...buttonProps}
		>
			{isLoading ? <LoadingSpinner /> : children}
		</button>
	);
};
