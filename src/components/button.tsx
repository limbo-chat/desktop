import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import "./button.scss";

const buttonVariants = cva("button", {
	variants: {
		color: {
			primary: "button-primary",
			secondary: "button-secondary",
		},
		size: {
			default: "button-default",
			icon: "button-icon",
		},
	},
	defaultVariants: {
		color: "primary",
		size: "default",
	},
});

export interface ButtonProps
	extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color">,
		VariantProps<typeof buttonVariants> {}

export const Button = ({ color, className, ...buttonProps }: ButtonProps) => {
	return <button className={buttonVariants({ className, color })} {...buttonProps} />;
};
