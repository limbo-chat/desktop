import { clsx } from "clsx";
import type { InputHTMLAttributes } from "react";

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const TextInput = ({ className, ...textInputProps }: TextInputProps) => {
	return <input type="text" className={clsx("text-input", className)} {...textInputProps} />;
};
