import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { LoadingSpinner } from "./loading-spinner";

export const buttonVariants = cva("button", {
	variants: {
		variant: {
			default: "",
			ghost: "button--ghost",
		},
		color: {
			primary: "button--primary",
			secondary: "button--secondary",
			destructive: "button--destructive",
		},
	},
	defaultVariants: {
		color: "primary",
		variant: "default",
	},
});

export interface ButtonProps
	extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color">,
		VariantProps<typeof buttonVariants> {
	isLoading?: boolean;
}

export const Button = ({
	variant,
	color,
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
			className={buttonVariants({ className, variant, color })}
			{...buttonProps}
		>
			{isLoading ? <LoadingSpinner /> : children}
		</button>
	);
};
