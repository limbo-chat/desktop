import clsx from "clsx";

export interface IconButtonProps extends React.ComponentProps<"button"> {
	/** an identifier for the action */
	action?: string;
}

export const IconButton = ({ action, className, ...props }: IconButtonProps) => {
	return (
		<button
			type="button"
			className={clsx("icon-button", className)}
			data-action={action}
			{...props}
		/>
	);
};
