import type { InputHTMLAttributes } from "react";
import { clsx } from "clsx";

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const TextInput = ({ className, ...textInputProps }: TextInputProps) => {
	return <input type="text" className={clsx("text-input", className)} {...textInputProps} />;
};
