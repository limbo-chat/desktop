import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import "./button.scss";

export const buttonVariants = cva("button", {
	variants: {
		variant: {
			ghost: "button--ghost",
		},
		color: {
			primary: "button--primary",
			secondary: "button--secondary",
		},
		size: {
			icon: "button--icon",
		},
	},
	defaultVariants: {
		color: "primary",
	},
});

export interface ButtonProps
	extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color">,
		VariantProps<typeof buttonVariants> {}

export const Button = ({ variant, color, size, className, ...buttonProps }: ButtonProps) => {
	return (
		<button className={buttonVariants({ className, variant, color, size })} {...buttonProps} />
	);
};
