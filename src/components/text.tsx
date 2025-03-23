import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

const textVariants = cva("text", {
	variants: {
		color: {
			default: "text-t-default",
			muted: "text-t-muted",
		},
		size: {
			xs: "text-xs",
			sm: "text-sm",
			md: "text-md",
			lg: "text-lg",
			xl: "text-xl",
		},
		weight: {
			regular: "font-regular",
			medium: "font-medium",
			semibold: "font-semibold",
			bold: "font-bold",
		},
	},
	defaultVariants: {
		color: "default",
		size: "md",
		weight: "regular",
	},
});

export interface TextProps
	extends Omit<HTMLAttributes<HTMLElement>, "color">,
		VariantProps<typeof textVariants> {
	as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
}

export const Text = ({
	as: Component = "p",
	color,
	size,
	weight,
	className,
	...elementProps
}: TextProps) => {
	return (
		<Component
			className={textVariants({
				color,
				size,
				weight,
				className,
			})}
			{...elementProps}
		/>
	);
};
