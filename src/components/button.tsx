import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva("inline-flex justify-center items-center cursor-pointer rounded-sm", {
	variants: {
		color: {
			primary: "bg-primary hover:bg-primary-hover",
			secondary: "bg-secondary hover:bg-secondary-hover",
		},
		size: {
			default: "h-10 px-md py-sm",
			icon: "size-9",
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
