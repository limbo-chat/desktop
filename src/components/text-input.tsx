import type { InputHTMLAttributes } from "react";
import { clsx } from "clsx";

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const TextInput = ({ className, ...textInputProps }: TextInputProps) => {
	return (
		<input
			type="text"
			className={clsx(
				"h-10 text-t-default text-sm bg-secondary rounded-sm border border-border px-sm placeholder:text-t-muted focus:outline-none focus:border-primary",
				className
			)}
			{...textInputProps}
		/>
	);
};
