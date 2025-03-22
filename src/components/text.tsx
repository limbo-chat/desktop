import { HTMLAttributes } from "react";

export interface TextProps extends HTMLAttributes<HTMLElement> {
	as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
	color?: string;
	size?: string;
}

export const Text = ({ as: Component = "p", style, ...elementProps }: TextProps) => {
	return (
		<Component
			style={{
				fontSize: elementProps.size,
				color: elementProps.color,
				...style,
			}}
			{...elementProps}
		/>
	);
};
