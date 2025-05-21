import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

export const iconButtonVariants = cva("icon-button", {
	variants: {
		color: {
			primary: "icon-button--primary",
			secondary: "icon-button--secondary",
			destructive: "icon-button--destructive",
		},
		variant: {
			default: "",
			ghost: "icon-button--ghost",
		},
	},
	defaultVariants: {
		color: "primary",
		variant: "default",
	},
});

export interface IconButtonProps
	extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color">,
		VariantProps<typeof iconButtonVariants> {}

export const IconButton = ({ variant, color, className, ...props }: IconButtonProps) => {
	return <button className={iconButtonVariants({ className, variant, color })} {...props} />;
};
