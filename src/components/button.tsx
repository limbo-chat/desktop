import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import "./button.scss";

export const buttonVariants = cva("button", {
	variants: {
		variant: {
			default: "",
			ghost: "button--ghost",
		},
		color: {
			primary: "button--primary",
			secondary: "button--secondary",
		},
		size: {
			md: "",
			icon: "button--icon",
		},
	},
	defaultVariants: {
		color: "primary",
		variant: "default",
		size: "md",
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
