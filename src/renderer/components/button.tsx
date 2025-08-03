import clsx from "clsx";
import { LoadingIcon } from "./loading-icon";

export interface ButtonProps extends React.ComponentProps<"button"> {
	/** an identifier for the action */
	action?: string;
	isLoading?: boolean;
}

export const Button = ({
	action,
	disabled,
	isLoading,
	className,
	children,
	...buttonProps
}: ButtonProps) => {
	return (
		<button
			className={clsx("button", className)}
			type="button"
			disabled={disabled || isLoading}
			data-action={action}
			data-loading={isLoading || undefined}
			{...buttonProps}
		>
			{isLoading ? <LoadingIcon /> : children}
		</button>
	);
};
