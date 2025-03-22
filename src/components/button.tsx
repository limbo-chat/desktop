import { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = (buttonProps: ButtonProps) => {
	return (
		<button
			className="bg-accent py-sm px-lg rounded-md hover:bg-accent-light"
			{...buttonProps}
		/>
	);
};
