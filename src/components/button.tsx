import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import "./button.scss";

export const buttonVariants = cva("button", {
	variants: {
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

export const Button = ({ color, size, className, ...buttonProps }: ButtonProps) => {
	return <button className={buttonVariants({ className, color, size })} {...buttonProps} />;
};
